import UIKit
import Capacitor

// Phase 2 follow-ups: saved pages and system share.
//
// Placement matters here. The red Crisis button owns the bottom-TRAILING corner
// and does exactly one thing, because in a crisis nobody should have to read a
// menu. Everything else lives behind a neutral "More" button in the opposite
// corner, so the two are never confused by position or colour.
//
// Saving is cheap by design: the whole site is already bundled, so a saved page
// is a bookmark, not a download — it works offline the moment you save it, and
// it costs no storage. That matters for readers on metered data or low-storage
// devices, which is a large slice of this audience.

// MARK: - Store

enum SavedPages {
    private static let key = "dw-saved-pages"

    struct Page: Codable, Equatable {
        let path: String
        let title: String
        let savedAt: Date
    }

    static var all: [Page] {
        guard let data = UserDefaults.standard.data(forKey: key),
              let pages = try? JSONDecoder().decode([Page].self, from: data) else { return [] }
        return pages
    }

    static func contains(_ path: String) -> Bool { all.contains { $0.path == path } }

    static func add(path: String, title: String) {
        var pages = all
        guard !pages.contains(where: { $0.path == path }) else { return }
        pages.insert(Page(path: path, title: title, savedAt: Date()), at: 0) // newest first
        write(pages)
    }

    static func remove(path: String) { write(all.filter { $0.path != path }) }

    static func remove(at index: Int) {
        var pages = all
        guard pages.indices.contains(index) else { return }
        pages.remove(at: index)
        write(pages)
    }

    private static func write(_ pages: [Page]) {
        guard let data = try? JSONEncoder().encode(pages) else { return }
        UserDefaults.standard.set(data, forKey: key)
    }
}

// MARK: - Saved pages list

final class SavedPagesViewController: UITableViewController {
    private var pages: [SavedPages.Page] = SavedPages.all
    private let spanish = Locale.preferredLanguages.first?.hasPrefix("es") == true
    private weak var bridge: WikiBridgeViewController?

    init(bridge: WikiBridgeViewController?) {
        self.bridge = bridge
        super.init(style: .insetGrouped)
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func viewDidLoad() {
        super.viewDidLoad()
        title = spanish ? "Páginas guardadas" : "Saved pages"
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .done, target: self, action: #selector(dismissSelf))
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        // Grows with Dynamic Type instead of clipping — the whole point of the
        // accessibility work this sits alongside.
        tableView.rowHeight = UITableView.automaticDimension
        tableView.estimatedRowHeight = 56
    }

    @objc private func dismissSelf() {
        dismiss(animated: !UIAccessibility.isReduceMotionEnabled)
    }

    override func numberOfSections(in tableView: UITableView) -> Int { 1 }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        max(pages.count, 1) // one row reserved for the empty state
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        var content = cell.defaultContentConfiguration()
        if pages.isEmpty {
            content.text = spanish
                ? "Aún no has guardado ninguna página."
                : "You haven't saved any pages yet."
            content.secondaryText = spanish
                ? "Usa «Más» → «Guardar esta página» en cualquier página."
                : "Use More → Save this page on any page."
            content.textProperties.color = .secondaryLabel
            cell.selectionStyle = .none
            cell.accessoryType = .none
        } else {
            let page = pages[indexPath.row]
            content.text = page.title
            content.secondaryText = page.path
            cell.selectionStyle = .default
            cell.accessoryType = .disclosureIndicator
        }
        content.textProperties.numberOfLines = 0
        content.secondaryTextProperties.numberOfLines = 0
        cell.contentConfiguration = content
        return cell
    }

    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        !pages.isEmpty
    }

    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle,
                            forRowAt indexPath: IndexPath) {
        guard editingStyle == .delete, !pages.isEmpty else { return }
        SavedPages.remove(at: indexPath.row)
        pages = SavedPages.all
        if pages.isEmpty {
            tableView.reloadRows(at: [indexPath], with: .automatic) // becomes the empty state
        } else {
            tableView.deleteRows(at: [indexPath], with: .automatic)
        }
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: false)
        guard !pages.isEmpty else { return }
        let path = pages[indexPath.row].path
        let bridge = self.bridge
        dismiss(animated: !UIAccessibility.isReduceMotionEnabled) { bridge?.navigate(to: path) }
    }
}

// MARK: - "More" button and its menu

