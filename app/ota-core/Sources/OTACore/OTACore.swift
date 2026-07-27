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

// MARK: - Single-flight

/// Collapses concurrent requests for the same work into one run.
///
/// The OTA check has two entry points — app launch and the status sheet's "Check
/// for updates now" — and they shared one staging directory with nothing
/// serialising them. A reader who taps "check now" during a launch-time download
/// (an invitation the sheet makes explicitly, and the natural move for someone who
/// just reconnected) could have a second run wipe the first's partial work
/// mid-stage. Because launch-time validation is a four-file spot check, an
/// incomplete root could then pass and activate, and keep passing.
///
/// The waiting caller must still get an answer — firing a check that silently does
/// nothing is how a broken update channel stays invisible — so completions attach
/// to the running flight rather than being dropped.
///
/// Lives here rather than in OTAUpdater because this is the part that can be
/// tested without a device or a network.
public final class OTASingleFlight {
    private let lock = NSLock()
    private var running = false
    private var waiters: [() -> Void] = []

    public init() {}

    /// Register interest in the work.
    /// - Returns: `true` if the caller should perform it, `false` if a run was
    ///   already in flight and this completion was attached to it instead.
    @discardableResult
    public func begin(completion: (() -> Void)? = nil) -> Bool {
        lock.lock()
        defer { lock.unlock() }
        if let completion { waiters.append(completion) }
        if running { return false }
        running = true
        return true
    }

    /// Mark the run finished and hand back everyone waiting on it. The caller is
    /// responsible for invoking them (on whichever queue is appropriate).
    public func finish() -> [() -> Void] {
        lock.lock()
        defer { lock.unlock() }
        let done = waiters
        waiters = []
        running = false
        return done
    }

    public var isRunning: Bool {
        lock.lock()
        defer { lock.unlock() }
        return running
    }
}

// MARK: - Content store

/// The content-root state machine: which root the webview serves, how a staged
/// root becomes current, and how a broken one is rolled back.
///
/// Everything here is filesystem and logic — no CryptoKit, no Capacitor, no
/// Bundle. The two things it genuinely cannot do without are injected: hashing
/// (CryptoKit on device, anything in a test) and the app-bundle location. That is
/// what lets rollback finally be covered.
///
/// Rollback was the one link the 2026-07-26 slice audit could not verify: it was
/// last proven on 2026-07-23, *before* the refactor that rewrote it, and there was
/// no way to exercise it short of corrupting a real device's container.
public final class OTAContentStore {
    private let fm = FileManager.default
    private let contentDir: URL
    private let bundleRoot: URL?
    private let sha256Hex: (Data) -> String
    private let log: (String) -> Void

    public init(
        contentDir: URL,
        bundleRoot: URL?,
        sha256Hex: @escaping (Data) -> String,
        log: @escaping (String) -> Void = { _ in }
    ) {
        self.contentDir = contentDir
        self.bundleRoot = bundleRoot
        self.sha256Hex = sha256Hex
        self.log = log
    }

    public var versionsDir: URL { contentDir.appendingPathComponent("versions", isDirectory: true) }
    public var currentPointer: URL { contentDir.appendingPathComponent("current") }
    public var previousPointer: URL { contentDir.appendingPathComponent("previous") }

    /// What the resolution actually did — so a caller can log it, and a test can
    /// assert on the decision rather than only on its side effects.
    public enum Resolution: Equatable {
        case servingCurrent(String)
        case rolledBackToPrevious(String)
        case revertedToBundle
        case newBinaryWins
        case noOTAState
    }

    /// Resolve the root the webview should serve. May MUTATE state: it promotes a
    /// good previous root over a bad current one, and discards OTA state entirely
    /// when the bundle is newer or nothing is salvageable. The bundle is never
    /// touched — there is always a last-known-good.
    public func resolveActiveRoot() -> (root: URL?, resolution: Resolution) {
        // A new binary always wins: an App Store update shipped, so an older OTA
        // root must not shadow it.
        if let bundleBuilt = builtAt(inRoot: bundleRoot),
           let otaRoot = pointedRoot(currentPointer),
           let otaBuilt = builtAt(inRoot: otaRoot),
           bundleBuilt > otaBuilt {
            try? fm.removeItem(at: contentDir)
            log("OTA: bundle is newer than the OTA content — discarded OTA state")
            return (nil, .newBinaryWins)
        }
        if let root = pointedRoot(currentPointer), validate(root: root) {
            return (root, .servingCurrent(root.lastPathComponent))
        }
        // Current is broken: promote previous so the bad root is never retried.
        if let prev = pointedRoot(previousPointer), validate(root: prev) {
            let name = prev.lastPathComponent
            try? fm.removeItem(at: currentPointer)
            try? fm.moveItem(at: previousPointer, to: currentPointer)
            log("OTA: current content failed validation — rolled back to previous")
            return (prev, .rolledBackToPrevious(name))
        }
        if fm.fileExists(atPath: contentDir.path) {
            try? fm.removeItem(at: contentDir)
            log("OTA: content state invalid — reverted to app bundle")
            return (nil, .revertedToBundle)
        }
        return (nil, .noOTAState)
    }

