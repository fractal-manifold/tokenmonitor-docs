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
- Primary CTA: **Get setup → /setup**
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

**Closing CTA** — "Plug it in. Pair it from Claude Code. Done."
→ /setup

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
  broker URL — all from Claude Code.

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

**Step 3 — Connect to its captive portal**
- SSID `TokenMonitor-XXXX`, open.
- Browser auto-opens `192.168.4.1`.
- Form: Wi-Fi SSID + password, city.
- Submit → device reboots into "Waiting for setup".

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
- **Settings** — long-press the mascot to open. Editable: city,
  Wi-Fi, broker URL, passphrase, day brightness, night brightness,
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

Three tabs (or stacked cards) — one per CLI.

**Claude Code**
```text
/plugin marketplace add fractal-manifold/mcp-marketplace
/plugin install tokenmonitor
```

**Codex CLI** — reads `~/.codex/config.toml`:
```toml
[mcp_servers.tokenmonitor]
command = "tokenmonitor-mcp"
args = ["mcp"]
```

**Antigravity CLI** (`agy`, successor to the Gemini CLI) — reads
`~/.gemini/antigravity-cli/extensions/`:
```bash
agy extensions install fractal-manifold/mcp-marketplace/plugins/tokenmonitor
```

Extension JSON (same shape for all three):
```json
{
  "name": "tokenmonitor",
  "version": "0.4.0",
  "description": "Registers tokenmonitor-mcp, the local broker for the TokenMonitor ESP32 device.",
  "mcpServers": {
    "tokenmonitor": {
      "command": "tokenmonitor-mcp",
      "args": ["mcp"]
    }
  }
}
```

**Verify** — ask the model: *"What's the status of my TokenMonitor
broker?"* — it should call `tokenmonitor_status` and return broker
role + request count. On `"no working implementation found"`, run
`tokenmonitor-mcp --probe` to see which runtime got picked.

### 6. Skills + tools reference (`/skills`)

**`/tokenmonitor:configure`** — Provision or reconfigure a device
from the LAN. Discovers via mDNS, prompts for the 6-digit pairing
code, pushes broker URL + auto-generated PSK, registers the device
locally. Use when a new device shows "Waiting for setup".

**`/tokenmonitor:theme`** — Switch a device between Day / Night /
Auto remotely. Auto follows sunrise/sunset for the configured
city. Usage: `/tokenmonitor:theme <day|night|auto> [--device <device_id>]`.

**MCP tools** the model can call directly:

| Tool                          | What it does                                                       |
|-------------------------------|--------------------------------------------------------------------|
| `tokenmonitor_status`         | Broker role (leader/follower), last ESP32 request, request count. |
| `tokenmonitor_health`         | PASS/FAIL diagnostic per component (creds, self-ping, traffic).    |
| `tokenmonitor_recent_logs`    | In-memory tail of the broker log.                                  |
| `tokenmonitor_provision_hint` | Laptop LAN URLs ready to type into the portal.                     |

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
  firewall, broker URL.
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

- **License**: broker `tokenmonitor-mcp` + plugin are **Apache-2.0** (not MIT).
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

- Broker + MCP server: `https://github.com/fractal-manifold/tokenmonitor-mcp`
- Marketplace (plugin source): `https://github.com/fractal-manifold/mcp-marketplace` → `plugins/tokenmonitor/`
- This site's repo: `https://github.com/fractal-manifold/tokenmonitor-docs`
