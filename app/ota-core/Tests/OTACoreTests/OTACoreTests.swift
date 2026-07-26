import XCTest
@testable import OTACore

// Coverage for the OTA logic that can be exercised without a device, a network, or
// a filesystem. Written after the 2026-07-26 slice audit found this code had none
// (F-3) — which is how the channel shipped in a state where it could never deliver
// a single update, and how a timestamp-parsing bug silently disabled a guard.
//
// Where a test corresponds to a real defect, it says so. Those are the ones that
// matter: each fails against the code as it was.

final class ManifestDecodingTests: XCTestCase {
    /// Builds manifest JSON with one file entry, overridable per test.
    private func json(
        schema: Int = 2,
        builtAt: String = "2026-07-26T12:00:00.000Z",
        blobPath: String? = "/ota/blobs",
        path: String = "/crisis/index.html",
        sha: String = String(repeating: "a", count: 64),
        size: Int = 10
    ) -> Data {
        var obj: [String: Any] = [
            "schema": schema,
            "builtAt": builtAt,
            "files": [path: ["sha256": sha, "size": size]],
        ]
        if let blobPath { obj["blobPath"] = blobPath }
        return try! JSONSerialization.data(withJSONObject: obj)
    }

    func testDecodesASchema2Manifest() throws {
        let m = try OTAManifest.decode(json())
        XCTAssertEqual(m.blobPath, "/ota/blobs")
        XCTAssertEqual(m.files["/crisis/index.html"]?.size, 10)
    }

    func testAcceptsSchema1ForReadingLocalBundledManifests() throws {
        // The bundle may predate the blob store; the client still needs to diff
        // against it. What it must NOT do is download from it — that is enforced by
        // blobPath being nil, not by refusing to parse.
        let m = try OTAManifest.decode(json(schema: 1, blobPath: nil))
        XCTAssertNil(m.blobPath)
    }

    func testRejectsUnknownSchema() {
        XCTAssertThrowsError(try OTAManifest.decode(json(schema: 3)))
    }

    // Path validation: each of these is about to become a filesystem write.
    func testRejectsPathEscapingTheContentRoot() {
        XCTAssertThrowsError(try OTAManifest.decode(json(path: "/../../etc/passwd")))
    }

    func testRejectsRelativePath() {
        XCTAssertThrowsError(try OTAManifest.decode(json(path: "crisis/index.html")))
    }

    func testRejectsDirectoryPath() {
        XCTAssertThrowsError(try OTAManifest.decode(json(path: "/crisis/")))
    }

    // Hash validation: each of these is about to become a URL.
    func testRejectsShortHash() {
        XCTAssertThrowsError(try OTAManifest.decode(json(sha: "abc123")))
    }

    func testRejectsNonHexHash() {
        XCTAssertThrowsError(try OTAManifest.decode(json(sha: String(repeating: "z", count: 64))))
    }

    func testRejectsUppercaseHashSoThereIsExactlyOneBlobURLPerFile() {
        XCTAssertThrowsError(try OTAManifest.decode(json(sha: String(repeating: "A", count: 64))))
    }

    func testRejectsNegativeSize() {
        XCTAssertThrowsError(try OTAManifest.decode(json(size: -1)))
    }

    func testRejectsBlobPathEscape() {
        XCTAssertThrowsError(try OTAManifest.decode(json(blobPath: "/ota/../..")))
    }

    func testRejectsRelativeBlobPath() {
        XCTAssertThrowsError(try OTAManifest.decode(json(blobPath: "ota/blobs")))
    }

    func testRejectsGarbage() {
        XCTAssertThrowsError(try OTAManifest.decode(Data("not json".utf8)))
    }
}

final class TimestampParsingTests: XCTestCase {
    /// REGRESSION — the live manifest stamps `new Date().toISOString()`, which carries
    /// milliseconds. A default `ISO8601DateFormatter` returns nil for those, so the
    /// "never move backwards" guard against a stale edge cache silently never ran.
    func testParsesFractionalSecondsAsThePublishSideEmits() {
        XCTAssertNotNil(OTAManifest.parseISO8601("2026-07-24T16:44:49.483Z"),
                        "fractional seconds are what the site actually emits")
    }

    /// The bundle stamp uses whole seconds, so both must work through one path.
    func testParsesWholeSecondsAsTheBundleStampEmits() {
        XCTAssertNotNil(OTAManifest.parseISO8601("2026-07-25T14:53:24Z"))
    }