    /// Point `current` at `version`, keeping the outgoing root as `previous`, then
    /// prune everything that is neither. Returns the version it displaced, if any.
    @discardableResult
    public func activate(version: String) throws -> String? {
        let outgoing = (try? String(contentsOf: currentPointer, encoding: .utf8))?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        try? fm.removeItem(at: previousPointer)
        if let outgoing, !outgoing.isEmpty {
            try outgoing.write(to: previousPointer, atomically: true, encoding: .utf8)
        }
        try version.write(to: currentPointer, atomically: true, encoding: .utf8)

        let keep: Set<String> = [version, outgoing ?? ""]
        for item in (try? fm.contentsOfDirectory(atPath: versionsDir.path)) ?? [] where !keep.contains(item) {
            try? fm.removeItem(at: versionsDir.appendingPathComponent(item))
        }
        return outgoing?.isEmpty == false ? outgoing : nil
    }

    public func pointedRoot(_ pointer: URL) -> URL? {
        guard let name = try? String(contentsOf: pointer, encoding: .utf8) else { return nil }
        let root = versionsDir.appendingPathComponent(
            name.trimmingCharacters(in: .whitespacesAndNewlines), isDirectory: true)
        var isDir: ObjCBool = false
        guard fm.fileExists(atPath: root.path, isDirectory: &isDir), isDir.boolValue else { return nil }
        return root
    }

    /// Structural + spot-hash validation. Full verification happens at staging;
    /// this is the launch-time check, deliberately cheap — it catches truncation
    /// and corruption of the pages this app exists to serve, not every file.
    public func validate(root: URL) -> Bool {
        guard let data = try? Data(contentsOf: root.appendingPathComponent("ota/manifest.json")),
              let manifest = try? OTAManifest.decode(data) else { return false }
        guard let probes = Self.validationProbes(for: manifest) else { return false }
        for path in probes {
            let f = root.appendingPathComponent(String(path.dropFirst()))
            guard let bytes = try? Data(contentsOf: f),
                  sha256Hex(bytes) == manifest.files[path]?.sha256 else { return false }
        }
        return fm.fileExists(atPath: root.appendingPathComponent("index.html").path)
    }

    /// Which paths the launch-time check hashes.
    ///
    /// This used to be "whichever three crisis pages sort first", which is a
    /// sample of the alphabet rather than a sample of what matters — and it
    /// meant the crisis HUB (`/crisis/index.html`) was never checked, because it
    /// sorts after every `/crisis/<topic>/` page. Verified on device 2026-07-26:
    /// corrupting the hub left the app happily serving the corrupted root.
    ///
    /// The hubs are now always probed, plus a couple of deep pages to keep some
    /// spread. Still a spot check by design — full verification happens at staging,
    /// and a reader waits on this one.
    static func validationProbes(for manifest: OTAManifest) -> [String]? {
        let crisisPages = manifest.files.keys
            .filter { $0.hasPrefix("/crisis/") || $0.hasPrefix("/es/crisis/") }
            .filter { $0.hasSuffix("/index.html") }
        guard !crisisPages.isEmpty else { return nil }

        let hubs = ["/crisis/index.html", "/es/crisis/index.html"].filter { manifest.files[$0] != nil }
        let rest = crisisPages.filter { !hubs.contains($0) }.sorted().prefix(3)
        let probes = hubs + rest
        return probes.isEmpty ? nil : probes
    }

    public func builtAt(inRoot root: URL?) -> Date? {
        guard let root,
              let data = try? Data(contentsOf: root.appendingPathComponent("app-build.json")),
              let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let s = obj["builtAt"] as? String else { return nil }
        return OTAManifest.parseISO8601(s)
    }
}
