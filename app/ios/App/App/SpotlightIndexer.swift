import Foundation
import CoreSpotlight
import UniformTypeIdentifiers
import Capacitor

// Index the crisis pages into iOS Search (Spotlight).
//
// The point is reach at the worst moment: someone pulls down on their home
// screen, types "988" or "abuse", and lands directly on the right page — without
// opening the app first, without a connection, without remembering the app is
// installed at all. For a life-safety reference that is arguably the single
// highest-value native integration in the app.
//
// Scope is deliberately crisis-only. Indexing all ~540 pages would bury the
// pages that matter under benefits and history results, and Spotlight ranking is
// not ours to tune. The bundled crisis tree (~28 pages) is small enough to parse
// and index in well under a second, off the main thread.
//
// Re-indexed only when the content version changes, so a normal launch does no
// work at all.

enum SpotlightIndexer {
    private static let domain = "org.disabilitywiki.crisis"
    private static let versionKey = "dw-spotlight-indexed-version"
    private static let itemCountKey = "dw-spotlight-item-count"

    /// How many crisis pages were discovered for indexing on the last attempt.
    static var lastItemCount: Int { UserDefaults.standard.integer(forKey: itemCountKey) }

    /// Call at launch. Cheap no-op unless the content version changed.
    static func indexIfNeeded(contentRoot: URL?) {
        guard let root = contentRoot else { return }
        guard CSSearchableIndex.isIndexingAvailable() else { return }

        let version = contentVersion(root: root)
        guard UserDefaults.standard.string(forKey: versionKey) != version else { return }

        DispatchQueue.global(qos: .utility).async {
            let items = crisisItems(root: root)
            // Record what we built before handing off. CoreSpotlight's completion is
            // unreliable in the Simulator (indexing is partly stubbed), so this is
            // the one signal that says whether page discovery/parsing actually
            // worked — useful in support too ("is Search finding anything?").
            UserDefaults.standard.set(items.count, forKey: itemCountKey)
            guard !items.isEmpty else {
                CAPLog.print("⚡️  Spotlight: no crisis pages found under \(root.path) — nothing indexed")
                return
            }
            // Replace wholesale: a page deleted upstream must not linger in Search
            // (the same orphan problem that produced the original stale-bundle P0).
            CSSearchableIndex.default().deleteSearchableItems(withDomainIdentifiers: [domain]) { _ in
                CSSearchableIndex.default().indexSearchableItems(items) { error in
                    if let error {
                        CAPLog.print("⚡️  Spotlight: indexing failed: \(error.localizedDescription)")
                    } else {
                        UserDefaults.standard.set(version, forKey: versionKey)
                        CAPLog.print("⚡️  Spotlight: indexed \(items.count) crisis pages")
                    }
                }
            }
        }
    }

    /// The serving root's build stamp, so OTA content updates trigger a re-index.
    private static func contentVersion(root: URL) -> String {
        guard let data = try? Data(contentsOf: root.appendingPathComponent("app-build.json")),
              let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let sha = obj["gitSha"] as? String else { return "unknown" }
        return sha
    }

    private static func crisisItems(root: URL) -> [CSSearchableItem] {
        var items: [CSSearchableItem] = []
        for sub in ["crisis", "es/crisis"] {
            let base = root.appendingPathComponent(sub)
            guard let walker = FileManager.default.enumerator(at: base, includingPropertiesForKeys: nil) else { continue }
            for case let url as URL in walker where url.lastPathComponent == "index.html" {
                // Skip the gen-index-redirects alias stubs (…/index/index.html).
                if url.deletingLastPathComponent().lastPathComponent == "index" { continue }
                guard let html = try? String(contentsOf: url, encoding: .utf8) else { continue }

                let path = "/" + url.deletingLastPathComponent().path
                    .replacingOccurrences(of: root.path, with: "")
                    .trimmingCharacters(in: CharacterSet(charactersIn: "/")) + "/"
                let title = extract(html, #"<title>(.*?)</title>"#)?
                    .replacingOccurrences(of: " | Disability Wiki", with: "") ?? "Disability Wiki"
                let description = extract(html, #"<meta name="description" content="(.*?)""#)

                let attrs = CSSearchableItemAttributeSet(contentType: .content)
                attrs.title = title
                attrs.contentDescription = description
                // Give Search the things people actually type in a crisis.
                attrs.keywords = ["crisis", "hotline", "988", "suicide", "abuse", "emergency",
                                  "disability", "help", "crisis", "línea", "ayuda"]
                let item = CSSearchableItem(uniqueIdentifier: path,
                                            domainIdentifier: domain,
                                            attributeSet: attrs)
                items.append(item)
            }
        }
        return items
    }

    private static func extract(_ html: String, _ pattern: String) -> String? {
        guard let re = try? NSRegularExpression(pattern: pattern, options: [.dotMatchesLineSeparators]),
              let m = re.firstMatch(in: html, range: NSRange(html.startIndex..., in: html)),
              let r = Range(m.range(at: 1), in: html) else { return nil }
        return String(html[r])
            .replacingOccurrences(of: "&amp;", with: "&")
            .replacingOccurrences(of: "&#39;", with: "'")
            .replacingOccurrences(of: "&quot;", with: "\"")
    }

    /// The path a Spotlight result should open, or nil if it isn't ours.
    static func path(for userActivity: NSUserActivity) -> String? {
        guard userActivity.activityType == CSSearchableItemActionType,
              let id = userActivity.userInfo?[CSSearchableItemActivityIdentifier] as? String
        else { return nil }
        return id
    }
}
