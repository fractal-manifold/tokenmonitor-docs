# TokenMonitor — public website (notes for AI assistants)

You are working inside the **public** marketing + docs site for the
TokenMonitor product. The firmware repo is private; this is
the only public surface. Everything you write here is visible to
end users.

## What this site is

A landing + tutorial site for a 4-inch ESP32-S3 **desk display**
that shows live usage of Claude Code, Codex CLI and the Antigravity CLI on
the user's laptop. The device is 86×86 mm (the original "wall
switch box" form factor) but the current product positioning is
desk-top: USB-C powered, sits on the desk with its own base.
"TokenMonitor" stays as the brand name; copy should describe the
use as desk-mounted, not wall-mounted.

## Language

**All site content must be in English.** Even though the product
notes and the rest of the repo are in Spanish, the website ships to
an international audience and is English-only.

## Tone & visual direction

- Premium hardware product feel — **not** a docs site. References:
  Tidbyt, Daylight Computer, Framework.
- Palette: dark mode primary, accent gradients per provider:
  - Claude — warm orange / red
  - Codex — green
  - Antigravity — blue (accent #3186FF day / #5A9BFF night)
- Reuse the pixel-exact UI mockups from
  `../docs/tokenmonitor-design.html` — 8 screen states already
  designed (Dashboard day/night per provider, Standby, Connecting,
  Saving, Needs Config / pairing, Provisioning, Settings, Settings
  editor). Render inside a round-cornered 480×480 device frame.
- Hero product shot: `../docs/images/prototype.jpg` (2000×2000 real
  unit on wall).

## Site map

```
/                Landing
/how-it-works    Architecture + data flow
/setup           Tutorial — 5 steps with screenshots
/usage           Day-to-day usage guide
/plugin          MCP plugin install (3 CLIs) + skill & MCP-tool reference
                 (the old standalone /skills page was merged in here, anchor
                 #skills; skills.html was deleted, no redirect)
/faq             Troubleshooting + FAQ
```

## Page-by-page content

### 1. Landing (`/`)

**Hero**
- Headline: **"See your AI usage on your desk."**
- Sub: "A 4-inch always-on desk display that shows live Claude
  Code, Codex and Antigravity usage from your laptop. 86×86 mm
  footprint, USB-C powered, sits on the desk with its own base."
- Primary CTA: **Back it on Kickstarter** (see *Campaign CTAs* below)
- Secondary CTA: **How it works → /how-it-works**
- Visual: `prototype.jpg` on the right, or a device frame cycling
  through the three providers' day-mode dashboards.

**Feature grid (3 cols)**
1. **Three providers, one panel** — Claude · Codex · Antigravity,
   brand-tinted day & night themes.
2. **Works on your LAN** — No cloud, no telemetry. Device polls
   your laptop directly over Wi-Fi.
3. **Quiet ambient design** — Standby after 20 min, ambient
   weather strip, four hysteresis-armed alerts.

**Spec strip**
ESP32-S3 · 16 MB Flash · 8 MB PSRAM · 480×480 capacitive touch ·
2.4 GHz Wi-Fi · 86×86 mm

**"How it works" preview** — 3-step diagram:
`Laptop (tokenmonitor-mcp broker) → Wi-Fi LAN → Wall device`

**Closing CTA** — the Kickstarter band (`#kickstarter`), then a small
"Already have a unit? → /setup" line for existing owners.

### Campaign CTAs (read before touching any button)

Every primary CTA on the site — header, hero, theme-lab mid-page, the
landing band, how-it-works, FAQ — points at the **Kickstarter campaign**,
never at a form or a waitlist. The URL and button label live in
`src/consts.ts` (`KICKSTARTER_URL`, `KICKSTARTER_CTA`); import them rather
than hard-coding.

The campaign is **live** (since 2026-08-06): its page accepts pledges, so
copy says *back it / pledge* and never *follow* or *get notified at launch*.
`src/consts.ts` carries the end-of-campaign checklist of every place the
live wording lives — that same checklist, in its prelaunch form, is what
flipped the site on launch day.

Price anchor: **Super Early Bird €99, first 50 backers, excl. shipping &
tax** — the only price the site states. Kickstarter owns the rest of the
tier ladder, shipping rates and delivery dates; don't restate them here,
and never invent a delivery window (the campaign states none). Shipping is
**US, Canada, EU and UK only** — not "worldwide".

A dismissible announce bar (`src/components/AnnounceBar.astro`) sits above
the fixed header on every page. Its height feeds `--announce-h`; anything
that must clear the fixed chrome reads `--chrome-h` (see `global.css`)
instead of hard-coding pixels.

**Conversion tracking.** Two independent mechanisms, don't confuse them:
- Kickstarter's own `?ref=81tzx4` token on `KICKSTARTER_URL` — attributes the
  referral on Kickstarter's side. Keep it on the URL.
- The **Reddit Ads pixel** (`src/components/RedditPixel.astro`, rendered in
  `<head>` by the layout, so every page) — fires `PageVisit` on load and
  `REDDIT_CTA_EVENT` on any click through to a `kickstarter.com` host. The CTA
  hook is one delegated listener matching on hostname, *not* an `onclick` per
  button, so new CTAs are tracked automatically — don't add per-button
  handlers. The event stays **`Lead`** now that the campaign is live too — the
  click is an outbound referral and the pledge completes on Kickstarter, out of
  the pixel's sight, so a click through to Kickstarter is not a `Purchase`.
  Revisit only if the site ever hosts a real checkout. The pixel id is public
  by design; it is not a secret.

Two caveats a future editor needs. **(1)** The pixel currently loads
unconditionally, with no consent gate, on a site that ships to the EU and UK —
that is GDPR/ePrivacy exposure the owner accepted knowingly; if a banner ever
lands, gate the `rdt('init')` call on it. **(2)** The site's "no telemetry, no
analytics" copy (index, how-it-works, FAQ) is scoped to the **broker and
device**, which remain analytics-free — the pixel does not contradict it. Keep
that scoping precise when editing those lines, and don't widen them into a
claim about the website itself.

### 2. How it works (`/how-it-works`)

Architecture diagram (Mermaid is fine):
- Laptop (Claude Code / Codex / Antigravity) → `tokenmonitor-mcp` broker
  (Go / Python / JS, user's choice) → HTTP + HMAC over LAN →
  ESP32-S3 device.
- Side branch: device → Open-Meteo (weather + day/night) over
  internet.

Key properties:
- No cloud account required for the device itself.
- HMAC-SHA256 auth + AES-CTR payload encryption between broker and
  device.
- PSK derived from a memorable passphrase chosen at setup.
- Per-device control plane: rotate keys, switch theme, change
  settings — all from your AI client. (On firmware 1.0.1+ there is no
  broker URL to manage — the device finds its broker by mDNS; older
  units keep a pinned address the broker can re-point.)

### 3. Setup tutorial (`/setup`) — the main tutorial page

5 steps, each with mockup screenshot from
`../docs/tokenmonitor-design.html`.

**Step 1 — Install the broker on your laptop**

```bash
# Pick one
go install github.com/fractal-manifold/tokenmonitor-mcp/cmd/tokenmonitor-mcp@latest
pipx install tokenmonitor-mcp-py
npm install -g tokenmonitor-mcp-js

# Then the launcher shim (one-time)
curl -fsSL https://github.com/fractal-manifold/tokenmonitor-mcp/raw/main/tokenmonitor-mcp-launcher/install.sh | sh
```

**Step 2 — Power the device**
USB-C, 5 V / 1 A. First boot → *Needs Config* screen showing IP +
6-digit pairing code. → mockup **5 · Needs Config (pairing)**.

**Step 3 — Give it Wi-Fi (three routes, all live at once)**
The first screen is a selector, not a single instruction. Use the device's
own card labels verbatim — they are what the user is looking at:
- **Join the setup WiFi** — SoftAP `TokenMonitor-XXXX`, **WPA2** (password on
  the device's screen; derived from its MAC, so it keeps neighbours out but is
  not a secret — never say "open network"). Browser auto-opens
  `192.168.4.1`. Form: Wi-Fi SSID + password **only** (no city, no URL,
  no passphrase — those come later).
- **Enter WiFi here** — scan + on-screen keyboard, no phone needed. Same
  picker component Settings opens later to change networks.
- **Set up over USB** — no code to read or type; `/tokenmonitor:configure`
  pushes Wi-Fi + key in one go, collapsing steps 3 and 4. The
  6-digit code gates the LAN path only. Linux and macOS hosts for now.

Rendered as a three-column grid, each column led by the detail screen that
card opens: `provisioning-softap`, `provisioning-picker`, `provisioning-usb`
(the selector itself is `provisioning`, used in step 2). The selector cards
carry a number and a name and **nothing else** — no SSID, no "no code needed"
status line. That is deliberate in the firmware and the mock mirrors it; don't
re-add status to the chooser.

Whichever route: device reboots once into "Waiting for setup" — except USB,
which already carried the key: on firmware 1.0.0+ it discovers the broker by mDNS (one more
short restart once found) and goes on to the dashboard, no code to type;
older firmware is sent the broker address over the cable too.

**Step 4 — Pair from Claude Code** *(the magic moment)*
- Install plugin (see /plugin).
- In Claude Code: `/tokenmonitor:configure`.
- Claude discovers the device via mDNS, asks for the 6-digit code,
  generates the PSK, pushes it. Device reboots.
→ mockup **6 · Provisioning**.

**Step 5 — You're done**
Device lands on the dashboard. Live usage flows within ~60 s.
→ mockup **1 · Dashboard — Claude day**.

### 4. Usage (`/usage`)

Each section with the matching mockup:
- **Dashboard** — 5-h session window, monthly limit, week's
  average, ambient weather strip, last-sync indicator. (mockup 1)
- **Standby** — 20 min idle → backlight 0 %, last values + ambient
  strip remain. Tap anywhere to wake. (mockup 2)
- **Settings** — tap the gear (bottom-right of the dashboard) to open.
  Editable: city, Wi-Fi, Service URL (auto-discovered on firmware 1.0.1+; a pin on older units), passphrase, day brightness, night brightness,
  alert volume. (mockups 7 + 8)
- **Alerts** — 4 events:
  1. Battery < 20 % — red label + chirp
  2. Battery < 10 % — icon/label blink + descending double-beep
     (only alert that also rings in Standby)
  3. Limit window predicted to overshoot 100 % — triple chirp
  4. 5-h session window rollover — ascending C-major arpeggio
- **Themes** — Day / Night / Auto. Auto follows sunrise/sunset for
  your city, ±90 s hysteresis. Switch with
  `/tokenmonitor:theme day|night|auto`.

### 5. Plugin install (`/plugin`)

**Two levels of tabs — keep them.** Level 1 is a *segmented control* (one
bordered track, three equal segments, brand-tinted active fill, caret dropping
into the panel), one segment per CLI. It replaced a 3-column grid of hover-lift
cards that read as three nav cards rather than one switcher — don't reintroduce
card styling, the hover lift, or a mobile rule that stacks the track into
full-width blocks. Level 2, inside each panel, is a smaller **Terminal /
Desktop app** switcher. **Antigravity renders no level-2 bar at all** (a static
"Terminal only" tag instead) — it has no desktop app, and a disabled segment
would imply one exists. Both levels are ARIA tablists with ←/→ keys; deep links
are `#codex`, `#codex-desktop`, …

**Claude Code**
```text
/plugin marketplace add fractal-manifold/mcp-marketplace
/plugin install tokenmonitor@fractalmanifold-mcp-marketplace
```

**Codex CLI** — first-class plugin/marketplace support; the CLI gets the **full
plugin, skills included**. These are *shell* commands, not slash commands
(verified against `codex-cli` 0.146.0):
```bash
codex plugin marketplace add fractal-manifold/mcp-marketplace
codex plugin add tokenmonitor@fractalmanifold-mcp-marketplace
```
Then **start a new Codex thread** (skills + MCP servers load at thread start);
verify with `codex plugin list`. Remove with `codex plugin remove
tokenmonitor@fractalmanifold-mcp-marketplace`. Files cache under
`~/.codex/plugins/cache/fractalmanifold-mcp-marketplace/tokenmonitor/<version>/`;
installing writes the marketplace source + an `enabled` flag to
`~/.codex/config.toml` (later use adds more keys there, so don't say "only").

**Updating takes two commands, not one** — `marketplace upgrade` refreshes the
Git snapshot but leaves the cached plugin at its old version, so the install
must be re-run:
```bash
codex plugin marketplace upgrade fractalmanifold-mcp-marketplace
codex plugin add tokenmonitor@fractalmanifold-mcp-marketplace
```

Do **not** document `codex mcp add … "$(command -v tokenmonitor-mcp)"` — the
page said that for a while and it is broken: nothing installs a standalone
`tokenmonitor-mcp` on `PATH` (the plugin bundles its own server), so the entry
gets an empty command. It also skips the four skills and drops the manifest's
60 s first-start allowance. Don't quote a number for the fallback timeout —
the CLI reports it as `null`, so it isn't verified. Don't claim the CLI has no
`/plugin`-style TUI command either; that couldn't be verified. Just document
the shell route.

**Antigravity CLI** (`agy`, successor to the Gemini CLI) — installs
from a GitHub subpath into `~/.gemini/config/plugins/`. Subcommand is
`plugin` (NOT `extensions`), and the target must be the full
`https://github.com/…` URL — a bare `owner/repo` shorthand is rejected:
```bash
agy plugin install https://github.com/fractal-manifold/mcp-marketplace/plugins/tokenmonitor
```

The install is self-contained: it copies the whole plugin, including
the bundled `server/` launcher. The `gemini-extension.json` it writes
points at that launcher (do NOT document a global-PATH `tokenmonitor-mcp`
+ `args:["mcp"]` — that's the old model):
```json
{
  "name": "tokenmonitor",
  "version": "1.0.2",
  "mcpServers": {
    "tokenmonitor": {
      "command": "sh",
      "args": ["${extensionPath}/server/tokenmonitor-mcp"]
    }
  }
}
```

**Verify** — ask the model: *"What's the status of my TokenMonitor
broker?"* — it should call `tokenmonitor_status` and return broker
role + request count. On `"no working implementation found"`, run
`tokenmonitor-mcp --probe` to see which runtime got picked.

### 6. Skills + tools reference (`/skills`)

**`/tokenmonitor:configure`** — Pair a new device or reconfigure an
existing one, over the LAN or a USB cable. LAN: discovers via mDNS and
prompts for the 6-digit pairing code. USB: no code, and it can change
Wi-Fi without a factory reset. A first pairing generates a PSK and registers the device locally; known
devices keep their key, and settings-only changes leave the pairing alone. Firmware 1.0.0+ discovers the broker address by mDNS;
for older units the skill pushes it with the key. Use when a new device shows "Waiting for setup".

**`/tokenmonitor:settings`** — Remotely change any setting the on-device
Settings panel exposes (city, brightness, volume, providers, rotation,
theme, pet, custom panel, passphrase). No broker-URL setting on firmware
1.0.1+; for older units it can re-point the device to the same broker at a
new address.

**`/tokenmonitor:theme`** — Switch a device between Day / Night /
Auto remotely. Auto follows sunrise/sunset for the configured
city. Usage: `/tokenmonitor:theme <day|night|auto> [--device <device_id>]`.

**`/tokenmonitor:firmware`** — Build signed firmware with `make build-prod`
and stage it as an OTA: dev channel first (canary on revertible test
units), then stable.

**MCP tools** the model can call directly:

| Tool                          | What it does                                                       |
|-------------------------------|--------------------------------------------------------------------|
| `tokenmonitor_status`         | Broker role (leader/follower), last ESP32 request, request count. |
| `tokenmonitor_health`         | PASS/FAIL diagnostic per component (creds, self-ping, traffic).    |
| `tokenmonitor_recent_logs`    | Tail of the shared broker daemon log.                              |
| `tokenmonitor_provision_hint` | Laptop LAN URLs the broker answers on (diagnostic; seeded automatically for pre-1.0.0 firmware). |

The plugin exposes 17 tools in total (see the plugin README); these four are
the ones a user reaches for directly.

### 7. FAQ (`/faq`)

**General**
- Do I need a Claude / OpenAI / Google account? — Yes, for the CLI
  side. The device itself never calls those APIs.
- Where is my passphrase stored? — NVS on the device and on the
  broker, encrypted at rest, never sent in clear. The derived PSK
  is used for HMAC + AES-CTR on the broker link.
- Offline? — LAN traffic with the broker, yes. Needs internet for
  SNTP and Open-Meteo (weather + sunrise/sunset).
- Multiple devices in one house? — Yes. Each has an 8-hex
  `device_id` and mDNS hostname `tmon-<device_id>`.
- 5 GHz Wi-Fi? — No. ESP32-S3 is 2.4 GHz only.
- Can I modify the firmware? — Firmware is proprietary; only the
  docs are public.

**Troubleshooting**
- Screen black — check USB-C cable, 5 V / 1 A adapter, remember
  Standby zeroes the backlight.
- `boot:0x1 (DOWNLOAD)` — BOOT button held at reset. Release it.
- Captive portal not appearing — only shown when NVS is empty.
  Reset from Settings.
- Data stale (orange clock) — multiple polls failed. Check Wi-Fi,
  firewall, and that the broker is running on the same LAN.
- Audio silent — check volume in Settings. PA is gated by a
  TCA9554 expander; a reboot recovers it.
- Weather absurd — geocoding failed. Re-enter the city; the
  cached lat/lon is cleared automatically.
- Auto theme stuck on Night — SNTP hasn't synced. Reboot once the
  network is stable.

## Assets

- `../docs/images/prototype.jpg` — real-unit hero shot (2000×2000).
- `../docs/tokenmonitor-design.html` — all UI screens pixel-exact.
  Open in a browser and screenshot / export each `<section>`.
- Provider + UI icons are already recreated as crisp, device-matched
  SVG inside `assets/device-screens.js` (Claude pixel-mascot, Codex `>_`
  app icon, Antigravity glyph, ambient sun/moon/thermo, gear, pencil,
  level-coloured battery). The Fractal Manifold mark is the exception:
  it's the real brand logo (`assets/logo.png`), trimmed/squared and
  inlined as a 112px data URI in `_fmLogoSrc` — edit that constant (or
  re-derive it from `logo.png`) rather than drawing a new SVG. The
  on-device icon originals live as LVGL C arrays under
  `../firmware/components/ui/src/assets/logos/` (not web-friendly) — edit
  the SVG helpers in `device-screens.js`, don't pull the C arrays.

## Tech constraints

- Static site. Deploys to GitHub Pages on
  `fractal-manifold/tokenmonitor-docs`, base path
  `/tokenmonitor-docs`.
- Wired up as a submodule at `website/` in the main repo.
- Existing Astro/Starlight scaffolding can be wiped if you build
  with something else (Next.js static export, Astro vanilla, plain
  Vite + React, etc.). **Keep** `.github/workflows/deploy.yml` and
  the GitHub Pages action — they're already configured and the
  Pages source is set to "GitHub Actions".

## Things NOT to do

- Don't claim the device "uses your API key" — it doesn't. It
  reads usage from your local Claude Code / Codex / Antigravity session
  via the broker.
- Don't put the user's passphrase or PSK anywhere on the site.
  This is a security-sensitive product; secrets stay local.
- Don't promise iOS / Android companion apps. There are none.
- OTA firmware updates **are** a real, shipped feature and may be
  promoted: Ed25519-signed manifest, verified on-device before the
  boot-slot switch, automatic rollback, anti-rollback floor, staged
  over the LAN via the broker (`/tokenmonitor:firmware`). (This
  reverses earlier guidance — OTA is now a longevity selling point.)
- Don't link to the private firmware repo
  (`fractal-manifold/tokenmonitor`). Public-facing links go
  to `fractal-manifold/tokenmonitor-mcp` and
  `fractal-manifold/mcp-marketplace`.

## Source-of-truth facts (verified against firmware + broker — do not regress)

These were corrected sitewide after a source audit. Earlier copy got
several of them wrong; keep them right.

- **License**: broker `tokenmonitor-mcp` + plugin are **MIT**.
- **Broker port**: device-facing HTTP on **`8765`**, LAN-reachable
  (the configure skill rejects a loopback-only bind). Not `9787`,
  not `127.0.0.1`-only.
- **Broker config**: `~/.config/tokenmonitor/tokenmonitor.toml`, with
  per-device keys in `…/devices/` as `0600` files (filesystem perms,
  **not** an OS keychain). Not `~/.cwm/devices.json`.
- **Auth headers**: `X-Tmon-Timestamp` / `X-Tmon-Nonce` /
  `X-Tmon-Signature` — HMAC-SHA256 over method+path+timestamp+nonce
  +device+version (**signed headers, not the body, not responses**).
  Replay window 60 s. Not `X-CWM-HMAC`, not 30 s.
- **Encryption**: only the AES-256-CTR **pending-config blob** (key
  rotation / settings) is encrypted. Don't claim the whole wire is
  confidential.
- **device_id**: last 4 **bytes** of MAC = 8 hex; mDNS
  `cwm-<8hex>.local`. Not "last 4 hex".
- **Data**: % is provider-reported quota (live, ~90 s); tokens are
  local from CLI logs; $ is an **estimate** (list prices, not money
  billed — notional on subscriptions).
- **OTA trigger skill**: `/tokenmonitor:firmware` (not `:update`).

## Claims we will NOT make (honest-by-design; this audience checks)

- ❌ "zero / no security risk" — the broker runs with your
  permissions and reads your logs; say what it does/doesn't touch.
- ❌ "nothing leaves your machine" / "LAN-only, no cloud" — the
  **device** is LAN-only, but the **broker** calls provider usage
  APIs (with your existing CLI login), a price list and GitHub.
- ❌ "the wire is fully encrypted" — only the config blob is.
- ❌ "it never reads your code/prompts" — it parses token fields out
  of logs; say it isn't built to read/transmit their contents and is
  open-source so you can verify.
- ❌ "updates in <3 s / live" — % ~90 s, spend ~300 s.

## Public links to use

- Kickstarter campaign (every CTA target) — keep the `?ref=` tracking token:
  `https://www.kickstarter.com/projects/jorgemf/token-monitor-see-your-ai-usage-on-your-desk?ref=81tzx4`
- Broker + MCP server: `https://github.com/fractal-manifold/tokenmonitor-mcp`
- Marketplace (plugin source): `https://github.com/fractal-manifold/mcp-marketplace` → `plugins/tokenmonitor/`
- This site's repo: `https://github.com/fractal-manifold/tokenmonitor-docs`
