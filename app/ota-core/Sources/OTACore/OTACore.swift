import Foundation
#if canImport(FoundationNetworking)
// URLError lives in FoundationNetworking on Linux. No-op on Apple platforms, and
// what makes this package buildable off a Mac if CI ever moves to a cheaper runner.
import FoundationNetworking
#endif

// The parts of the OTA update channel that are pure logic: what a signed manifest
// is allowed to contain, how its timestamps parse, where a blob lives, and what a
// given failure means to the reader.
//
// They live here, in a Foundation-only module, for one reason: they are the parts
// that can be TESTED. OTAUpdater proper is welded to CryptoKit, URLSession, the
// filesystem and Capacitor's logger, and for its entire life it had no automated
// coverage at all — which is how it shipped a channel that could never deliver a
// single update (see the 2026-07-26 slice audit, F-3). Everything reachable without
// a device or a network belongs on this side of the line.
//
// The iOS target compiles this same file directly, so there is one definition, not
// a copy that drifts. Nothing here may import CryptoKit, Capacitor, or UIKit — that
// constraint is what keeps `swift test` cheap and runnable anywhere.

// MARK: - Manifest

/// A signed content manifest. Construct only via `decode`, which enforces the
/// invariants a downstream filesystem write and URL build depend on.
public struct OTAManifest: Equatable {
    public struct Entry: Equatable {
        public let sha256: String
        public let size: Int
        public init(sha256: String, size: Int) {
            self.sha256 = sha256
            self.size = size
        }
    }

    public let gitSha: String?
    public let builtAt: String
    /// Site-absolute prefix of the content-addressed blob store. Absent in schema 1
    /// manifests, which the client refuses to download from — falling back to
    /// per-path fetches is what the edge silently corrupts.
    public let blobPath: String?
    public let files: [String: Entry]

    public var builtAtDate: Date? { OTAManifest.parseISO8601(builtAt) }

    public init(gitSha: String?, builtAt: String, blobPath: String?, files: [String: Entry]) {
        self.gitSha = gitSha
        self.builtAt = builtAt
        self.blobPath = blobPath
        self.files = files
    }

    public static func decode(_ data: Data) throws -> OTAManifest {
        guard let obj = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let schema = obj["schema"] as? Int, schema == 1 || schema == 2,
              let builtAt = obj["builtAt"] as? String,
              let filesRaw = obj["files"] as? [String: [String: Any]] else {
            throw OTAError.badManifest
        }
        var files: [String: Entry] = [:]
        files.reserveCapacity(filesRaw.count)
        for (path, e) in filesRaw {
            guard let sha = e["sha256"] as? String, let size = e["size"] as? Int,
                  isSafeContentPath(path), isSHA256Hex(sha), size >= 0
            else { throw OTAError.badManifest }
            files[path] = Entry(sha256: sha, size: size)
        }
        let blobPath = obj["blobPath"] as? String
        if let blobPath, !blobPath.hasPrefix("/") || blobPath.contains("..") {
            throw OTAError.badManifest
        }
        return OTAManifest(gitSha: obj["gitSha"] as? String, builtAt: builtAt,
                           blobPath: blobPath, files: files)
    }

    /// A manifest path is about to become a filesystem write. These are already
    /// signature-protected; the check is defence in depth, and cheap.
    public static func isSafeContentPath(_ path: String) -> Bool {
        path.hasPrefix("/") && !path.contains("..") && !path.hasSuffix("/")
    }

    /// A hash is about to become a URL. Lowercase hex only — the publish side emits
    /// `digest('hex')`, and accepting anything else widens the surface for nothing.
    public static func isSHA256Hex(_ s: String) -> Bool {
        s.count == 64 && s.allSatisfy { $0.isHexDigit && !$0.isUppercase }
    }

    /// Where a blob lives, relative to the site origin: `ota/blobs/ab/abcdef…`.
    /// Returns nil when the manifest has no blob store or the hash is malformed —
    /// callers must treat that as "refuse", never as "guess a path".
    public func blobRelativePath(forSHA sha: String) -> String? {
        guard let blobPath, OTAManifest.isSHA256Hex(sha) else { return nil }
        let trimmed = blobPath.hasPrefix("/") ? String(blobPath.dropFirst()) : blobPath
        return "\(trimmed)/\(sha.prefix(2))/\(sha)"
    }

