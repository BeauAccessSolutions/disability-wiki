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
