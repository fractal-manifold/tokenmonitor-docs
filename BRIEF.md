# Brief — Claude Wall Monitor marketing + docs site

> Hand this brief to Claude Design (or any designer) to rebuild the
> public site from scratch. The current Astro/Starlight scaffold in
> this repo can be wiped — only keep `.github/workflows/deploy.yml`
> and the GitHub Pages config.

## Goal

Public English-language landing + tutorial site for a 4-inch
ESP32-S3 wall display that shows live usage of Claude Code, Codex
CLI and Gemini CLI on the user's laptop. Designed to fit a standard
86×86 mm wall switch box.

**The site must be in English.** (The product is sold internationally.)

## Tone & visual direction

- **Premium hardware product feel**, not a docs site. References:
  Tidbyt, Daylight Computer, Framework landing pages.
- Palette: dark mode primary, with accent gradients per provider:
  - Claude — warm orange / red
  - Codex — green
  - Gemini — blue / purple
- Reuse the pixel-exact dashboard mockups from
  `docs/design/cwm-redesign.html` (8 screen states already designed:
  Dashboard day/night for each provider, Standby, Connecting,
  Saving, Needs Config / pairing, Provisioning, Settings, Settings
  editor). Render them inside a device frame (round-cornered 480×480
  square).
- Hero product shot: use `docs/images/prototype.jpg` (2000×2000 real
  unit on wall) for the landing fold.

## Site map

```
/                           Landing
/how-it-works               Architecture diagram + data flow
/setup                      Tutorial (5 steps with screenshots)
/usage                      Day-to-day usage guide
/plugin                     MCP plugin install (Claude Code, Codex, Gemini)
/skills                     Skill reference (/cwallmonitor:configure, /cwallmonitor:theme)
/faq                        Troubleshooting + FAQ
```

## 1. Landing (`/`)

**Hero**

- Headline: **"See your AI usage on the wall."**
- Sub: "A 4-inch always-on display that shows live Claude Code,
  Codex and Gemini usage from your laptop. Fits a standard wall
  switch box."
- CTA primary: **Get setup → /setup**
- CTA secondary: **How it works → /how-it-works**
- Visual: `prototype.jpg` on the right, or a device frame cycling
  through the three providers' day-mode dashboards.

**Feature grid (3 cols)**

1. **Three providers, one panel** — Claude · Codex · Gemini,
   brand-tinted day & night themes. (Dashboard mockups)
2. **Works on your LAN** — No cloud, no telemetry. The device polls
   your laptop directly over Wi-Fi. (architecture micro-diagram)
3. **Quiet ambient design** — Standby after 20 min, ambient weather
   strip, four hysteresis-armed alerts (low battery, limit
   overshoot, session rollover).

**Spec strip**

ESP32-S3 · 16 MB Flash · 8 MB PSRAM · 480×480 capacitive touch ·
2.4 GHz Wi-Fi · 86×86 mm

**"How it works" preview** — 3-step diagram:

`Laptop (cwm-mcp broker)  →  Wi-Fi LAN  →  Wall device`

**Closing CTA** — "Plug it in. Pair it from Claude Code. Done."
→ /setup

## 2. How it works (`/how-it-works`)

Architecture diagram (Mermaid is fine):

- Laptop running Claude Code / Codex / Gemini → `cwm-mcp` broker
  (Go / Python / JS, your choice) → HTTP + HMAC over LAN →
  ESP32-S3 device.
- Side branch: device → Open-Meteo (weather + day/night) over
  internet.

Bullet list of key properties:

- No cloud account required for the device itself.
- HMAC-SHA256 auth + AES-CTR payload encryption between broker and
  device.
- PSK derived from a memorable passphrase you choose at setup.
- Per-device control plane: rotate keys, switch theme, change
  broker URL — all from Claude Code.

## 3. Setup tutorial (`/setup`) — **the main tutorial page**

5 steps, each with screenshot. Use the mockups in
`docs/design/cwm-redesign.html`, cropped to the relevant screen.

