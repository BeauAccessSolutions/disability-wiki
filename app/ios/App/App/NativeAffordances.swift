import UIKit
import Capacitor

// Phase 2 native affordances (docs/app-remediation-plan.md): the native
// capabilities that make this an app rather than a wrapped website — and that
// carry the App Review §4.2 "minimum functionality" case. Everything here is
// crisis-first: two taps or fewer from the home screen to hotline numbers, with
// zero network.
//
// Accessibility bar (this is an accessibility organization's app):
// - every control ≥44pt, labeled for VoiceOver, Dynamic Type via preferredFont
// - no animation anywhere (nothing for prefers-reduced-motion to disable)
// - colors from system semantic palette so both themes keep contrast

// MARK: - Home-screen quick actions

enum CrisisShortcuts {
    private static let navigatePrefix = "org.disabilitywiki.app.navigate:"
    private static let statusType = "org.disabilitywiki.app.status"

    /// Path a shortcut asked for before the webview was ready (cold launch).
    private(set) static var pendingPath: String?
    static var pendingStatusSheet = false

    private static var spanish: Bool {
        Locale.preferredLanguages.first?.hasPrefix("es") == true
    }

    /// Dynamic (not Info.plist) shortcuts: localizable at runtime, and they can
    /// follow the device language without pbxproj variant-group surgery.
    static func register() {
        let es = spanish
        func item(_ path: String, _ en: String, _ esTitle: String, _ icon: String) -> UIApplicationShortcutItem {
            UIApplicationShortcutItem(
                type: navigatePrefix + (es ? "/es" + path : path),
                localizedTitle: es ? esTitle : en,
                localizedSubtitle: nil,
                icon: UIApplicationShortcutIcon(systemImageName: icon)
            )
        }
        UIApplication.shared.shortcutItems = [
            item("/crisis/", "Crisis help now", "Ayuda en crisis ahora", "cross.case"),
            item("/crisis/global-crisis-hotlines/", "Crisis hotlines", "Líneas de crisis", "phone"),
            item("/crisis/abuse-neglect-exploitation/", "Abuse support", "Apoyo ante el abuso", "heart"),
            UIApplicationShortcutItem(
                type: statusType,
                localizedTitle: es ? "Estado del contenido" : "Content status",
                localizedSubtitle: nil,
                icon: UIApplicationShortcutIcon(systemImageName: "checkmark.shield")
            ),
        ]
    }

    /// Returns true if the item was recognized. Navigation is deferred to the
    /// bridge controller when the webview isn't up yet (cold launch).
    @discardableResult
    static func handle(_ item: UIApplicationShortcutItem) -> Bool {
        if item.type == statusType {
            if let vc = topBridgeController() { StatusSheet.present(from: vc) } else { pendingStatusSheet = true }
            return true
        }
        guard item.type.hasPrefix(navigatePrefix) else { return false }
        let path = String(item.type.dropFirst(navigatePrefix.count))
        if let vc = topBridgeController() { vc.navigate(to: path) } else { pendingPath = path }
        return true
    }

    /// Called by the bridge controller once the webview is ready.
    static func deliverPending(to vc: WikiBridgeViewController) {
        if let path = pendingPath { vc.navigate(to: path); pendingPath = nil }
        if pendingStatusSheet { StatusSheet.present(from: vc); pendingStatusSheet = false }
    }

    private static func topBridgeController() -> WikiBridgeViewController? {
        UIApplication.shared.connectedScenes
            .compactMap { ($0 as? UIWindowScene)?.keyWindow?.rootViewController }
            .compactMap { $0 as? WikiBridgeViewController }
            .first
    }
}

// MARK: - Persistent crisis button

/// A native, always-reachable path to crisis help — visible whatever page the
/// web content is on, and unaffected by web-layer failures. Tap → crisis hub.
/// Long-press → the content-status sheet (freshness, updates, version).
final class CrisisButton: UIButton {
    private static let esTitle = "Crisis"
    private static let enTitle = "Crisis help"

    static func install(in vc: WikiBridgeViewController) {
        let es = Locale.preferredLanguages.first?.hasPrefix("es") == true
        var config = UIButton.Configuration.filled()
        config.title = es ? esTitle : enTitle
        config.image = UIImage(systemName: "cross.case.fill")
        config.imagePadding = 6
        config.baseBackgroundColor = .systemRed // danger semantics, both themes
        config.baseForegroundColor = .white
        config.cornerStyle = .capsule
        config.contentInsets = NSDirectionalEdgeInsets(top: 12, leading: 16, bottom: 12, trailing: 16)

        let button = CrisisButton(configuration: config)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.titleLabel?.font = UIFont.preferredFont(forTextStyle: .headline)
        button.titleLabel?.adjustsFontForContentSizeCategory = true
        // At the very largest accessibility sizes a floating capsule would
        // swallow the screen; AX2 keeps it growing meaningfully but bounded.
        button.maximumContentSizeCategory = .accessibilityExtraLarge
        button.accessibilityLabel = es ? "Ayuda en crisis" : "Crisis help"
        button.accessibilityHint = es
            ? "Abre los recursos de crisis. Mantén pulsado para el estado del contenido."
            : "Opens crisis resources. Long-press for content status."
        button.layer.shadowColor = UIColor.black.cgColor
        button.layer.shadowOpacity = 0.25
        button.layer.shadowRadius = 4
        button.layer.shadowOffset = CGSize(width: 0, height: 2)

        button.addAction(UIAction { [weak vc] _ in
            let es = Locale.preferredLanguages.first?.hasPrefix("es") == true
            vc?.navigate(to: es ? "/es/crisis/" : "/crisis/")
        }, for: .touchUpInside)
        let longPress = UILongPressGestureRecognizer(target: button, action: #selector(showStatus(_:)))
        button.addGestureRecognizer(longPress)

        vc.view.addSubview(button)
        NSLayoutConstraint.activate([
            button.trailingAnchor.constraint(equalTo: vc.view.safeAreaLayoutGuide.trailingAnchor, constant: -16),
            button.bottomAnchor.constraint(equalTo: vc.view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            button.heightAnchor.constraint(greaterThanOrEqualToConstant: 44),
            button.widthAnchor.constraint(greaterThanOrEqualToConstant: 44),
        ])
    }

    @objc private func showStatus(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began,
              let vc = sequence(first: next, next: { $0?.next }).compactMap({ $0 as? WikiBridgeViewController }).first
        else { return }
        StatusSheet.present(from: vc)
    }
}

// MARK: - Content status sheet

/// The update-status surface: what content is being served (bundle or OTA),
/// from when, app version, and a manual "check now". UIAlertController gives
/// Dynamic Type, VoiceOver, and both themes for free.
enum StatusSheet {
    static func present(from vc: WikiBridgeViewController) {
        let es = Locale.preferredLanguages.first?.hasPrefix("es") == true
        let status = OTAUpdater.shared.statusSummary(spanish: es)
        let alert = UIAlertController(
            title: es ? "Estado del contenido" : "Content status",
            message: status,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: es ? "Buscar actualizaciones" : "Check for updates now", style: .default) { _ in
            OTAUpdater.shared.checkForUpdateInBackground()
        })
        alert.addAction(UIAlertAction(title: es ? "Cerrar" : "Done", style: .cancel))
        vc.present(alert, animated: !UIAccessibility.isReduceMotionEnabled)
    }
}