    /// The publish side stamps `new Date().toISOString()`, which carries milliseconds;
    /// `app-build.json` uses whole seconds. `ISO8601DateFormatter` parses only one of
    /// those per configuration and silently returns nil for the other — which had
    /// quietly disabled the never-move-backwards guard against a stale edge cache
    /// rolling crisis content back.
    public static func parseISO8601(_ s: String) -> Date? {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let d = f.date(from: s) { return d }
        f.formatOptions = [.withInternetDateTime]
        return f.date(from: s)
    }
}

// MARK: - Errors

public enum OTAError: LocalizedError, Equatable {
    case badSignature, badManifest, noBlobStore, noContent, stagedRootInvalid
    case fileHashMismatch(String), httpFailure(String, Int), deltaTooLarge(Int)

    public var errorDescription: String? {
        switch self {
        case .badSignature: return "manifest signature invalid or missing"
        case .badManifest: return "manifest malformed"
        case .noBlobStore: return "server manifest has no blob store (publish side predates this app)"
        case .noContent: return "no active content root"
        case .stagedRootInvalid: return "staged root failed validation"
        case .fileHashMismatch(let p): return "hash mismatch for \(p)"
        case .httpFailure(let p, let code): return "HTTP \(code) fetching \(p)"
        case .deltaTooLarge(let n): return "delta too large (\(n) bytes)"
        }
    }

    public var outcome: OTAOutcome {
        switch self {
        case .badSignature: return .signatureRejected
        case .badManifest, .noBlobStore: return .manifestInvalid
        case .fileHashMismatch, .deltaTooLarge: return .contentRejected
        case .httpFailure: return .serverUnavailable
        case .noContent, .stagedRootInvalid: return .storageFailed
        }
    }
}

// MARK: - Outcomes

/// What the last update check actually did. The whole point of this type is that
/// "it didn't work" is not an answer: an operator debugging a stale crisis number
/// needs to know whether the phone had no signal, the site was down, the signature
/// was refused, or the disk was full — those have completely different responses,
/// and collapsing them into one string is what hid a dead update channel for days.
public enum OTAOutcome: String, CaseIterable, Equatable {
    case upToDate
    case staged
    case noNetwork
    case serverUnavailable
    case signatureRejected
    case manifestInvalid
    case contentRejected
    case storageFailed

    public var isFailure: Bool { self != .upToDate && self != .staged }

    /// Map a thrown error onto the outcome an operator needs to see. The split that
    /// matters most is noNetwork (nothing is wrong — the phone is offline) versus
    /// everything else (something IS wrong and someone should look).
    public static func classify(_ error: Error) -> (OTAOutcome, String) {
        if let urlError = error as? URLError {
            switch urlError.code {
            case .notConnectedToInternet, .networkConnectionLost, .dataNotAllowed,
                 .internationalRoamingOff, .callIsActive:
                return (.noNetwork, urlError.localizedDescription)
            default:
                return (.serverUnavailable, urlError.localizedDescription)
            }
        }
        if let otaError = error as? OTAError {
            return (otaError.outcome, otaError.errorDescription ?? "\(otaError)")
        }
        // Foundation file errors (no space, permissions, unlink races) land here.
        return (.storageFailed, (error as NSError).localizedDescription)
    }

    /// Reader-facing phrase for the content-status sheet.
    public func phrase(spanish es: Bool) -> String {
        switch self {
        case .upToDate:
            return es ? "el contenido está actualizado" : "content is up to date"
        case .staged:
            return es ? "actualización descargada y verificada" : "update downloaded and verified"
        case .noNetwork:
            return es ? "sin conexión a internet" : "no internet connection"
        case .serverUnavailable:
            return es ? "no se pudo conectar con disabilitywiki.org" : "could not reach disabilitywiki.org"
        case .signatureRejected:
            return es ? "actualización rechazada: la firma no es válida" : "update refused — signature did not verify"
        case .manifestInvalid:
            return es ? "actualización rechazada: lista de archivos ilegible" : "update refused — update list unreadable"
        case .contentRejected:
            return es
                ? "actualización rechazada: un archivo no coincide con su firma"
                : "update refused — a file did not match its signature"
        case .storageFailed:
            return es ? "no se pudo guardar en este dispositivo" : "update could not be saved to this device"
        }
    }
}