    func testBothFormsCompareCorrectlyAgainstEachOther() throws {
        let older = try XCTUnwrap(OTAManifest.parseISO8601("2026-07-24T16:30:00Z"))
        let newer = try XCTUnwrap(OTAManifest.parseISO8601("2026-07-24T16:44:49.483Z"))
        XCTAssertTrue(newer > older, "the guard compares a whole-second stamp to a fractional one")
    }

    func testRejectsGarbageRatherThanGuessing() {
        XCTAssertNil(OTAManifest.parseISO8601("last Tuesday"))
        XCTAssertNil(OTAManifest.parseISO8601(""))
    }
}

final class BlobAddressingTests: XCTestCase {
    private func manifest(blobPath: String?) -> OTAManifest {
        OTAManifest(gitSha: nil, builtAt: "2026-07-26T12:00:00Z", blobPath: blobPath, files: [:])
    }

    func testBuildsTheTwoLevelFanoutPath() {
        let sha = "8b10912b8875647e" + String(repeating: "0", count: 48)
        XCTAssertEqual(manifest(blobPath: "/ota/blobs").blobRelativePath(forSHA: sha),
                       "ota/blobs/8b/\(sha)")
    }

    /// A manifest with no blob store must yield no path at all. Guessing one is how
    /// the client would fall back to per-path fetches, which the CDN edge rewrites —
    /// the original defect that made the channel undeliverable.
    func testNoBlobStoreYieldsNoPath() {
        let sha = String(repeating: "a", count: 64)
        XCTAssertNil(manifest(blobPath: nil).blobRelativePath(forSHA: sha))
    }

    func testMalformedHashYieldsNoPath() {
        XCTAssertNil(manifest(blobPath: "/ota/blobs").blobRelativePath(forSHA: "../../etc/passwd"))
    }
}

final class OutcomeClassificationTests: XCTestCase {
    /// The distinction that matters most: an offline phone is not a broken site.
    func testOfflineConditionsClassifyAsNoNetwork() {
        for code: URLError.Code in [.notConnectedToInternet, .networkConnectionLost,
                                    .dataNotAllowed, .internationalRoamingOff] {
            let (outcome, _) = OTAOutcome.classify(URLError(code))
            XCTAssertEqual(outcome, .noNetwork, "\(code) should read as no network")
        }
    }

    func testOtherURLErrorsClassifyAsServerUnavailable() {
        for code: URLError.Code in [.cannotConnectToHost, .cannotFindHost, .timedOut,
                                    .secureConnectionFailed] {
            let (outcome, _) = OTAOutcome.classify(URLError(code))
            XCTAssertEqual(outcome, .serverUnavailable, "\(code) should read as server unavailable")
        }
    }

    /// REGRESSION — every one of these used to render as "offline or unavailable",
    /// which is why a permanently broken channel looked like bad signal for two days.
    func testDistinctFailuresDoNotCollapseIntoOneOutcome() {
        let cases: [(Error, OTAOutcome)] = [
            (OTAError.badSignature, .signatureRejected),
            (OTAError.badManifest, .manifestInvalid),
            (OTAError.noBlobStore, .manifestInvalid),
            (OTAError.fileHashMismatch("/crisis/index.html"), .contentRejected),
            (OTAError.deltaTooLarge(999), .contentRejected),
            (OTAError.httpFailure("/ota/manifest.json", 500), .serverUnavailable),
            (OTAError.stagedRootInvalid, .storageFailed),
            (OTAError.noContent, .storageFailed),
            (URLError(.notConnectedToInternet), .noNetwork),
        ]
        for (error, expected) in cases {
            XCTAssertEqual(OTAOutcome.classify(error).0, expected, "\(error)")
        }
        XCTAssertGreaterThanOrEqual(Set(cases.map(\.1)).count, 5,
                                    "the taxonomy must stay genuinely distinct")
    }

    func testUnknownErrorsAreStorageFailedRatherThanSilent() {
        let (outcome, detail) = OTAOutcome.classify(
            NSError(domain: NSCocoaErrorDomain, code: NSFileWriteOutOfSpaceError))
        XCTAssertEqual(outcome, .storageFailed)
        XCTAssertFalse(detail.isEmpty, "an operator needs something to read")
    }