### Step 1 — Install the broker on your laptop

```bash
# Pick one
go install github.com/fractal-manifold/cwm-mcp/cmd/cwm-mcp@latest
pipx install cwm-mcp-py
npm install -g cwm-mcp-js

# Then the launcher shim (one-time)
curl -fsSL https://github.com/fractal-manifold/cwm-mcp/raw/main/cwm-mcp-launcher/install.sh | sh
```

### Step 2 — Power the device

USB-C, 5 V / 1 A. First boot lands on the *Connecting / Needs
Config* screen.
→ Show mockup **5 · Needs Config (pairing)** with the IP +
6-digit pairing code visible.

### Step 3 — Connect to its captive portal

- Device exposes Wi-Fi SSID `ClaudeWallMonitor-XXXX`, open.
- Browser auto-opens `192.168.4.1`.
- Form: Wi-Fi SSID + password, city.
- Submit → device reboots into "Waiting for setup".
→ Designer to draw minimal captive-portal screenshot.

### Step 4 — Pair from Claude Code *(the magic moment)*

- Install plugin (see /plugin page).
- In Claude Code: `/cwallmonitor:configure`
- Claude discovers the device via mDNS, asks you for the 6-digit
  code shown on the screen, generates the PSK, pushes it. Device
  reboots.
→ Show mockup **6 · Provisioning**.

### Step 5 — You're done

- Device lands on the dashboard.
→ Show mockup **1 · Dashboard — Claude day**.
- Live usage starts flowing within ~60 s.

## 4. Usage (`/usage`)

Each section paired with the relevant mockup:

- **Dashboard** — what each number means: 5-hour session window,
  monthly limit, week's average, ambient weather strip, last-sync
  indicator. (mockup 1)
- **Standby** — 20 min idle → backlight 0 %, last values + ambient
  strip remain. Tap anywhere to wake. (mockup 2)
- **Settings** — long-press the mascot to open. Editable fields:
  city, Wi-Fi, broker URL, passphrase, day brightness, night
  brightness, alert volume. (mockups 7 + 8)
- **Alerts** — 4 events:
  1. Battery < 20 % — red label + chirp
  2. Battery < 10 % — icon/label blink + descending double-beep
     (only alert that also rings in Standby)
  3. Limit window predicted to overshoot 100 % — triple chirp
  4. 5-h session window rollover — ascending C-major arpeggio
- **Themes** — Day / Night / Auto. Auto follows sunrise/sunset for
  your configured city, with ±90 s hysteresis. Switch from Claude
  Code with `/cwallmonitor:theme day|night|auto`.

## 5. Plugin install (`/plugin`) — per-CLI instructions

Three tabs (or stacked cards):

### Claude Code

```text
/plugin marketplace add fractal-manifold/mcp-marketplace
/plugin install cwallmonitor
```

### Codex CLI

Codex reads MCP servers from `~/.codex/config.toml`. Add:

```toml
[mcp_servers.cwallmonitor]
command = "cwm-mcp"
args = ["mcp"]
```

### Gemini CLI

Gemini reads extensions from `~/.gemini/extensions/`. Either drop
in the `gemini-extension.json` from the plugin repo, or:

```bash
gemini extensions install fractal-manifold/mcp-marketplace/plugins/cwallmonitor
```

The extension JSON is identical across CLIs:

```json
{
  "name": "cwallmonitor",
  "version": "0.4.0",
  "description": "Registers cwm-mcp, the local broker for the C Wall Monitor ESP32 device.",
  "mcpServers": {
    "cwallmonitor": {
      "command": "cwm-mcp",
      "args": ["mcp"]
    }
  }
}
```

### Verify

Common to all three CLIs — ask the model:
> *"What's the status of my wall monitor broker?"*

It should call `wall_monitor_status` and return broker role +
request count. If it errors with *"no working implementation
found"*, run `cwm-mcp --probe` in a terminal — the stderr output
identifies which runtime got picked or which install hint applies.

## 6. Skills reference (`/skills`)

