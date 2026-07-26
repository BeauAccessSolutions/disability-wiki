// swift-tools-version:5.9
import PackageDescription

// Foundation-only on purpose: no CryptoKit, no Capacitor, no UIKit. That is what
// lets `swift test` run without Xcode, a simulator, or a device — and therefore
// what lets this run in CI at all. The iOS target compiles Sources/OTACore/
// directly (see App.xcodeproj), so there is one definition rather than a copy that
// drifts from the shipped one.
let package = Package(
    name: "OTACore",
    products: [.library(name: "OTACore", targets: ["OTACore"])],
    targets: [
        .target(name: "OTACore"),
        .testTarget(name: "OTACoreTests", dependencies: ["OTACore"]),
    ]
)