    func testEveryFailureCarriesADetailString() {
        for error: OTAError in [.badSignature, .badManifest, .noBlobStore, .noContent,
                                .stagedRootInvalid, .fileHashMismatch("/x"),
                                .httpFailure("/y", 404), .deltaTooLarge(1)] {
            XCTAssertFalse(OTAOutcome.classify(error).1.isEmpty, "\(error) has no detail")
        }
    }

    func testOnlyUpToDateAndStagedAreSuccesses() {
        for outcome in OTAOutcome.allCases {
            let expected = (outcome == .upToDate || outcome == .staged)
            XCTAssertEqual(!outcome.isFailure, expected, "\(outcome)")
        }
    }

    /// The status sheet is the only surface that explains a failure, in both
    /// languages, so an unphrased outcome is an outcome the reader cannot act on.
    func testEveryOutcomeIsPhrasedInBothLanguages() {
        for outcome in OTAOutcome.allCases {
            XCTAssertFalse(outcome.phrase(spanish: false).isEmpty, "\(outcome) EN")
            XCTAssertFalse(outcome.phrase(spanish: true).isEmpty, "\(outcome) ES")
            XCTAssertNotEqual(outcome.phrase(spanish: false), outcome.phrase(spanish: true),
                              "\(outcome) is not actually translated")
        }
    }
}

final class SingleFlightTests: XCTestCase {
    /// The core guarantee: a second caller does not start a rival run.
    func testSecondCallerDoesNotGetToRun() {
        let flight = OTASingleFlight()
        XCTAssertTrue(flight.begin(), "first caller runs")
        XCTAssertFalse(flight.begin(), "second caller must attach, not run")
        XCTAssertFalse(flight.begin(), "and so must a third")
    }

    /// A "Check now" that silently does nothing is how a broken update channel
    /// stays invisible — every attached caller must still be answered.
    func testEveryAttachedCallerIsAnsweredByTheRunInFlight() {
        let flight = OTASingleFlight()
        var answered: [String] = []
        XCTAssertTrue(flight.begin { answered.append("launch") })
        XCTAssertFalse(flight.begin { answered.append("checkNow") })
        XCTAssertFalse(flight.begin { answered.append("thirdTap") })

        XCTAssertTrue(answered.isEmpty, "nobody is answered before the run finishes")
        for done in flight.finish() { done() }
        XCTAssertEqual(answered.sorted(), ["checkNow", "launch", "thirdTap"])
    }

    func testANewRunMayStartOnceThePreviousFinished() {
        let flight = OTASingleFlight()
        XCTAssertTrue(flight.begin())
        _ = flight.finish()
        XCTAssertFalse(flight.isRunning)
        XCTAssertTrue(flight.begin(), "the gate reopens — it must not latch shut")
    }

    func testFinishDoesNotReplayCompletionsToTheNextRun() {
        let flight = OTASingleFlight()
        var count = 0
        XCTAssertTrue(flight.begin { count += 1 })
        for done in flight.finish() { done() }
        XCTAssertTrue(flight.begin())
        XCTAssertTrue(flight.finish().isEmpty, "stale waiters must not leak into the next run")
        XCTAssertEqual(count, 1)
    }

    /// The real shape of the bug: launch and "check now" arrive on different
    /// threads. Exactly one caller may win, whatever the interleaving.
    func testExactlyOneWinnerUnderConcurrentCallers() {
        for _ in 0..<200 {
            let flight = OTASingleFlight()
            let winners = NSMutableArray()
            let lock = NSLock()
            DispatchQueue.concurrentPerform(iterations: 8) { i in
                if flight.begin(completion: {}) {
                    lock.lock(); winners.add(i); lock.unlock()
                }
            }
            XCTAssertEqual(winners.count, 1, "exactly one run may start")
            XCTAssertEqual(flight.finish().count, 8, "all 8 completions attached")
        }
    }

    func testConcurrentBeginAndFinishDoNotLoseCompletions() {
        let flight = OTASingleFlight()
        XCTAssertTrue(flight.begin())
        let attached = 64
        DispatchQueue.concurrentPerform(iterations: attached) { _ in
            _ = flight.begin(completion: {})
        }
        XCTAssertEqual(flight.finish().count, attached, "no completion may be dropped")
    }
}