Two cards, pulled from the SKILL.md frontmatter under
`mcp-marketplace/plugins/cwallmonitor/skills/`:

### `/cwallmonitor:configure`

Provision or reconfigure a device from the LAN. Discovers via
mDNS, prompts for the 6-digit pairing code, pushes broker URL +
auto-generated PSK, registers the device locally.

**Use when**: user has a new device showing "Waiting for setup",
or wants to re-pair an existing one.

### `/cwallmonitor:theme`

Switch a device between Day / Night / Auto themes remotely. Auto
follows sunrise/sunset for the configured city.

**Usage**: `/cwallmonitor:theme <day|night|auto> [--device <device_id>]`

### MCP tools the model can call directly

| Tool                          | What it does                                                       |
|-------------------------------|--------------------------------------------------------------------|
| `wall_monitor_status`         | Broker role (leader/follower), last ESP32 request, request count. |
| `wall_monitor_health`         | PASS/FAIL diagnostic per component (creds, self-ping, traffic).    |
| `wall_monitor_recent_logs`    | In-memory tail of the broker log.                                  |
| `wall_monitor_provision_hint` | Suggests laptop LAN URLs to type into the captive portal.          |

## 7. FAQ (`/faq`)

Translate the existing Spanish FAQ + troubleshooting pages to
English. Key entries:

**General**

- Do I need an Anthropic / OpenAI / Google account? — Yes, for the
  CLI side. The device itself never calls those APIs.
- Where is my passphrase stored? — NVS on the device and on the
  broker; encrypted at rest, never sent in clear. The derived PSK
  is used for HMAC + AES-CTR.
- Does it work offline? — LAN traffic with the broker, yes. Needs
  internet for SNTP (time) and Open-Meteo (weather, sunrise/sunset).
- Multiple devices in the same house? — Yes. Each has its own
  8-hex `device_id` and mDNS hostname `cwm-<device_id>`.
- 5 GHz Wi-Fi? — No. ESP32-S3 is 2.4 GHz only.
- Can I modify the firmware? — Firmware is proprietary; only the
  docs are public.

**Troubleshooting**

- Screen doesn't turn on — check USB-C cable, adapter (5 V / 1 A),
  remember Standby zeroes the backlight.
- `boot:0x1 (DOWNLOAD)` in the log — BOOT button held at reset.
  Release it.
- Captive portal not appearing — only shown when NVS is empty.
  Reset from Settings.
- Data stale (orange clock) — multiple polls failing. Check Wi-Fi,
  firewall, broker URL.
- Audio silent — verify volume in Settings; the PA is gated by a
  TCA9554 expander pin, a reboot recovers it.
- Weather absurd — geocoding failed. Re-enter the city; lat/lon
  cache is cleared automatically.
- Auto theme stuck on Night — SNTP hasn't synced yet. Reboot when
  the network is stable.

## Assets available

- `docs/images/prototype.jpg` — real-unit hero shot (2000×2000)
- `docs/design/cwm-redesign.html` — all UI screens pixel-exact
  (480×480 each). Open in a browser and screenshot / export each
  `<section>`.
- Provider logos (Claude / Codex / Gemini) exist as LVGL C arrays
  under `firmware/components/ui/src/assets/logos/`. Designer should
  recreate from the brand kits — the C arrays aren't web-friendly.

## Tech constraints

- Static site, deploys to GitHub Pages on
  `fractal-manifold/c-wall-monitor-docs`, base path
  `/c-wall-monitor-docs`.
- Already wired up as a submodule at `website/` in the main repo.
- Existing Astro/Starlight scaffolding can be wiped — only keep
  `.github/workflows/deploy.yml` and the `gh-pages` config.

## Links

- Firmware repo (private): `fractal-manifold/claude-wall-monitor`
- Broker + MCP server: `fractal-manifold/cwm-mcp`
- Marketplace (the plugin lives here):
  `fractal-manifold/mcp-marketplace` → `plugins/cwallmonitor/`
- This site's repo: `fractal-manifold/c-wall-monitor-docs`
