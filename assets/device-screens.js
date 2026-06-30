/* ============================================================
   TokenMonitor — Device screens (pixel-exact, reusable)
   480×480 LVGL screens reproduced in HTML for the website.
   Pulled straight from the docs/tokenmonitor-design.html mockups.
   Brand + UI icons are crisp SVG recreations of the firmware's
   on-device assets (provider logos, ambient sun/moon/thermo, gear,
   pencil, battery) rather than letter/emoji placeholders. The one
   exception is the Fractal Manifold mark: it's the real brand logo
   (assets/logo.png) inlined as a trimmed 112px data URI, not an SVG.
   ============================================================ */
(function () {
  /* ────────────── Inject device-only CSS once ─────────────── */
  if (!document.getElementById('tmon-device-styles')) {
    const css = `
    .tmon-screen {
      width: 480px; height: 480px;
      position: absolute; top: 0; left: 0;
      overflow: hidden;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      box-sizing: border-box;
      user-select: none;
      transform-origin: top left;
    }
    /* Scaled wrapper so it can live in a parent of any size.
       Caller sets the parent's size; .tmon-screen-fit autoscales. */
    .tmon-screen-fit {
      position: absolute; inset: 0;
      overflow: hidden;
    }
    .tmon-screen-fit > .tmon-screen { transform: scale(var(--tmon-scale,1)); }

    /* Palettes (mirrors firmware ui_theme.c) */
    .pal-claude-day  { --bg:#e9dcc2; --card:#fffdf8; --card-alt:#d8c7a4; --text:#1e1a14; --text-dim:#5b4a36; --divider:#c4b288; --accent:#c15f3c; --accent-text:#7a331a; }
    .pal-claude-night{ --bg:#120d09; --card:#2a2017; --card-alt:#3a2c1c; --text:#f0e6d2; --text-dim:#a89880; --divider:#503c28; --accent:#e07a4a; --accent-text:#e07a4a; }
    .pal-codex-day   { --bg:#e3e9e6; --card:#ffffff; --card-alt:#d3ded8; --text:#131a17; --text-dim:#4a5a52; --divider:#bacbc3; --accent:#10a37f; --accent-text:#075a46; }
    .pal-codex-night { --bg:#090e0c; --card:#1a231f; --card-alt:#26332c; --text:#e2efe9; --text-dim:#88a098; --divider:#3a4d44; --accent:#1ed29c; --accent-text:#3ce0b0; }
    .pal-antigravity-day  { --bg:#dde7f6; --card:#ffffff; --card-alt:#cedcf1; --text:#0f1a30; --text-dim:#4a5670; --divider:#b2c6e6; --accent:#3186FF; --accent-text:#0a428e; }
    .pal-antigravity-night{ --bg:#070d1c; --card:#161f37; --card-alt:#22304e; --text:#e5ecf8; --text-dim:#8a96b0; --divider:#324568; --accent:#5A9BFF; --accent-text:#7eb1ff; }
    .pal-fm          { --bg:#000000; --card:#1f1f1c; --card-alt:#34302a; --text:#faf9f5; --text-dim:#9a978f; --divider:#38352e; --accent:#a855f7; --accent2:#f59e0b; --accent-text:#f59e0b; }
    .tmon-screen { background: var(--bg); color: var(--text); }

    .t14sb  { font-size: 14px; line-height: 18px; font-weight: 600; }
    .t18    { font-size: 18px; line-height: 22px; font-weight: 500; }
    .t18sb  { font-size: 18px; line-height: 22px; font-weight: 600; }
    .t22    { font-size: 22px; line-height: 26px; font-weight: 500; }
    .t22sb  { font-size: 22px; line-height: 26px; font-weight: 600; }
    .t30    { font-size: 30px; line-height: 34px; font-weight: 600; }
    .t48    { font-size: 48px; line-height: 52px; font-weight: 700; }
    .c-text { color: var(--text); }
    .c-text-dim { color: var(--text-dim); }
    .c-accent { color: var(--accent); }
    .c-accent-tx { color: var(--accent-text); }
    .abs { position: absolute; }

    .logo-box {
      width: 56px; height: 56px; border-radius: 10px;
      background: var(--bg);
      display: flex; align-items: center; justify-content: center;
      font-size: 38px; font-weight: 700; line-height: 1;
    }
    .brand-claude { color: #c15f3c; }
    .brand-codex  { color: #10a37f; }
    .brand-antigravity { color: #3186FF; }
    .pal-claude-night .brand-claude { color: #e07a4a; }
    .pal-codex-night  .brand-codex  { color: #1ed29c; }
    .pal-antigravity-night .brand-antigravity { color: #5A9BFF; }

    .amb-ico { display: inline-flex; align-items: center; justify-content: center;
      width: 26px; height: 26px; font-size: 22px; color: var(--text-dim); vertical-align: middle; }
    .amb-row { display: inline-flex; align-items: center; gap: 6px; }

    .dot-cell { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
    .dot { width: 14px; height: 14px; border-radius: 50%; box-sizing: border-box; border: 2px solid; }
    .dot.d-claude { border-color: #c15f3c; }
    .dot.d-codex  { border-color: #10a37f; }
    .dot.d-antigravity { border-color: #3186FF; }
    .pal-claude-night .dot.d-claude { border-color: #e07a4a; }
    .pal-codex-night  .dot.d-codex  { border-color: #1ed29c; }
    .pal-antigravity-night .dot.d-antigravity { border-color: #5A9BFF; }
    .dot.active.d-claude { background: #c15f3c; }
    .dot.active.d-codex  { background: #10a37f; }
    .dot.active.d-antigravity { background: #3186FF; }
    .pal-claude-night .dot.active.d-claude { background: #e07a4a; }
    .pal-codex-night  .dot.active.d-codex  { background: #1ed29c; }
    .pal-antigravity-night .dot.active.d-antigravity { background: #5A9BFF; }
    .dots-bottom { position: absolute; left: 14px; bottom: 12px; height: 56px; display: flex; align-items: center; gap: 2px; }

    /* battery is now an inline SVG (icoBattery) — level-coloured, matches firmware */

    /* 1px divider edge mirrors the firmware card border so the card reads
       against the bg (the fill delta alone is too low-contrast). FM screens
       (settings/needs-config/etc.) get it too — their rows sit on pure black. */
    .card-box { background: var(--card); border: 1px solid var(--divider); border-radius: 12px; box-sizing: border-box; }
    .pill { background: var(--card-alt); border-radius: 999px; padding: 2px 10px; }
    .bar { background: var(--card-alt); border-radius: 6px; overflow: hidden; }
    .bar .fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
    .bar .ghost { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); opacity: 0.28; }

    .tmon-spinner { width: 28px; height: 28px; border: 3px solid var(--card-alt);
      border-top-color: var(--accent2, var(--accent)); border-radius: 50%; animation: tmon-spin 1s linear infinite; }
    @keyframes tmon-spin { to { transform: rotate(360deg); } }
    .toast { background: rgba(20,20,20,0.92); border-radius: 8px; color: #fff; padding: 6px 14px; }
    `;
    const style = document.createElement('style');
    style.id = 'tmon-device-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ────────────── Device-matched icons ──────────────
     Crisp SVG recreations of the firmware assets so the screens read
     like the real device instead of letter placeholders:
       · provider logos — Claude pixel-mascot (mascot.c k_mark_bitmap),
                          Codex >_ app icon, Antigravity glyph
       · Fractal Manifold chrome infinity — the REAL logo.png (inlined),
                          not an SVG recreation (see _fmLogoSrc below)
       · ambient sun/moon/thermo — fixed colours from mascot.c
                          (WARN #d4a44a, MID #b0aea5, BULB #c15f3c)
       · gear = LV_SYMBOL_SETTINGS (FA cog), pencil = LV_SYMBOL_EDIT (FA pen)
       · battery = the 14×8 level-coloured icon (GREEN≥50 / WARN≥20 / BAD)
     Gradient ids are unique per call so repeated frames never collide. */
  var _tmonGid = 0;
  function tmonGid(p) { return p + '-' + (++_tmonGid); }

  function providerLogo(p) {
    if (p === 'codex') {
      var g = tmonGid('cdx');
      return '<svg viewBox="0 0 56 56" width="48" height="48" aria-label="Codex" xmlns="http://www.w3.org/2000/svg">'
        + '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b9eff"/><stop offset="1" stop-color="#9b7bff"/></linearGradient></defs>'
        + '<rect x="6" y="6" width="44" height="44" rx="13" fill="url(#' + g + ')"/>'
        + '<path d="M21 21 l7 7 l-7 7" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
        + '<line x1="29" y1="37" x2="38" y2="37" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>';
    }
    if (p === 'antigravity') {
      // Official Antigravity brand mark (assets/antigravity-logo.svg) — the colourful
      // arch glyph, inlined so the bundle has no external-asset / base-path dependency.
      // The SVG's shared id suffix is uniquified per call so repeated frames never collide.
      var ag = tmonGid('agy');
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 7.5 99 99" width="46" height="46" fill="none" aria-label="Antigravity"><defs><filter id="filter0_f_6001_463" x="2.49348" y="-26.5423" width="69.0899" height="61.2525" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="3.89034" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter1_f_6001_463" x="28.7524" y="-32.0333" width="135.477" height="134.313" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="18.8078" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter2_f_6001_463" x="-62.2884" y="-21.9253" width="142.637" height="127.18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="15.9884" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter3_f_6001_463" x="-62.2884" y="-21.9253" width="142.637" height="127.18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="15.9884" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter4_f_6001_463" x="-52.5697" y="-20.8346" width="127.582" height="127.452" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="15.9884" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter5_f_6001_463" x="17.3619" y="45.4646" width="116.786" height="118.715" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="15.1937" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter6_f_6001_463" x="-7.44765" y="-60.4737" width="125.303" height="122.858" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="13.7698" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter7_f_6001_463" x="-27.7086" y="13.3597" width="157.119" height="162.029" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="12.297" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter8_f_6001_463" x="50.4638" y="16.981" width="87.3973" height="83.7738" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="11.0036" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter9_f_6001_463" x="34.2604" y="-28.457" width="116.701" height="104.506" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="9.29385" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><filter id="filter10_f_6001_463" x="-15.1522" y="-15.9493" width="77.2941" height="91.076" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend><feGaussianBlur stdDeviation="11.5027" result="effect1_foregroundBlur_6001_463"></feGaussianBlur></filter><clipPath id="clip0_6001_463"><rect width="869" height="113" fill="white"></rect></clipPath></defs><mask id="mask0_6001_463" maskUnits="userSpaceOnUse" x="13" y="18" width="85" height="78" style="mask-type: alpha;"><path d="M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z" fill="black"></path></mask><g mask="url(#mask0_6001_463)"><g filter="url(#filter0_f_6001_463)"><ellipse cx="22.7873" cy="26.8098" rx="22.7873" ry="26.8098" transform="matrix(-0.112784 0.99362 -0.99362 -0.112781 66.2473 -15.5344)" fill="#FFE432"></ellipse></g><g filter="url(#filter1_f_6001_463)"><ellipse cx="96.491" cy="35.1231" rx="29.5007" ry="30.1492" transform="rotate(76.9243 96.491 35.1231)" fill="#FC413D"></ellipse></g><g filter="url(#filter2_f_6001_463)"><ellipse cx="9.02988" cy="41.6647" rx="30.832" ry="39.9417" transform="rotate(74.1257 9.02988 41.6647)" fill="#00B95C"></ellipse></g><g filter="url(#filter3_f_6001_463)"><ellipse cx="9.02988" cy="41.6647" rx="30.832" ry="39.9417" transform="rotate(74.1257 9.02988 41.6647)" fill="#00B95C"></ellipse></g><g filter="url(#filter4_f_6001_463)"><ellipse cx="11.2212" cy="42.8915" rx="30.22" ry="33.2695" transform="rotate(45.6065 11.2212 42.8915)" fill="#00B95C"></ellipse></g><g filter="url(#filter5_f_6001_463)"><ellipse cx="75.7546" cy="104.822" rx="29.0177" ry="27.943" transform="rotate(76.9243 75.7546 104.822)" fill="#3186FF"></ellipse></g><g filter="url(#filter6_f_6001_463)"><ellipse cx="33.5661" cy="35.4043" rx="33.5661" ry="35.4043" transform="matrix(-0.409539 0.912293 -0.912294 -0.409537 101.25 -15.1674)" fill="#FBBC04"></ellipse></g><g filter="url(#filter7_f_6001_463)"><path d="M2.56802 149.695C-15.8116 142.48 15.5987 83.1163 23.4093 63.2203C31.22 43.3244 52.4514 33.0447 70.831 40.26C89.2107 47.4753 110.996 87.2162 103.185 107.112C95.3742 127.008 20.9477 156.91 2.56802 149.695Z" fill="#3186FF"></path></g><g filter="url(#filter8_f_6001_463)"><path d="M113.934 75.8079C109.013 81.5509 96.1724 78.6224 85.253 69.2667C74.3335 59.911 69.4704 47.6711 74.391 41.928C79.3116 36.185 92.1525 39.1136 103.072 48.4692C113.991 57.8249 118.855 70.0648 113.934 75.8079Z" fill="#749BFF"></path></g><g filter="url(#filter9_f_6001_463)"><ellipse cx="92.611" cy="23.7962" rx="44.2411" ry="27.5016" transform="rotate(34.0763 92.611 23.7962)" fill="#FC413D"></ellipse></g><g filter="url(#filter10_f_6001_463)"><ellipse cx="23.4949" cy="29.5887" rx="23.7071" ry="13.7869" transform="rotate(112.516 23.4949 29.5887)" fill="#FFEE48"></ellipse></g></g></svg>'.replace(/_6001_463/g, ag);
    }
    return '<svg class="brand-claude" viewBox="0 0 16 10" width="46" height="29" fill="currentColor" shape-rendering="crispEdges" aria-label="Claude" xmlns="http://www.w3.org/2000/svg">'
      + '<rect x="2" y="0" width="12" height="2"/><rect x="2" y="2" width="2" height="2"/><rect x="5" y="2" width="6" height="2"/><rect x="12" y="2" width="2" height="2"/>'
      + '<rect x="0" y="4" width="16" height="2"/><rect x="2" y="6" width="12" height="2"/>'
      + '<rect x="3" y="8" width="1" height="2"/><rect x="5" y="8" width="1" height="2"/><rect x="10" y="8" width="1" height="2"/><rect x="12" y="8" width="1" height="2"/></svg>';
  }

  /* Real Fractal Manifold brand mark — the polished 3-D chrome infinity
     (assets/logo.png), trimmed, squared and inlined at 112px so this
     bundle has no external image dependency and no base-path concerns.
     Square, transparent: reads on both the light Day and dark Night card. */
  var _fmLogoSrc = 'data:image/png;base64,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';
  function fmMark(w) {
    return '<img src="' + _fmLogoSrc + '" width="' + w + '" height="' + w + '" alt="Fractal Manifold" draggable="false" style="display:block"/>';
  }

  function icoSun() {
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#d4a44a" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">'
      + '<circle cx="12" cy="12" r="4.2" fill="#d4a44a" stroke="none"/>'
      + '<line x1="12" y1="2.5" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.5" y2="12"/></svg>';
  }
  function icoMoon() {
    return '<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill="#b0aea5" d="M21 14.5 A9 9 0 1 1 11 3 A7 7 0 1 0 21 14.5 Z"/></svg>';
  }
  function icoThermo() {
    return '<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">'
      + '<path fill="none" stroke="#b0aea5" stroke-width="2.4" stroke-linecap="round" d="M12 4 L12 13.5"/>'
      + '<rect x="10.7" y="11" width="2.6" height="7" fill="#c15f3c"/><circle cx="12" cy="18" r="4.2" fill="#c15f3c"/></svg>';
  }
  function icoGear(px) {
    px = px || 30;
    return '<svg viewBox="0 0 512 512" width="' + px + '" height="' + px + '" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.3 273.1 63.7 264.6 63.7 256s.6-17.1 1.7-25.4L22.1 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';
  }
  function icoPencil(px) {
    px = px || 22;
    return '<svg viewBox="0 0 512 512" width="' + px + '" height="' + px + '" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>';
  }
  function icoBattery(pct) {
    pct = Math.max(0, Math.min(100, pct | 0));
    var col = pct >= 50 ? '#788c5d' : pct >= 20 ? '#d4a44a' : '#c15f3c';
    var fw = Math.max(1, (pct / 100) * 22).toFixed(1);
    return '<svg viewBox="0 0 30 16" width="30" height="16" xmlns="http://www.w3.org/2000/svg">'
      + '<rect x="1" y="2" width="25" height="12" rx="2.5" fill="none" stroke="#b0aea5" stroke-width="2"/>'
      + '<rect x="27" y="5.5" width="2.5" height="5" rx="1" fill="#b0aea5"/>'
      + '<rect x="3.5" y="4.5" width="' + fw + '" height="7" rx="1" fill="' + col + '"/></svg>';
  }

  /* ────────────── Dashboard ──────────────── */
  function dashboardHtml(opts) {
    const {
      palette, provider, providerName,
      clock = '12:34', date = 'Tue 13 May',
      sunrise = '07:14', sunset = '21:42', tempC = '22.4 °C', battery = '87%',
      cards, statusAst = '*', statusWord = 'Refactoring', statusDots = '...',
      activeChip = provider, withToast = false
    } = opts;
    const dot = (id) => `<div class="dot-cell"><div class="dot d-${id} ${id===activeChip?'active':''}"></div></div>`;
    const card = (top, h, pct, pill, fill, ghost, mL, mR) => `
      <div class="card-box abs" style="left:14px; top:${top}px; width:452px; height:${h}px">
        <div class="t30 c-text abs" style="left:14px; top:10px">${pct}</div>
        <div class="pill t14sb c-text abs" style="right:14px; top:12px">${pill}</div>
        <div class="bar abs" style="left:14px; right:14px; top:50px; height:12px">
          <div class="ghost" style="width:${ghost}%"></div>
          <div class="fill"  style="width:${fill}%"></div>
        </div>
        <div class="t18sb c-text-dim abs" style="left:14px; bottom:10px">${mL}</div>
        ${mR ? `<div class="t18sb c-text abs" style="right:14px; bottom:10px">${mR}</div>` : ''}
      </div>`;
    const cardSmall = (top, h, pct, pill, fill, ghost, mL) => `
      <div class="card-box abs" style="left:14px; top:${top}px; width:452px; height:${h}px">
        <div class="t22sb c-text abs" style="left:14px; top:10px">${pct}</div>
        <div class="pill t14sb c-text abs" style="right:14px; top:12px">${pill}</div>
        <div class="bar abs" style="left:14px; right:14px; top:36px; height:8px">
          <div class="ghost" style="width:${ghost}%"></div>
          <div class="fill"  style="width:${fill}%"></div>
        </div>
        <div class="t18sb c-text-dim abs" style="left:14px; bottom:10px">${mL}</div>
      </div>`;
    const cs = cards.session, cw = cards.weekly, cd = cards.design;
    return `
    <div class="tmon-screen ${palette}">
      <div class="logo-box abs" style="left:14px; top:22px">${providerLogo(provider)}</div>
      <div class="t30 c-text abs" style="left:0; right:0; top:24px; text-align:center">${providerName}</div>
      <div class="t30 c-text abs" style="right:14px; top:18px; text-align:right; line-height:34px; width:140px">${clock}</div>
      <div class="t18sb c-text-dim abs" style="right:14px; top:58px; text-align:right; line-height:22px; width:140px">${date}</div>
      <div class="abs" style="left:14px; right:14px; top:92px; height:28px; display:flex; align-items:center; justify-content:flex-start; gap:18px; padding-right:96px; box-sizing:border-box">
        <span class="amb-row"><span class="amb-ico">${icoSun()}</span><span class="t18sb c-text-dim">${sunrise}</span></span>
        <span class="amb-row"><span class="amb-ico">${icoMoon()}</span><span class="t18sb c-text-dim">${sunset}</span></span>
        <span class="amb-row"><span class="amb-ico">${icoThermo()}</span><span class="t18sb c-text-dim">${tempC}</span></span>
      </div>
      <div class="abs" style="right:14px; top:92px; width:84px; height:28px; display:flex; align-items:center; justify-content:flex-end; gap:6px">
        <span class="amb-ico" style="width:30px">${icoBattery(parseInt(battery, 10))}</span>
        <span class="t18sb c-text-dim">${battery}</span>
      </div>
      ${card(130, 96, cs.pct, 'Current', cs.fill, cs.ghost, cs.metaLeft, cs.metaRight)}
      ${card(236, 96, cw.pct, 'Weekly', cw.fill, cw.ghost, cw.metaLeft, cw.metaRight)}
      ${cd ? cardSmall(342, 76, cd.pct, 'Design', cd.fill, cd.ghost, cd.metaLeft) : ''}
      ${withToast ? `<div class="toast abs t18sb" style="left:50%; transform:translateX(-50%); bottom:78px; width:380px; height:32px; display:flex; align-items:center; justify-content:center">codex: provider creds missing on laptop</div>` : ''}
      <div class="dots-bottom">${dot('claude')}${dot('codex')}${dot('antigravity')}</div>
      <div class="abs" style="left:14px; right:14px; bottom:12px; height:56px; display:flex; align-items:center; justify-content:center; gap:8px; pointer-events:none">
        <span class="t22sb c-accent-tx" style="width:22px; text-align:center">${statusAst}</span>
        <span class="t22sb c-accent-tx">${statusWord}</span>
        <span class="t22sb c-accent-tx" style="width:28px; text-align:left">${statusDots}</span>
      </div>
      <div class="abs" style="right:14px; bottom:12px; width:56px; height:56px; display:flex; align-items:center; justify-content:center; color:var(--text-dim)">${icoGear(32)}</div>
    </div>`;
  }

  /* ────────────── Standby ──────────────── */
  /* The splash doubles as STANDBY and the "loading" view (waiting for the
     first broker sample). `loading` toggles the affordances exactly like
     the firmware's ui_splash_set_loading():
       STANDBY → "Tap to wake" hint, no gear/spinner/status.
       LOADING → gear (top-right, opens Settings) + spinner + status,
                 hint hidden — the gear keeps Settings reachable when the
                 broker is unreachable. The dedicated "Connecting" screen
                 is retired; this loading splash replaces it. */
  function standbyHtml(palette, clock = '12:34', date = 'Tue 13 May', tempC = '22.4 °C', loading = false) {
    /* LOADING lifts the lower cluster (clock/date/status/spinner + ambient
       strip) so the bottom edge is free for the server-down toast; before this
       the red banner overlapped the ambient row and clipped the spinner.
       STANDBY keeps the strip pinned to the very bottom. */
    const clockTop    = loading ? 214 : 222;
    const dateTop     = loading ? 274 : 292;
    const stripBottom = loading ?  60 :  14;
    return `
    <div class="tmon-screen ${palette}">
      ${loading
        ? `<div class="abs c-text-dim" style="right:10px; top:8px">${icoGear(30)}</div>`
        : `<div class="t18sb c-text-dim abs" style="left:14px; top:12px">Tap to wake</div>`}
      <div class="abs" style="left:50%; transform:translateX(-50%); top:50px; width:84px; height:84px; border-radius:14px; background:var(--card); display:flex; align-items:center; justify-content:center">
        ${fmMark(60)}
      </div>
      <div class="t30 c-text abs" style="left:0; right:0; top:144px; text-align:center">TokenMonitor</div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; top:182px; text-align:center; line-height:22px">by Fractal Manifold</div>
      <div class="t48 c-text abs" style="left:0; right:0; top:${clockTop}px; text-align:center; line-height:52px">${clock}</div>
      <div class="t22sb c-text-dim abs" style="left:0; right:0; top:${dateTop}px; text-align:center; line-height:26px">${date}</div>
      ${loading ? `
      <div class="t18sb c-text-dim abs" style="left:0; right:0; top:308px; text-align:center">Searching for server…</div>
      <div class="abs" style="left:50%; transform:translateX(-50%); bottom:114px"><div class="tmon-spinner"></div></div>
      ` : ''}
      <div class="abs" style="left:14px; right:14px; bottom:${stripBottom}px; height:48px; background:var(--card); border-radius:10px; display:flex; align-items:center; justify-content:space-around; padding:0 16px; box-sizing:border-box">
        <span class="amb-row"><span class="amb-ico">${icoSun()}</span><span class="t18sb c-text-dim">07:14</span></span>
        <span class="amb-row"><span class="amb-ico">${icoMoon()}</span><span class="t18sb c-text-dim">21:42</span></span>
        <span class="amb-row"><span class="amb-ico">${icoThermo()}</span><span class="t18sb c-text-dim">${tempC}</span></span>
        <span class="amb-row">
          <span class="amb-ico" style="width:30px">${icoBattery(87)}</span>
          <span class="t18sb c-text-dim">87%</span>
        </span>
      </div>
      ${loading ? `
      <div class="toast abs t18sb" style="left:50%; transform:translateX(-50%); bottom:24px; width:380px; height:30px; display:flex; align-items:center; justify-content:center">Server unavailable</div>
      ` : ''}
    </div>`;
  }

  /* ────────────── Needs Config (pairing) ──────────────── */
  function needsConfigHtml() {
    return `
    <div class="tmon-screen pal-fm">
      <div class="abs" style="left:14px; top:14px; width:56px; height:56px; border-radius:10px; background:var(--card-alt); display:flex; align-items:center; justify-content:center">${fmMark(44)}</div>
      <div class="t22sb c-text abs" style="left:84px; top:18px">TokenMonitor</div>
      <div class="t18 c-text-dim abs" style="left:84px; top:48px">Pair from your AI agent</div>
      <div class="card-box abs" style="left:14px; top:84px; width:452px; height:66px; padding:10px 14px">
        <div class="t18 c-text-dim abs" style="left:14px; top:8px">IP address</div>
        <div class="t22sb c-accent abs" style="left:14px; bottom:8px">192.168.1.42</div>
      </div>
      <div class="card-box abs" style="left:14px; top:162px; width:452px; height:120px; background:var(--card-alt); border:2px solid var(--accent); box-sizing:border-box; padding:10px 14px">
        <div class="t22sb c-text abs" style="left:0; right:0; top:10px; text-align:center">Pairing code</div>
        <div class="t48 c-accent abs" style="left:0; right:0; bottom:6px; text-align:center; letter-spacing:0.08em">428 715</div>
      </div>
      <div class="card-box abs" style="left:14px; top:294px; width:452px; height:76px; padding:10px 14px">
        <div class="t18 c-text abs" style="left:14px; top:8px">On your AI agent run <b style="font-weight:600">/tokenmonitor:configure</b></div>
        <div class="t18 c-text-dim abs" style="left:14px; bottom:8px">Plugin: github.com/fractal-manifold/mcp-marketplace</div>
      </div>
      <div class="abs" style="left:14px; right:14px; bottom:38px; height:32px; display:flex; align-items:center; justify-content:center; gap:10px">
        <div class="tmon-spinner" style="width:24px; height:24px"></div>
        <span class="t18sb c-text-dim">Waiting for setup…</span>
      </div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; bottom:10px; text-align:center">by Fractal Manifold</div>
    </div>`;
  }

  /* ────────────── Provisioning (captive) ──────────────── */
  function provisioningHtml() {
    return `
    <div class="tmon-screen pal-fm">
      <div class="abs" style="left:14px; top:14px; width:50px; height:50px; border-radius:10px; background:var(--card-alt); display:flex; align-items:center; justify-content:center">${fmMark(40)}</div>
      <div class="t22sb c-text abs" style="left:76px; top:18px">TokenMonitor</div>
      <div class="t18 c-text-dim abs" style="left:76px; top:44px">Setup</div>
      <div class="card-box abs" style="left:14px; top:72px; width:452px; height:64px; padding:10px 12px">
        <div class="abs" style="left:12px; top:12px; width:40px; height:40px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center">
          <span class="t22sb" style="color:#fff">1</span>
        </div>
        <div class="t18 c-text-dim abs" style="left:64px; top:8px">Join this Wi-Fi</div>
        <div class="t22sb c-text abs" style="left:64px; bottom:8px">TokenMonitor-3C7C</div>
      </div>
      <div class="card-box abs" style="left:14px; top:144px; width:452px; height:64px; padding:10px 12px">
        <div class="abs" style="left:12px; top:12px; width:40px; height:40px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center">
          <span class="t22sb" style="color:#fff">2</span>
        </div>
        <div class="t18 c-text-dim abs" style="left:64px; top:8px">Scan QR or open URL</div>
        <div class="t22sb c-text abs" style="left:64px; bottom:8px">http://192.168.4.1/</div>
      </div>
      <div class="abs" style="left:50%; top:218px; transform:translateX(-50%); width:144px; height:144px; background:#faf9f5; border-radius:10px; padding:8px; box-sizing:border-box; display:flex; align-items:center; justify-content:center">
        <svg width="128" height="128" viewBox="0 0 21 21" shape-rendering="crispEdges">
          <rect width="21" height="21" fill="#faf9f5"/>
          <g fill="#141413">
            <rect x="0" y="0" width="7" height="7"/><rect x="1" y="1" width="5" height="5" fill="#faf9f5"/><rect x="2" y="2" width="3" height="3"/>
            <rect x="14" y="0" width="7" height="7"/><rect x="15" y="1" width="5" height="5" fill="#faf9f5"/><rect x="16" y="2" width="3" height="3"/>
            <rect x="0" y="14" width="7" height="7"/><rect x="1" y="15" width="5" height="5" fill="#faf9f5"/><rect x="2" y="16" width="3" height="3"/>
            <rect x="8" y="0" width="1" height="1"/><rect x="10" y="0" width="2" height="1"/>
            <rect x="8" y="2" width="1" height="3"/><rect x="11" y="3" width="1" height="2"/>
            <rect x="9" y="6" width="3" height="1"/><rect x="13" y="6" width="1" height="1"/>
            <rect x="0" y="8" width="2" height="1"/><rect x="3" y="8" width="1" height="2"/>
            <rect x="5" y="9" width="2" height="1"/><rect x="8" y="8" width="3" height="2"/>
            <rect x="12" y="8" width="1" height="3"/><rect x="14" y="9" width="2" height="1"/>
            <rect x="16" y="8" width="2" height="2"/><rect x="19" y="9" width="2" height="1"/>
            <rect x="0" y="11" width="1" height="2"/><rect x="2" y="12" width="3" height="1"/>
            <rect x="6" y="11" width="1" height="2"/><rect x="9" y="12" width="2" height="1"/>
            <rect x="12" y="11" width="2" height="2"/><rect x="15" y="12" width="2" height="1"/>
            <rect x="18" y="11" width="1" height="2"/><rect x="20" y="13" width="1" height="2"/>
            <rect x="8" y="14" width="1" height="3"/><rect x="10" y="15" width="2" height="1"/>
            <rect x="13" y="14" width="2" height="2"/><rect x="16" y="14" width="3" height="1"/>
            <rect x="8" y="18" width="3" height="1"/><rect x="12" y="17" width="1" height="3"/>
            <rect x="14" y="18" width="2" height="2"/><rect x="17" y="17" width="1" height="3"/>
            <rect x="19" y="18" width="2" height="1"/>
          </g>
        </svg>
      </div>
      <div class="abs" style="left:14px; right:14px; bottom:38px; height:32px; display:flex; align-items:center; justify-content:center; gap:10px">
        <div class="tmon-spinner" style="width:24px; height:24px"></div>
        <span class="t18sb c-text-dim">Waiting for Wi-Fi credentials…</span>
      </div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; bottom:10px; text-align:center">by Fractal Manifold</div>
    </div>`;
  }

  /* ────────────── Connecting / Saving ──────────────── */
  function statusScreenHtml(title, sub) {
    return `
    <div class="tmon-screen pal-fm">
      <div class="abs" style="left:50%; transform:translateX(-50%); top:140px; width:80px; height:80px; border-radius:14px; background:var(--card-alt); display:flex; align-items:center; justify-content:center">${fmMark(58)}</div>
      <div class="t30 c-text abs" style="left:0; right:0; top:240px; text-align:center; line-height:34px">${title}</div>
      <div class="t22sb c-text-dim abs" style="left:0; right:0; top:282px; text-align:center; line-height:26px">${sub}</div>
      <div class="abs" style="left:50%; transform:translateX(-50%); top:320px"><div class="tmon-spinner"></div></div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; bottom:14px; text-align:center">by Fractal Manifold</div>
    </div>`;
  }

  /* ────────────── Settings ────────────────
     Scrollable list mirroring screen_settings.c: section HEADERS, editable
     FIELD rows (pencil), and read-only ABOUT rows (no pencil) showing live
     state — Serial, Device ID, Firmware, IP, Broker URL. `view` selects the
     scroll position: 'top' (editable fields) or 'about' (so Serial shows). */
  function settingsRows() {
    return [
      ['h', 'PROVIDERS'],
      ['f', 'Claude Code', 'On'],
      ['f', 'Codex', 'Off'],
      ['f', 'Antigravity', 'Off'],
      ['h', 'DISPLAY'],
      ['f', 'Auto-rotate', 'On'],
      ['f', 'Rotate interval', '8 s'],
      ['f', 'Theme', 'Auto · day'],
      ['f', 'Day brightness', '80%'],
      ['f', 'Night brightness', '30%'],
      ['h', 'NETWORK'],
      ['f', 'City', 'Madrid, ES'],
      ['f', 'WiFi SSID', 'FractalHome'],
      ['f', 'WiFi password', '••••••••'],
      ['f', 'Service URL', 'http://192.168.1.50:8765'],
      ['f', 'Passphrase', '••••••••••'],
      ['h', 'AUDIO'],
      ['f', 'Alert volume', '70%'],
      ['h', 'ABOUT'],
      ['r', 'Serial', 'CWM-A1-K3F-2622-000042-7'],
      ['r', 'Device ID', 'a1b2c3d4'],
      ['r', 'Firmware', 'v1.0.0'],
      ['r', 'IP address', '192.168.1.42'],
      ['r', 'Broker URL', 'http://192.168.1.50:8765'],
    ];
  }

  function settingsHtml(palette, view = 'top') {
    const rows = settingsRows();
    const HROW = 30, FROW = 60, GAP = 6, TOP0 = 70;
    let y = TOP0;
    const pos = rows.map(r => { const h = r[0] === 'h' ? HROW : FROW; const o = { y, h, r }; y += h + GAP; return o; });
    const total = y;
    let scroll = 0;
    if (view === 'about') {
      const about = pos.find(o => o.r[0] === 'h' && o.r[1] === 'ABOUT');
      if (about) scroll = about.y - TOP0;
    }
    const rowHtml = pos.map(o => {
      const top = o.y - scroll;
      if (top + o.h < 60 || top > 480) return '';
      if (o.r[0] === 'h') {
        return `<div class="abs t18sb c-text-dim" style="left:14px; right:14px; top:${top}px; height:${HROW}px; display:flex; align-items:flex-end; letter-spacing:0.06em; padding-bottom:4px; border-bottom:1px solid var(--divider)">${o.r[1]}</div>`;
      }
      const editable = o.r[0] === 'f';
      const valCls = editable ? 'c-accent-tx' : 'c-text';
      const maxw = editable ? 360 : 412;
      return `<div class="card-box abs" style="left:14px; top:${top}px; width:452px; height:${FROW}px; padding:8px 14px">
        <div class="t18sb c-text-dim abs" style="left:14px; top:9px">${o.r[1]}</div>
        <div class="t18sb ${valCls} abs" style="left:14px; bottom:9px; max-width:${maxw}px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${o.r[2]}</div>
        ${editable ? `<div class="abs c-accent-tx" style="right:14px; top:18px">${icoPencil(20)}</div>` : ''}
      </div>`;
    }).join('');
    const trackTop = 70, trackH = 400;
    const thumbH = Math.max(40, trackH * (480 - 64) / total);
    const thumbTop = trackTop + (trackH - thumbH) * (scroll / Math.max(1, total - (480 - 64)));
    return `
    <div class="tmon-screen ${palette}">
      ${rowHtml}
      <div class="abs" style="right:3px; top:${trackTop}px; width:4px; height:${trackH}px; background:var(--card-alt); border-radius:2px; opacity:0.5"></div>
      <div class="abs" style="right:3px; top:${thumbTop}px; width:4px; height:${thumbH}px; background:var(--text-dim); border-radius:2px; opacity:0.7"></div>
      <div class="abs" style="left:0; right:0; top:0; height:64px; background:var(--bg); z-index:2"></div>
      <div class="abs" style="left:14px; top:14px; width:452px; height:48px; display:flex; align-items:center; z-index:3">
        <div class="t30 c-text" style="flex:1; text-align:center">Settings</div>
        <div class="abs t18sb c-text" style="right:0; top:4px; padding:10px 16px; background:var(--card); border-radius:8px">Back</div>
      </div>
    </div>`;
  }

  /* ────────────── Settings editor ──────────────── */
  function editorHtml(palette, title, val, fill) {
    return `
    <div class="tmon-screen ${palette}">
      <div class="t22sb c-text abs" style="left:0; right:0; top:18px; text-align:center">${title}</div>
      <div class="abs" style="left:50%; transform:translateX(-50%); top:90px; display:flex; align-items:center; gap:24px">
        <div class="t48 c-accent-tx">${val}</div>
        <div class="c-accent-tx" style="display:flex; align-items:center">${icoPencil(40)}</div>
      </div>
      <div class="abs" style="left:48px; right:48px; top:220px; height:16px; background:var(--card); border-radius:8px">
        <div class="abs" style="left:0; top:0; bottom:0; width:${fill}%; background:var(--accent); border-radius:8px"></div>
        <div class="abs" style="left:${fill}%; top:-9px; width:34px; height:34px; background:var(--accent); border-radius:50%; transform:translateX(-50%)"></div>
      </div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; top:280px; text-align:center; line-height:24px">Step 5%. Pencil for an exact value.<br>Cancel restores the previous value.</div>
      <div class="abs" style="left:14px; bottom:14px; width:210px; height:60px; background:var(--card); border-radius:12px; display:flex; align-items:center; justify-content:center">
        <span class="t22sb c-text">Cancel</span>
      </div>
      <div class="abs" style="right:14px; bottom:14px; width:210px; height:60px; background:var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center">
        <span class="t22sb" style="color:#fff">Save</span>
      </div>
    </div>`;
  }

  /* ────────────── Presets the spec calls for ──────────────── */
  const presets = {
    'claude-day': () => dashboardHtml({
      palette: 'pal-claude-day', provider: 'claude', providerName: 'Claude Code',
      clock: '16:24', date: 'Thu 14 May', sunrise: '06:59', sunset: '21:23', tempC: '21.6 °C', battery: '76%',
      cards: {
        session: { pct: '18.0%', fill: 18, ghost: 44, metaLeft: 'Resets in 2h 56m  ·  at 19:20', metaRight: '→ 44%' },
        weekly:  { pct: '43.0%', fill: 43, ghost: 92, metaLeft: 'Resets in 3d 17h  ·  at Mon 10:00', metaRight: '→ 92%' },
        design:  { pct: '0.0%',  fill: 0,  ghost: 0,  metaLeft: 'Resets in 3d 17h' }
      },
      statusAst: '+', statusWord: 'Whispering', statusDots: '..'
    }),
    'claude-night': () => dashboardHtml({
      palette: 'pal-claude-night', provider: 'claude', providerName: 'Claude Code',
      clock: '23:04', date: 'Thu 14 May', sunrise: '06:59', sunset: '21:23', tempC: '19.1 °C',
      cards: {
        session: { pct: '42.0%', fill: 42, ghost: 78, metaLeft: 'Resets in 3h 12m  ·  at 21:42', metaRight: '→ 78%' },
        weekly:  { pct: '31.0%', fill: 31, ghost: 58, metaLeft: 'Resets in 4d 03h  ·  at Sun 09:00', metaRight: '→ 58%' },
        design:  { pct: '12.0%', fill: 12, ghost: 18, metaLeft: 'Resets in 4d 03h' }
      }
    }),
    'codex-day': () => dashboardHtml({
      palette: 'pal-codex-day', provider: 'codex', providerName: 'Codex',
      cards: {
        session: { pct: '68.0%', fill: 68, ghost: 88, metaLeft: 'Resets in 1h 47m  ·  at 14:21', metaRight: '→ 88%' },
        weekly:  { pct: '52.0%', fill: 52, ghost: 72, metaLeft: 'Resets in 4d 03h  ·  at Sun 09:00', metaRight: '→ 72%' },
        design:  null
      },
      statusAst: '+', statusWord: 'Generating', statusDots: '..',
      activeChip: 'codex'
    }),
    'codex-night': () => dashboardHtml({
      palette: 'pal-codex-night', provider: 'codex', providerName: 'Codex',
      clock: '22:15',
      cards: {
        session: { pct: '34.0%', fill: 34, ghost: 52, metaLeft: 'Resets in 4h 22m  ·  at 02:37', metaRight: '→ 52%' },
        weekly:  { pct: '41.0%', fill: 41, ghost: 60, metaLeft: 'Resets in 4d 03h  ·  at Sun 09:00', metaRight: '→ 60%' },
        design:  null
      },
      statusAst: '+', statusWord: 'Generating', statusDots: '..',
      activeChip: 'codex'
    }),
    'antigravity-day': () => dashboardHtml({
      palette: 'pal-antigravity-day', provider: 'antigravity', providerName: 'Antigravity',
      cards: {
        session: { pct: '24.0%', fill: 24, ghost: 48, metaLeft: 'Resets in 4h 02m  ·  at 16:36', metaRight: '→ 48%' },
        weekly:  { pct: '19.0%', fill: 19, ghost: 32, metaLeft: 'Resets in 5d 11h  ·  at Sun 09:00', metaRight: '→ 32%' },
        design:  null
      },
      statusAst: 'x', statusWord: 'Synthesizing', statusDots: '.',
      activeChip: 'antigravity'
    }),
    'antigravity-night': () => dashboardHtml({
      palette: 'pal-antigravity-night', provider: 'antigravity', providerName: 'Antigravity',
      clock: '22:48',
      cards: {
        session: { pct: '56.0%', fill: 56, ghost: 74, metaLeft: 'Resets in 2h 12m  ·  at 01:00', metaRight: '→ 74%' },
        weekly:  { pct: '38.0%', fill: 38, ghost: 51, metaLeft: 'Resets in 4d 03h  ·  at Sun 09:00', metaRight: '→ 51%' },
        design:  null
      },
      statusAst: 'x', statusWord: 'Synthesizing', statusDots: '.',
      activeChip: 'antigravity'
    }),
    'standby-day':   () => standbyHtml('pal-claude-day'),
    'standby-night': () => standbyHtml('pal-claude-night', '23:04', 'Thu 14 May', '19.1 °C'),
    /* Loading splash (gear → Settings) — replaces the retired Connecting screen. */
    'loading-day':   () => standbyHtml('pal-claude-day', '16:24', 'Thu 14 May', '21.6 °C', true),
    'loading-night': () => standbyHtml('pal-claude-night', '23:04', 'Thu 14 May', '19.1 °C', true),
    'connecting':    () => standbyHtml('pal-claude-day', '16:24', 'Thu 14 May', '21.6 °C', true),
    'saving':        () => statusScreenHtml('Saving…', 'Applying your settings and rebooting'),
    'needs-config':  () => needsConfigHtml(),
    'provisioning':  () => provisioningHtml(),
    /* day/night share the 'top' scroll position (palette-only difference, so
       the website's theme auto-swap doesn't change content). The About view
       (Serial / IDs / firmware) is reachable via the settings-about-* keys. */
    'settings-day':  () => settingsHtml('pal-claude-day', 'top'),
    'settings-night':() => settingsHtml('pal-claude-night', 'top'),
    'settings-about-day':   () => settingsHtml('pal-claude-day', 'about'),
    'settings-about-night': () => settingsHtml('pal-claude-night', 'about'),
    'editor-day':    () => editorHtml('pal-claude-day', 'Day brightness', '80 %', 65),
    'editor-night':  () => editorHtml('pal-claude-night', 'Night brightness', '30 %', 30),
  };

  /* ────────────── Mount API ──────────────── */
  function autoFit(host) {
    const screen = host.querySelector('.tmon-screen');
    if (!screen) return;
    const apply = () => {
      // Fit-by-width: host becomes a perfect square sized to its width,
      // screen scales 480 -> host.clientWidth, pinned to top-left.
      const w = host.clientWidth;
      if (!w) return;
      const scale = w / 480;
      screen.style.setProperty('--tmon-scale', scale);
      host.style.height = w + 'px';
    };
    apply();
    new ResizeObserver(apply).observe(host);
  }

  // Hosts with data-tmon-theme="auto" pick the variant that matches the
  // website theme: light → -day suffix, dark → -night. The key written
  // in data-tmon-screen sets the *family*; the suffix gets rewritten.
  function resolveKey(host) {
    const key = host.getAttribute('data-tmon-screen');
    if (!key) return null;
    if (host.getAttribute('data-tmon-theme') !== 'auto') return key;
    const wantNight = document.documentElement.dataset.theme === 'dark';
    const wantSuffix = wantNight ? '-night' : '-day';
    if (key.endsWith('-day')) return key.slice(0, -4) + wantSuffix;
    if (key.endsWith('-night')) return key.slice(0, -6) + wantSuffix;
    return key;  // base has no day/night variant (e.g. needs-config)
  }

  function mountAll() {
    document.querySelectorAll('[data-tmon-screen]').forEach(host => {
      const key = resolveKey(host);
      const html = presets[key] ? presets[key]() : `<div style="color:#f00">Unknown screen: ${key}</div>`;
      host.innerHTML = `<div class="tmon-screen-fit">${html}</div>`;
      autoFit(host);
    });
  }

  // Re-render themed hosts when the website's theme attribute flips.
  // We MutationObserve <html> rather than relying on a custom event so
  // any code path that flips the attribute keeps the devices in sync.
  function watchTheme() {
    const obs = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.attributeName === 'data-theme') { mountAll(); break; }
      }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { mountAll(); watchTheme(); });
  } else {
    mountAll();
    watchTheme();
  }

  window.TMON = { mount: mountAll, presets };
})();