/// Rollback and activation against a real filesystem in a temp directory.
///
/// This is the link the 2026-07-26 slice audit had to mark UNVERIFIED: rollback was
/// last proven 2026-07-23, before the refactor that rewrote it, and there was no way
/// to exercise it short of corrupting a real device's container.
final class ContentStoreTests: XCTestCase {
    private var tmp: URL!
    private var contentDir: URL!
    private var bundle: URL!

    /// Test hasher — the real one is CryptoKit, which this module deliberately
    /// cannot import. Identity-ish is fine: what is under test is the state
    /// machine, not SHA-256.
    /// Named to avoid colliding with NSObject.hash, which XCTestCase inherits.
    private let sha: (Data) -> String = { data in
        String(repeating: "0", count: 64 - String(data.count).count) + String(data.count)
    }

    override func setUpWithError() throws {
        tmp = URL(fileURLWithPath: NSTemporaryDirectory())
            .appendingPathComponent("otastore-\(UUID().uuidString)")
        contentDir = tmp.appendingPathComponent("dw-content")
        bundle = tmp.appendingPathComponent("bundle")
        // Deliberately NOT creating contentDir: on a fresh install it does not
        // exist, and "present but unusable" is a different state with a different
        // correct outcome (it gets cleared). Helpers create it when they need it.
        try FileManager.default.createDirectory(at: tmp, withIntermediateDirectories: true)
    }

    override func tearDownWithError() throws {
        try? FileManager.default.removeItem(at: tmp)
    }

    private func store(bundleRoot: URL? = nil) -> OTAContentStore {
        OTAContentStore(contentDir: contentDir, bundleRoot: bundleRoot, sha256Hex: sha)
    }

    /// Write a content root that passes validation: a crisis page whose hash matches
    /// its manifest entry, plus the index.html the check requires.
    @discardableResult
    private func makeRoot(_ name: String, builtAt: String = "2026-07-26T12:00:00Z",
                          valid: Bool = true, in dir: URL? = nil) throws -> URL {
        let fm = FileManager.default
        let root = (dir ?? contentDir.appendingPathComponent("versions")).appendingPathComponent(name)
        let crisis = root.appendingPathComponent("crisis")
        try fm.createDirectory(at: crisis, withIntermediateDirectories: true)
        try fm.createDirectory(at: root.appendingPathComponent("ota"), withIntermediateDirectories: true)

        let body = Data("crisis page for \(name)".utf8)
        try body.write(to: crisis.appendingPathComponent("index.html"))
        try Data("home".utf8).write(to: root.appendingPathComponent("index.html"))
        // A wrong hash is how a truncated or corrupted root presents.
        let digest = valid ? sha(body) : String(repeating: "f", count: 64)
        let manifest: [String: Any] = [
            "schema": 2, "builtAt": builtAt, "blobPath": "/ota/blobs",
            "files": ["/crisis/index.html": ["sha256": digest, "size": body.count]],
        ]
        try JSONSerialization.data(withJSONObject: manifest)
            .write(to: root.appendingPathComponent("ota/manifest.json"))
        try JSONSerialization.data(withJSONObject: ["builtAt": builtAt, "gitSha": "deadbeef"])
            .write(to: root.appendingPathComponent("app-build.json"))
        return root
    }

    private func point(_ pointer: String, to version: String) throws {
        try FileManager.default.createDirectory(at: contentDir, withIntermediateDirectories: true)
        try version.write(to: contentDir.appendingPathComponent(pointer),
                          atomically: true, encoding: .utf8)
    }

    // MARK: resolve

    func testNoStateFallsBackToTheBundle() {
        let (root, res) = store().resolveActiveRoot()
        XCTAssertNil(root)
        XCTAssertEqual(res, .noOTAState)
    }

    func testAnEmptyButPresentContentDirIsClearedRatherThanTrusted() throws {
        try FileManager.default.createDirectory(at: contentDir, withIntermediateDirectories: true)
        let (root, res) = store().resolveActiveRoot()
        XCTAssertNil(root)
        XCTAssertEqual(res, .revertedToBundle)
        XCTAssertFalse(FileManager.default.fileExists(atPath: contentDir.path))
    }

    func testAValidCurrentRootIsServed() throws {
        try makeRoot("v-1")
        try point("current", to: "v-1")
        let (root, res) = store().resolveActiveRoot()
        XCTAssertEqual(root?.lastPathComponent, "v-1")
        XCTAssertEqual(res, .servingCurrent("v-1"))
    }

