/* ============================================================
   C Wall Monitor — site chrome
   Renders the header + footer based on data-page on <body>.
   ============================================================ */
(function () {
  const NAV = [
    { href: 'index.html',         label: 'Overview',      page: 'index' },
    { href: 'how-it-works.html',  label: 'How it works',  page: 'how-it-works' },
    { href: 'setup.html',         label: 'Setup',         page: 'setup' },
    { href: 'usage.html',         label: 'Usage',         page: 'usage' },
    { href: 'plugin.html',        label: 'Plugin & skills', page: 'plugin' },
    { href: 'faq.html',           label: 'FAQ',           page: 'faq' },
  ];
  const WAITLIST_URL = 'https://forms.gle/Yg3ZhXZJGXuvRKx49';

  function renderHeader(active) {
    const navLinks = NAV.map(n =>
      `<a href="${n.href}" class="${n.page === active ? 'active' : ''}">${n.label}</a>`
    ).join('');
    return `
      <header class="site-header">
        <div class="inner">
          <a href="index.html" class="brand-mark">
            <img src="assets/logo.png" alt="Fractal Manifold">
            <span class="name">
              <span>C Wall Monitor</span>
              <span class="sub">by Fractal Manifold</span>
            </span>
          </a>
          <nav class="site-nav" id="siteNav">
            ${navLinks}
            <a href="${WAITLIST_URL}" target="_blank" rel="noopener" class="btn btn-primary btn-sm nav-cta">Get early access</a>
          </nav>
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" type="button">
            <svg class="ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <svg class="ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          </button>
          <button class="menu-toggle" aria-label="Menu" onclick="document.getElementById('siteNav').classList.toggle('open')">
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1h16M1 7h16M1 13h16"/></svg>
          </button>
        </div>
      </header>`;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="inner">
          <div>
            <a href="index.html" class="brand-mark" style="margin-bottom:1rem">
              <img src="assets/logo.png" alt="">
              <span class="name">
                <span>C Wall Monitor</span>
                <span class="sub">by Fractal Manifold</span>
              </span>
            </a>
            <p>A 4-inch always-on display that shows live AI CLI usage from your laptop.</p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="index.html">Overview</a></li>
              <li><a href="how-it-works.html">How it works</a></li>
              <li><a href="setup.html">Setup</a></li>
              <li><a href="usage.html">Usage</a></li>
            </ul>
          </div>
          <div>
            <h4>Developers</h4>
            <ul>
              <li><a href="plugin.html">Plugin install</a></li>
              <li><a href="plugin.html#skills">Skills reference</a></li>
              <li><a href="faq.html">Troubleshooting</a></li>
            </ul>
          </div>
          <div>
            <h4>Fractal Manifold</h4>
            <ul>
              <li><a href="https://fractalmanifold.com" target="_blank" rel="noopener">fractalmanifold.com</a></li>
              <li><a href="mailto:cwm@fractalmanifold.com">cwm@fractalmanifold.com</a></li>
            </ul>
          </div>
        </div>
        <div class="colophon">
          <span>© 2026 <a href="https://fractalmanifold.com" target="_blank" rel="noopener">Fractal Manifold</a></span>
        </div>
      </footer>`;
  }

  function renderBackground() {
    return `
      <div class="bg-stage" aria-hidden="true">
        <div class="orb gold orb-1"></div>
        <div class="orb purple orb-2"></div>
        <div class="orb warm orb-3"></div>
      </div>`;
  }

  function applySavedTheme() {
    try {
      const t = localStorage.getItem('cwm:theme');
      if (t === 'light' || t === 'dark') {
        document.documentElement.dataset.theme = t;
      }
    } catch (_) {}
  }
  // Run as early as possible to minimise flash. site.js is in <body>,
  // so the body has already painted in default-dark by the time we get
  // here — the swap is a single frame. Good enough for a demo.
  applySavedTheme();

  function wireThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('cwm:theme', next); } catch (_) {}
    });
  }

  function init() {
    const body = document.body;
    const page = body.getAttribute('data-page') || 'index';

    // Inject background once if not present
    if (!document.querySelector('.bg-stage')) {
      body.insertAdjacentHTML('afterbegin', renderBackground());
    }
    // Header (skip if author already placed one)
    if (!document.querySelector('.site-header')) {
      const bgEl = document.querySelector('.bg-stage');
      bgEl.insertAdjacentHTML('afterend', renderHeader(page));
    }
    // Footer
    if (!document.querySelector('.site-footer')) {
      body.insertAdjacentHTML('beforeend', renderFooter());
    }
    wireThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
