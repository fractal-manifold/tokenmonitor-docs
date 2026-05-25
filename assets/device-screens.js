/* ============================================================
   C Wall Monitor — Device screens (pixel-exact, reusable)
   480×480 LVGL screens reproduced in HTML for the website.
   Pulled straight from the cwm-redesign mockups.
   ============================================================ */
(function () {
  /* ────────────── Inject device-only CSS once ─────────────── */
  if (!document.getElementById('cwm-device-styles')) {
    const css = `
    .cwm-screen {
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
       Caller sets the parent's size; .cwm-screen-fit autoscales. */
    .cwm-screen-fit {
      position: absolute; inset: 0;
      overflow: hidden;
    }
    .cwm-screen-fit > .cwm-screen { transform: scale(var(--cwm-scale,1)); }

    /* Palettes (mirrors firmware ui_theme.c) */
    .pal-claude-day  { --bg:#f5efe2; --card:#fffaf0; --card-alt:#ecdfca; --text:#1e1a14; --text-dim:#5b4a36; --divider:#d8cdb5; --accent:#c15f3c; --accent-text:#7a331a; }
    .pal-claude-night{ --bg:#1a1410; --card:#221a14; --card-alt:#2c2018; --text:#f0e6d2; --text-dim:#a89880; --divider:#3a2c20; --accent:#e07a4a; --accent-text:#f0956a; }
    .pal-codex-day   { --bg:#fafafa; --card:#ffffff; --card-alt:#eef3f0; --text:#131a17; --text-dim:#4a5a52; --divider:#d4dcd8; --accent:#10a37f; --accent-text:#075a46; }
    .pal-codex-night { --bg:#0e1311; --card:#161d1a; --card-alt:#1d2723; --text:#e2efe9; --text-dim:#88a098; --divider:#2a3530; --accent:#1ed29c; --accent-text:#3ce0b0; }
    .pal-gemini-day  { --bg:#f3f7ff; --card:#ffffff; --card-alt:#e6edf9; --text:#0f1a30; --text-dim:#4a5670; --divider:#c7d2e6; --accent:#1a73e8; --accent-text:#0a428e; }
    .pal-gemini-night{ --bg:#0a1224; --card:#121a2e; --card-alt:#1a233d; --text:#e5ecf8; --text-dim:#8a96b0; --divider:#24335a; --accent:#5a9bff; --accent-text:#7eb1ff; }
    .pal-fm          { --bg:#000000; --card:#141413; --card-alt:#292621; --text:#faf9f5; --text-dim:#888680; --divider:#2a2825; --accent:#a855f7; --accent2:#f59e0b; --accent-text:#f59e0b; }
    .cwm-screen { background: var(--bg); color: var(--text); }

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
    .brand-gemini { color: #1a73e8; }
    .pal-claude-night .brand-claude { color: #e07a4a; }
    .pal-codex-night  .brand-codex  { color: #1ed29c; }
    .pal-gemini-night .brand-gemini { color: #5a9bff; }

    .amb-ico { display: inline-flex; align-items: center; justify-content: center;
      width: 26px; height: 26px; font-size: 22px; color: var(--text-dim); vertical-align: middle; }
    .amb-row { display: inline-flex; align-items: center; gap: 6px; }

    .dot-cell { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
    .dot { width: 14px; height: 14px; border-radius: 50%; box-sizing: border-box; border: 2px solid; }
    .dot.d-claude { border-color: #c15f3c; }
    .dot.d-codex  { border-color: #10a37f; }
    .dot.d-gemini { border-color: #1a73e8; }
    .pal-claude-night .dot.d-claude { border-color: #e07a4a; }
    .pal-codex-night  .dot.d-codex  { border-color: #1ed29c; }
    .pal-gemini-night .dot.d-gemini { border-color: #5a9bff; }
    .dot.active.d-claude { background: #c15f3c; }
    .dot.active.d-codex  { background: #10a37f; }
    .dot.active.d-gemini { background: #1a73e8; }
    .pal-claude-night .dot.active.d-claude { background: #e07a4a; }
    .pal-codex-night  .dot.active.d-codex  { background: #1ed29c; }
    .pal-gemini-night .dot.active.d-gemini { background: #5a9bff; }
    .dots-bottom { position: absolute; left: 14px; bottom: 12px; height: 56px; display: flex; align-items: center; gap: 2px; }

    .bat-ico { width: 28px; height: 14px; border: 2px solid var(--text-dim); border-radius: 3px; position: relative; }
    .bat-ico::after { content: ''; position: absolute; right: -5px; top: 3px; width: 3px; height: 6px; background: var(--text-dim); border-radius: 1px; }
    .bat-ico .fill { position: absolute; left: 1px; top: 1px; bottom: 1px; width: 65%; background: var(--text-dim); }

    .card-box { background: var(--card); border-radius: 12px; box-sizing: border-box; }
    .pill { background: var(--card-alt); border-radius: 999px; padding: 2px 10px; }
    .bar { background: var(--card-alt); border-radius: 6px; overflow: hidden; }
    .bar .fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
    .bar .ghost { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); opacity: 0.28; }

    .cwm-spinner { width: 28px; height: 28px; border: 3px solid var(--card-alt);
      border-top-color: var(--accent2, var(--accent)); border-radius: 50%; animation: cwm-spin 1s linear infinite; }
    @keyframes cwm-spin { to { transform: rotate(360deg); } }
    .toast { background: rgba(20,20,20,0.92); border-radius: 8px; color: #fff; padding: 6px 14px; }
    `;
    const style = document.createElement('style');
    style.id = 'cwm-device-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function providerLetter(p) { return p === 'claude' ? 'C' : p === 'codex' ? '⌑' : 'G'; }

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
    <div class="cwm-screen ${palette}">
      <div class="logo-box abs" style="left:14px; top:22px"><span class="brand-${provider}">${providerLetter(provider)}</span></div>
      <div class="t30 c-text abs" style="left:0; right:0; top:24px; text-align:center">${providerName}</div>
      <div class="t30 c-text abs" style="right:14px; top:18px; text-align:right; line-height:34px; width:140px">${clock}</div>
      <div class="t18sb c-text-dim abs" style="right:14px; top:58px; text-align:right; line-height:22px; width:140px">${date}</div>
      <div class="abs" style="left:14px; right:14px; top:92px; height:28px; display:flex; align-items:center; justify-content:flex-start; gap:18px; padding-right:96px; box-sizing:border-box">
        <span class="amb-row"><span class="amb-ico">☀</span><span class="t18sb c-text-dim">${sunrise}</span></span>
        <span class="amb-row"><span class="amb-ico">☾</span><span class="t18sb c-text-dim">${sunset}</span></span>
        <span class="amb-row"><span class="amb-ico">🌡</span><span class="t18sb c-text-dim">${tempC}</span></span>
      </div>
      <div class="abs" style="right:14px; top:92px; width:84px; height:28px; display:flex; align-items:center; justify-content:flex-end; gap:6px">
        <div class="bat-ico"><div class="fill"></div></div>
        <span class="t18sb c-text-dim">${battery}</span>
      </div>
      ${card(130, 96, cs.pct, 'Current', cs.fill, cs.ghost, cs.metaLeft, cs.metaRight)}
      ${card(236, 96, cw.pct, 'Weekly', cw.fill, cw.ghost, cw.metaLeft, cw.metaRight)}
      ${cd ? cardSmall(342, 76, cd.pct, 'Design', cd.fill, cd.ghost, cd.metaLeft) : ''}
      ${withToast ? `<div class="toast abs t18sb" style="left:50%; transform:translateX(-50%); bottom:78px; width:380px; height:32px; display:flex; align-items:center; justify-content:center">codex: provider creds missing on laptop</div>` : ''}
      <div class="dots-bottom">${dot('claude')}${dot('codex')}${dot('gemini')}</div>
      <div class="abs" style="left:14px; right:14px; bottom:12px; height:56px; display:flex; align-items:center; justify-content:center; gap:8px; pointer-events:none">
        <span class="t22sb c-accent-tx" style="width:22px; text-align:center">${statusAst}</span>
        <span class="t22sb c-accent-tx">${statusWord}</span>
        <span class="t22sb c-accent-tx" style="width:28px; text-align:left">${statusDots}</span>
      </div>
      <div class="abs" style="right:14px; bottom:12px; width:56px; height:56px; display:flex; align-items:center; justify-content:center; font-size:36px; color:var(--text-dim)">⚙</div>
    </div>`;
  }

  /* ────────────── Standby ──────────────── */
  function standbyHtml(palette, clock = '12:34', date = 'Tue 13 May', tempC = '22.4 °C') {
    return `
    <div class="cwm-screen ${palette}">
      <div class="t18sb c-text-dim abs" style="left:14px; top:12px">Tap to wake</div>
      <div class="abs" style="left:50%; transform:translateX(-50%); top:50px; width:84px; height:84px; border-radius:14px; background:var(--card); display:flex; align-items:center; justify-content:center">
        <span style="font-size:56px; font-weight:700; color:var(--accent)">∞</span>
      </div>
      <div class="t30 c-text abs" style="left:0; right:0; top:144px; text-align:center">C Wall Monitor</div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; top:182px; text-align:center; line-height:22px">by Fractal Manifold</div>
      <div class="t48 c-text abs" style="left:0; right:0; top:222px; text-align:center; line-height:52px">${clock}</div>
      <div class="t22sb c-text-dim abs" style="left:0; right:0; top:292px; text-align:center; line-height:26px">${date}</div>
      <div class="abs" style="left:14px; right:14px; bottom:14px; height:48px; background:var(--card); border-radius:10px; display:flex; align-items:center; justify-content:space-around; padding:0 16px; box-sizing:border-box">
        <span class="amb-row"><span class="amb-ico">☀</span><span class="t18sb c-text-dim">07:14</span></span>
        <span class="amb-row"><span class="amb-ico">☾</span><span class="t18sb c-text-dim">21:42</span></span>
        <span class="amb-row"><span class="amb-ico">🌡</span><span class="t18sb c-text-dim">${tempC}</span></span>
        <span class="amb-row">
          <span class="bat-ico"><span class="fill"></span></span>
          <span class="t18sb c-text-dim">87%</span>
        </span>
      </div>
    </div>`;
  }

  /* ────────────── Needs Config (pairing) ──────────────── */
  function needsConfigHtml() {
    return `
    <div class="cwm-screen pal-fm">
      <div class="abs" style="left:14px; top:14px; width:56px; height:56px; border-radius:10px; background:var(--card-alt); display:flex; align-items:center; justify-content:center"><span style="font-size:32px; font-weight:700; color:var(--accent)">∞</span></div>
      <div class="t22sb c-text abs" style="left:84px; top:18px">C Wall Monitor</div>
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
        <div class="t18 c-text abs" style="left:14px; top:8px">On your AI agent run <b style="font-weight:600">/cwallmonitor:configure</b></div>
        <div class="t18 c-text-dim abs" style="left:14px; bottom:8px">Plugin: github.com/fractal-manifold/mcp-marketplace</div>
      </div>
      <div class="abs" style="left:14px; right:14px; bottom:38px; height:32px; display:flex; align-items:center; justify-content:center; gap:10px">
        <div class="cwm-spinner" style="width:24px; height:24px"></div>
        <span class="t18sb c-text-dim">Waiting for setup…</span>
      </div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; bottom:10px; text-align:center">by Fractal Manifold</div>
    </div>`;
  }

  /* ────────────── Provisioning (captive) ──────────────── */
  function provisioningHtml() {
    return `
    <div class="cwm-screen pal-fm">
      <div class="abs" style="left:14px; top:14px; width:50px; height:50px; border-radius:10px; background:var(--card-alt); display:flex; align-items:center; justify-content:center"><span style="font-size:28px; font-weight:700; color:var(--accent)">∞</span></div>
      <div class="t22sb c-text abs" style="left:76px; top:18px">C Wall Monitor</div>
      <div class="t18 c-text-dim abs" style="left:76px; top:44px">Setup</div>
      <div class="card-box abs" style="left:14px; top:72px; width:452px; height:64px; padding:10px 12px">
        <div class="abs" style="left:12px; top:12px; width:40px; height:40px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center">
          <span class="t22sb" style="color:#fff">1</span>
        </div>
        <div class="t18 c-text-dim abs" style="left:64px; top:8px">Join this Wi-Fi</div>
        <div class="t22sb c-text abs" style="left:64px; bottom:8px">CWallMonitor-3C7C</div>
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
        <div class="cwm-spinner" style="width:24px; height:24px"></div>
        <span class="t18sb c-text-dim">Waiting for Wi-Fi credentials…</span>
      </div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; bottom:10px; text-align:center">by Fractal Manifold</div>
    </div>`;
  }

  /* ────────────── Connecting / Saving ──────────────── */
  function statusScreenHtml(title, sub) {
    return `
    <div class="cwm-screen pal-fm">
      <div class="abs" style="left:50%; transform:translateX(-50%); top:140px; width:80px; height:80px; border-radius:14px; background:var(--card-alt); display:flex; align-items:center; justify-content:center"><span style="font-size:48px; font-weight:700; color:var(--accent)">∞</span></div>
      <div class="t30 c-text abs" style="left:0; right:0; top:240px; text-align:center; line-height:34px">${title}</div>
      <div class="t22sb c-text-dim abs" style="left:0; right:0; top:282px; text-align:center; line-height:26px">${sub}</div>
      <div class="abs" style="left:50%; transform:translateX(-50%); top:320px"><div class="cwm-spinner"></div></div>
      <div class="t18 c-text-dim abs" style="left:0; right:0; bottom:14px; text-align:center">by Fractal Manifold</div>
    </div>`;
  }

  /* ────────────── Settings ──────────────── */
  function settingsHtml(palette) {
    const rows = [
      ['Claude', 'On'],
      ['Codex', 'Off'],
      ['Gemini', 'Off'],
      ['City', 'Madrid, ES'],
    ];
    return `
    <div class="cwm-screen ${palette}">
      <div class="abs" style="left:14px; top:14px; width:452px; height:48px; display:flex; align-items:center">
        <div class="t30 c-text" style="flex:1; text-align:center">Settings</div>
        <div class="abs t18sb c-text" style="right:0; top:4px; padding:10px 16px; background:var(--card); border-radius:8px">Back</div>
      </div>
      ${rows.map((r, i) => `
      <div class="card-box abs" style="left:14px; top:${74 + i*68}px; width:452px; height:60px; padding:10px 14px">
        <div class="t18sb c-text-dim abs" style="left:14px; top:10px">${r[0]}</div>
        <div class="t18sb c-accent-tx abs" style="left:14px; bottom:10px">${r[1]}</div>
        <div class="abs t22sb c-accent-tx" style="right:14px; top:14px">✎</div>
      </div>`).join('')}
      <div class="abs" style="left:14px; right:14px; bottom:14px; height:22px; display:flex; align-items:center">
        <div class="t18sb c-text-dim" style="flex:1; text-align:left">Wi-Fi: FractalHome  ·  192.168.1.42</div>
        <div class="t18sb c-text-dim">v0.3.1</div>
      </div>
    </div>`;
  }

  /* ────────────── Settings editor ──────────────── */
  function editorHtml(palette, title, val, fill) {
    return `
    <div class="cwm-screen ${palette}">
      <div class="t22sb c-text abs" style="left:0; right:0; top:18px; text-align:center">${title}</div>
      <div class="abs" style="left:50%; transform:translateX(-50%); top:90px; display:flex; align-items:center; gap:24px">
        <div class="t48 c-accent-tx">${val}</div>
        <div class="t48 c-accent-tx" style="font-size:44px">✎</div>
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
      palette: 'pal-claude-day', provider: 'claude', providerName: 'Claude',
      clock: '16:24', date: 'Thu 14 May', sunrise: '06:59', sunset: '21:23', tempC: '21.6 °C', battery: '76%',
      cards: {
        session: { pct: '18.0%', fill: 18, ghost: 44, metaLeft: 'Resets in 2h 56m  ·  at 19:20', metaRight: '→ 44%' },
        weekly:  { pct: '43.0%', fill: 43, ghost: 92, metaLeft: 'Resets in 3d 17h  ·  at Mon 10:00', metaRight: '→ 92%' },
        design:  { pct: '0.0%',  fill: 0,  ghost: 0,  metaLeft: 'Resets in 3d 17h' }
      },
      statusAst: '+', statusWord: 'Whispering', statusDots: '..'
    }),
    'claude-night': () => dashboardHtml({
      palette: 'pal-claude-night', provider: 'claude', providerName: 'Claude',
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
    'gemini-day': () => dashboardHtml({
      palette: 'pal-gemini-day', provider: 'gemini', providerName: 'Gemini',
      cards: {
        session: { pct: '24.0%', fill: 24, ghost: 48, metaLeft: 'Resets in 4h 02m  ·  at 16:36', metaRight: '→ 48%' },
        weekly:  { pct: '19.0%', fill: 19, ghost: 32, metaLeft: 'Resets in 5d 11h  ·  at Sun 09:00', metaRight: '→ 32%' },
        design:  null
      },
      statusAst: 'x', statusWord: 'Synthesizing', statusDots: '.',
      activeChip: 'gemini'
    }),
    'gemini-night': () => dashboardHtml({
      palette: 'pal-gemini-night', provider: 'gemini', providerName: 'Gemini',
      clock: '22:48',
      cards: {
        session: { pct: '56.0%', fill: 56, ghost: 74, metaLeft: 'Resets in 2h 12m  ·  at 01:00', metaRight: '→ 74%' },
        weekly:  { pct: '38.0%', fill: 38, ghost: 51, metaLeft: 'Resets in 4d 03h  ·  at Sun 09:00', metaRight: '→ 51%' },
        design:  null
      },
      statusAst: 'x', statusWord: 'Synthesizing', statusDots: '.',
      activeChip: 'gemini'
    }),
    'standby-day':   () => standbyHtml('pal-claude-day'),
    'standby-night': () => standbyHtml('pal-claude-night', '23:04', 'Thu 14 May', '19.1 °C'),
    'connecting':    () => statusScreenHtml('C Wall Monitor', 'Connecting to Wi-Fi…'),
    'saving':        () => statusScreenHtml('Saving…', 'Applying your settings and rebooting'),
    'needs-config':  () => needsConfigHtml(),
    'provisioning':  () => provisioningHtml(),
    'settings-day':  () => settingsHtml('pal-claude-day'),
    'settings-night':() => settingsHtml('pal-claude-night'),
    'editor-day':    () => editorHtml('pal-claude-day', 'Day brightness', '80 %', 65),
    'editor-night':  () => editorHtml('pal-claude-night', 'Night brightness', '30 %', 30),
  };

  /* ────────────── Mount API ──────────────── */
  function autoFit(host) {
    const screen = host.querySelector('.cwm-screen');
    if (!screen) return;
    const apply = () => {
      // Fit-by-width: host becomes a perfect square sized to its width,
      // screen scales 480 -> host.clientWidth, pinned to top-left.
      const w = host.clientWidth;
      if (!w) return;
      const scale = w / 480;
      screen.style.setProperty('--cwm-scale', scale);
      host.style.height = w + 'px';
    };
    apply();
    new ResizeObserver(apply).observe(host);
  }

  function mountAll() {
    document.querySelectorAll('[data-cwm-screen]').forEach(host => {
      const key = host.getAttribute('data-cwm-screen');
      const html = presets[key] ? presets[key]() : `<div style="color:#f00">Unknown screen: ${key}</div>`;
      host.innerHTML = `<div class="cwm-screen-fit">${html}</div>`;
      autoFit(host);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }

  window.CWM = { mount: mountAll, presets };
})();