    /// THE ROLLBACK PATH. A corrupted current root must not be served, and must not
    /// be retried on the next launch either — previous is promoted over it.
    func testACorruptCurrentRootRollsBackToPrevious() throws {
        try makeRoot("v-bad", valid: false)
        try makeRoot("v-good")
        try point("current", to: "v-bad")
        try point("previous", to: "v-good")

        let s = store()
        let (root, res) = s.resolveActiveRoot()
        XCTAssertEqual(root?.lastPathComponent, "v-good")
        XCTAssertEqual(res, .rolledBackToPrevious("v-good"))

        // Promoted, so the bad root is never reached again.
        let current = try String(contentsOf: contentDir.appendingPathComponent("current"), encoding: .utf8)
        XCTAssertEqual(current.trimmingCharacters(in: .whitespacesAndNewlines), "v-good")
        XCTAssertFalse(FileManager.default.fileExists(
            atPath: contentDir.appendingPathComponent("previous").path),
            "previous was consumed by the promotion")

        // And a second launch is stable rather than rolling back again.
        XCTAssertEqual(s.resolveActiveRoot().resolution, .servingCurrent("v-good"))
    }

    func testBothRootsCorruptRevertsToTheBundleAndClearsState() throws {
        try makeRoot("v-bad", valid: false)
        try makeRoot("v-worse", valid: false)
        try point("current", to: "v-bad")
        try point("previous", to: "v-worse")

        let (root, res) = store().resolveActiveRoot()
        XCTAssertNil(root, "the bundle is the last-known-good")
        XCTAssertEqual(res, .revertedToBundle)
        XCTAssertFalse(FileManager.default.fileExists(atPath: contentDir.path),
                       "unusable OTA state is cleared, not left to be retried forever")
    }

    func testAPointerToAMissingRootIsNotFatal() throws {
        try point("current", to: "v-vanished")
        XCTAssertEqual(store().resolveActiveRoot().resolution, .revertedToBundle)
    }

    /// An App Store update must not be shadowed by older OTA content.
    func testANewerBundleDiscardsOTAState() throws {
        try makeRoot("v-old", builtAt: "2026-07-01T00:00:00Z")
        try point("current", to: "v-old")
        try makeRoot("bundle", builtAt: "2026-07-20T00:00:00Z", in: tmp)

        let (root, res) = store(bundleRoot: bundle).resolveActiveRoot()
        XCTAssertNil(root)
        XCTAssertEqual(res, .newBinaryWins)
        XCTAssertFalse(FileManager.default.fileExists(atPath: contentDir.path))
    }

    func testAnOlderBundleDoesNotDiscardNewerOTAContent() throws {
        try makeRoot("v-new", builtAt: "2026-07-26T00:00:00Z")
        try point("current", to: "v-new")
        try makeRoot("bundle", builtAt: "2026-07-01T00:00:00Z", in: tmp)

        XCTAssertEqual(store(bundleRoot: bundle).resolveActiveRoot().resolution,
                       .servingCurrent("v-new"))
    }

    /// REGRESSION — the bundle stamp uses whole seconds and the OTA stamp carries
    /// milliseconds. When the parser silently returned nil for one of them, this
    /// comparison never ran.
    func testNewBinaryComparisonWorksAcrossTimestampFormats() throws {
        try makeRoot("v-old", builtAt: "2026-07-01T00:00:00.123Z")
        try point("current", to: "v-old")
        try makeRoot("bundle", builtAt: "2026-07-20T00:00:00Z", in: tmp)
        XCTAssertEqual(store(bundleRoot: bundle).resolveActiveRoot().resolution, .newBinaryWins)
    }

    // MARK: activate

    func testActivationKeepsTheOutgoingRootAsPrevious() throws {
        try makeRoot("v-1"); try makeRoot("v-2")
        try point("current", to: "v-1")

        let displaced = try store().activate(version: "v-2")
        XCTAssertEqual(displaced, "v-1")
        let fm = FileManager.default
        XCTAssertEqual(try String(contentsOf: contentDir.appendingPathComponent("current"), encoding: .utf8), "v-2")
        XCTAssertEqual(try String(contentsOf: contentDir.appendingPathComponent("previous"), encoding: .utf8), "v-1")
        XCTAssertTrue(fm.fileExists(atPath: contentDir.appendingPathComponent("versions/v-1").path),
                      "the rollback target must survive activation")
    }

