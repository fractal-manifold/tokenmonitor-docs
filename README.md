# TokenMonitor — public site

Public landing + tutorial site for the TokenMonitor ESP32
wall display. Source for <https://fractal-manifold.github.io/tokenmonitor-docs/>.

## Stack

Static HTML + CSS + JS — no build step.

## Local preview

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Any static file server works (`npx serve`, `caddy file-server`, etc.).

## Structure

```
index.html          Landing
how-it-works.html
setup.html          5-step tutorial
usage.html
plugin.html         Per-CLI install (Claude / Codex / Gemini) + skills & MCP-tool reference (#skills)
faq.html

assets/
  site.css          Main stylesheet
  site.js           Theme toggle + page interactions
  fm-tokens.css     Fractalmanifold design tokens (palette, typography)
  device-screens.js Renders the 480×480 device mockups
  logo.png, logo2.png
  prototype.jpg     Hero product shot (1200×1200, also og:image)
```

## Deploy

Push to `main` → GitHub Actions stages the static files into `_site/`
and publishes via `actions/deploy-pages`. Workflow:
`.github/workflows/deploy.yml`.

## Editing content

See `CLAUDE.md` and `BRIEF.md` in this directory for the product
brief, page-by-page content guidelines and rules of what NOT to
publish (proprietary firmware repo, secrets, etc.).

## Relationship with the firmware repo

This repo is public and is mounted as a submodule at `website/`
inside the private firmware repo (`fractal-manifold/tokenmonitor`).
The firmware itself stays private; only the user-facing site lives
here.

## License

Documentation © Fractal Manifold S.L. — all rights reserved.
