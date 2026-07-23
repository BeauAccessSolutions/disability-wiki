import Capacitor
import Foundation
import UIKit
import WebKit

// Capacitor's default router assumes a SPA: ANY extensionless path is answered
// with the root /index.html. This site is a 540-page Astro MPA built as
// directory indexes (/crisis/ → crisis/index.html), so under the default
// router every internal link silently "navigated" to the home page — including
// the crisis pages, which are the reason this app exists.
//
// This router resolves directory-style paths to their real index.html, and
// falls back to the built 404 page (not home) when nothing exists — a wrong
// link should LOOK wrong, not quietly land on the homepage.
struct WikiRouter: Router {
    var basePath: String = ""

    func route(for path: String) -> String {
        let pathUrl = URL(fileURLWithPath: path)

        // Files with extensions (assets, .html, pagefind indexes) pass through.
        if !pathUrl.pathExtension.isEmpty {
            return basePath + path
        }

        // Directory-style page: /crisis or /crisis/ → /crisis/index.html
        let trimmed = path.hasSuffix("/") ? String(path.dropLast()) : path
        let candidate = trimmed.isEmpty ? "/index.html" : trimmed + "/index.html"
        if FileManager.default.fileExists(atPath: basePath + candidate) {
            return basePath + candidate
        }

        // Nothing there: serve the site's own 404 page if built, else home.
        if FileManager.default.fileExists(atPath: basePath + "/404.html") {
            return basePath + "/404.html"
        }
        return basePath + "/index.html"
    }
}

class WikiBridgeViewController: CAPBridgeViewController {
    override func router() -> Router {
        WikiRouter()
    }

    // Serve from the OTA content root when a validated one exists; otherwise the
    // bundle. Same hook Capacitor itself uses for deploy snapshots. The asset
    // handler pushes appLocation into WikiRouter.basePath, so routing (deep
    // paths, 404 fallback) is identical whichever root is active. Rollback
    // (current → previous → bundle) happens inside activeContentRoot().
    override func instanceDescriptor() -> InstanceDescriptor {
        let descriptor = super.instanceDescriptor()
        if let otaRoot = OTAUpdater.shared.activeContentRoot() {
            descriptor.appLocation = otaRoot
        }
        return descriptor
    }

    // MARK: - Dynamic Type bridge
    //
    // WKWebView does NOT map the iOS system text-size setting onto web content: a
    // low-vision reader who enlarges text device-wide sees no change inside a
    // WebView. On an accessibility organization's app that is the gap that matters
    // most, so we bridge it — the web content's rem-based type scales with the
    // user's Dynamic Type setting, the same as native text.
    //
    // How: the root font-size drives every rem in Starlight's type scale, so
    // scaling <html> scales the whole page.
    //
    // Applied by evaluating JS into the live page rather than via a documentStart
    // user script: a script added in webViewConfiguration(for:) did not survive
    // Capacitor's own webview setup (verified — it never ran), and anything pushed
    // at capacitorDidLoad lands before the first page exists. Instead we observe
    // the webview's load progress and (re)apply as each document comes up, so every
    // navigation gets it, including OTA-served pages. Applying from ~10% progress
    // keeps the unscaled flash to a frame or two.
    private var loadObservation: NSKeyValueObservation?

    /// Dynamic Type multiplier for the current setting, from the system's own curve.
    private var dynamicTypeScale: Double {
        // Read the APP-level category explicitly rather than relying on
        // UITraitCollection.current, which isn't reliably populated this early.
        let traits = UITraitCollection(preferredContentSizeCategory: UIApplication.shared.preferredContentSizeCategory)
        let raw = Double(UIFontMetrics(forTextStyle: .body).scaledValue(for: 17, compatibleWith: traits)) / 17.0
        // Never shrink below 100%; cap at 2× so the largest accessibility sizes
        // enlarge substantially without overflowing a reflowing web layout (the
        // system curve reaches ~3.1× at AX5, which breaks tables and code blocks).
        return min(max(raw, 1.0), 2.0)
    }

    /// Scale the live page's type, and make the header resilient at large sizes.
    /// Idempotent — safe to call on every progress tick.
    private func applyDynamicType() {
        guard let webView = bridge?.webView else { return }
        // Fixed POSIX format keeps this locale-proof: a comma decimal separator
        // would emit invalid JS.
        let scale = String(format: "%.4f", locale: Locale(identifier: "en_US_POSIX"), dynamicTypeScale)
        // Scale what people READ; keep the nav bar a nav bar. Starlight's header is
        // one row of wordmark + search + menu, and at 2× the wordmark clips to
        // "Disa…" and crowds the controls. Pinning the header to px opts it out of
        // the rem scale — the icon targets stay ≥44pt and the site identity stays
        // legible, while all page content scales with Dynamic Type.
        let js = """
        (function(){try{
        document.documentElement.style.setProperty('font-size',(\(scale)*100)+'%','important');
        if(!document.getElementById('dw-a11y-css')){
        var st=document.createElement('style');st.id='dw-a11y-css';
        st.textContent='header.header{font-size:16px!important}'
        +'header.header .site-title{font-size:18px!important;white-space:normal!important;'
        +'overflow:visible!important;text-overflow:clip!important;line-height:1.15}';
        (document.head||document.documentElement).appendChild(st);}
        }catch(e){}})();
        """
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    @objc private func dynamicTypeChanged() { applyDynamicType() }

    override func capacitorDidLoad() {
        super.capacitorDidLoad()
        // Off the launch path: fetch → verify signature → stage. A staged update
        // activates on the NEXT launch, never mid-session.
        OTAUpdater.shared.checkForUpdateInBackground()
        // Native affordances: the always-reachable crisis button, and any
        // home-screen quick action that arrived before the webview was ready.
        CrisisButton.install(in: self)
        CrisisShortcuts.deliverPending(to: self)
        // Accessibility: scale web type to the user's Dynamic Type setting on every
        // document, and keep it in step if they change it while the app is running.
        applyDynamicType()
        loadObservation = bridge?.webView?.observe(\.estimatedProgress, options: [.new]) { [weak self] _, _ in
            self?.applyDynamicType()
        }
        NotificationCenter.default.addObserver(
            self, selector: #selector(dynamicTypeChanged),
            name: UIContentSizeCategory.didChangeNotification, object: nil
        )
    }

    /// Navigate the web content from native code (quick actions, crisis button).
    /// Loads via the serving origin so WikiRouter handles the path exactly as an
    /// in-content link would — including the OTA content root when one is active.
    func navigate(to path: String) {
        guard let webView = bridge?.webView,
              let url = URL(string: "capacitor://localhost" + path) else { return }
        webView.load(URLRequest(url: url))
    }
}