    func testTheFirstActivationHasNoPreviousToKeep() throws {
        try makeRoot("v-1")
        XCTAssertNil(try store().activate(version: "v-1"))
        XCTAssertFalse(FileManager.default.fileExists(
            atPath: contentDir.appendingPathComponent("previous").path))
    }

    func testActivationPrunesEverythingButCurrentAndPrevious() throws {
        for v in ["v-1", "v-2", "v-3", "v-4"] { try makeRoot(v) }
        try point("current", to: "v-3")
        try store().activate(version: "v-4")

        let left = Set(try FileManager.default.contentsOfDirectory(
            atPath: contentDir.appendingPathComponent("versions").path))
        XCTAssertEqual(left, ["v-3", "v-4"], "stale roots must not accumulate on a phone")
    }

    /// Activate → corrupt it → relaunch must land on the root it displaced.
    func testActivateThenCorruptRollsBackToTheDisplacedRoot() throws {
        try makeRoot("v-1"); try point("current", to: "v-1")
        try makeRoot("v-2")
        let s = store()
        try s.activate(version: "v-2")
        XCTAssertEqual(s.resolveActiveRoot().resolution, .servingCurrent("v-2"))

        // Corrupt the now-current root the way a truncated write would.
        try Data("tampered".utf8).write(
            to: contentDir.appendingPathComponent("versions/v-2/crisis/index.html"))
        XCTAssertEqual(s.resolveActiveRoot().resolution, .rolledBackToPrevious("v-1"))
    }
}

final class ValidationProbeTests: XCTestCase {
    private func manifest(paths: [String]) -> OTAManifest {
        var files: [String: OTAManifest.Entry] = [:]
        for p in paths { files[p] = .init(sha256: String(repeating: "a", count: 64), size: 1) }
        return OTAManifest(gitSha: nil, builtAt: "2026-07-26T12:00:00Z", blobPath: "/ota/blobs", files: files)
    }

    /// REGRESSION — verified on a simulator 2026-07-26: corrupting the crisis hub
    /// left the app serving the corrupted root, because the old selection took
    /// whichever three paths sorted first and `/crisis/index.html` sorts after
    /// every `/crisis/<topic>/` page.
    func testTheCrisisHubIsAlwaysProbed() throws {
        let m = manifest(paths: [
            "/crisis/abuse-neglect-exploitation/index.html",
            "/crisis/abuse/recognizing-violence/index.html",
            "/crisis/crisis-planning/index.html",
            "/crisis/index.html",
        ])
        let probes = try XCTUnwrap(OTAContentStore.validationProbes(for: m))
        XCTAssertTrue(probes.contains("/crisis/index.html"),
                      "the hub sorts last but matters most")
    }

    func testTheSpanishHubIsAlsoProbedWhenPresent() throws {
        let m = manifest(paths: ["/crisis/index.html", "/es/crisis/index.html",
                                 "/crisis/a/index.html"])
        let probes = try XCTUnwrap(OTAContentStore.validationProbes(for: m))
        XCTAssertTrue(probes.contains("/es/crisis/index.html"))
    }

    func testKeepsSomeSpreadBeyondTheHubs() throws {
        let m = manifest(paths: ["/crisis/index.html"] + (1...9).map { "/crisis/p\($0)/index.html" })
        let probes = try XCTUnwrap(OTAContentStore.validationProbes(for: m))
        XCTAssertGreaterThanOrEqual(probes.count, 4, "hub plus deep pages")
        XCTAssertLessThanOrEqual(probes.count, 5, "still a spot check — a reader waits on this")
    }

    func testNoCrisisPagesMeansNoValidRoot() {
        XCTAssertNil(OTAContentStore.validationProbes(for: manifest(paths: ["/index.html"])),
                     "a content root with no crisis pages is not one this app may serve")
    }

    func testWorksWhenOnlyTopicPagesExist() throws {
        let m = manifest(paths: ["/crisis/a/index.html", "/crisis/b/index.html"])
        let probes = try XCTUnwrap(OTAContentStore.validationProbes(for: m))
        XCTAssertEqual(Set(probes), ["/crisis/a/index.html", "/crisis/b/index.html"])
    }
}