final class PageActionsButton: UIButton {
    static func install(in vc: WikiBridgeViewController) {
        let es = Locale.preferredLanguages.first?.hasPrefix("es") == true
        // Explicit semantic colours rather than .gray(): the default renders as a
        // faint glyph on a faint fill, which all but disappears over white content.
        // label-on-secondarySystemBackground keeps real contrast in both themes.
        var config = UIButton.Configuration.filled()
        config.image = UIImage(systemName: "ellipsis")
        config.baseBackgroundColor = .secondarySystemBackground
        config.baseForegroundColor = .label
        config.cornerStyle = .capsule
        config.contentInsets = NSDirectionalEdgeInsets(top: 12, leading: 14, bottom: 12, trailing: 14)

        let button = PageActionsButton(configuration: config)
        button.translatesAutoresizingMaskIntoConstraints = false
        // Same lift as the crisis button, so it reads as a control floating over
        // content rather than part of the page.
        button.layer.shadowColor = UIColor.black.cgColor
        button.layer.shadowOpacity = 0.2
        button.layer.shadowRadius = 4
        button.layer.shadowOffset = CGSize(width: 0, height: 2)
        button.accessibilityLabel = es ? "Más acciones" : "More actions"
        button.accessibilityHint = es
            ? "Guardar esta página, ver páginas guardadas, compartir o ver el estado del contenido."
            : "Save this page, view saved pages, share, or see content status."
        button.addAction(UIAction { [weak vc] _ in
            guard let vc else { return }
            presentMenu(from: vc, source: button)
        }, for: .touchUpInside)

        vc.view.addSubview(button)
        NSLayoutConstraint.activate([
            button.leadingAnchor.constraint(equalTo: vc.view.safeAreaLayoutGuide.leadingAnchor, constant: 16),
            button.bottomAnchor.constraint(equalTo: vc.view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            button.heightAnchor.constraint(greaterThanOrEqualToConstant: 44),
            button.widthAnchor.constraint(greaterThanOrEqualToConstant: 44),
        ])
    }

    private static func presentMenu(from vc: WikiBridgeViewController, source: UIView) {
        let es = Locale.preferredLanguages.first?.hasPrefix("es") == true
        // Read the live page first so Save/Share act on what's actually on screen.
        vc.currentPage { path, title in
            let sheet = UIAlertController(title: title.isEmpty ? nil : title, message: nil,
                                          preferredStyle: .actionSheet)

            let saved = SavedPages.contains(path)
            sheet.addAction(UIAlertAction(
                title: saved ? (es ? "Quitar de guardadas" : "Remove from saved")
                             : (es ? "Guardar esta página" : "Save this page"),
                style: .default) { _ in
                    if saved { SavedPages.remove(path: path) }
                    else { SavedPages.add(path: path, title: title) }
                })

            sheet.addAction(UIAlertAction(title: es ? "Páginas guardadas…" : "Saved pages…",
                                          style: .default) { _ in
                let list = SavedPagesViewController(bridge: vc)
                let nav = UINavigationController(rootViewController: list)
                vc.present(nav, animated: !UIAccessibility.isReduceMotionEnabled)
            })

            sheet.addAction(UIAlertAction(title: es ? "Compartir esta página" : "Share this page",
                                          style: .default) { _ in
                share(path: path, title: title, from: vc, source: source)
            })

            sheet.addAction(UIAlertAction(title: es ? "Estado del contenido" : "Content status",
                                          style: .default) { _ in
                StatusSheet.present(from: vc)
            })

            sheet.addAction(UIAlertAction(title: es ? "Cancelar" : "Cancel", style: .cancel))

            // iPad/regular-width: an action sheet must be anchored or it traps.
            sheet.popoverPresentationController?.sourceView = source
            sheet.popoverPresentationController?.sourceRect = source.bounds
            vc.present(sheet, animated: !UIAccessibility.isReduceMotionEnabled)
        }
    }

    /// Share the page as a real, public URL — the in-app `capacitor://localhost`
    /// origin is meaningless to whoever receives it. A caseworker or friend gets a
    /// link they can actually open.
    private static func share(path: String, title: String, from vc: UIViewController, source: UIView) {
        guard let url = URL(string: "https://disabilitywiki.org" + path) else { return }
        let items: [Any] = title.isEmpty ? [url] : [title, url]
        let share = UIActivityViewController(activityItems: items, applicationActivities: nil)
        share.popoverPresentationController?.sourceView = source
        share.popoverPresentationController?.sourceRect = source.bounds
        vc.present(share, animated: !UIAccessibility.isReduceMotionEnabled)
    }
}
