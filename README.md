# Mactimize Website

Official marketing website for **Mactimize** — the zero-bloat, native SwiftUI utility for macOS (Storage Cleanup, Dev Build Bloat, CryptoKit SHA-256 Duplicates, Startup Optimizer, and Apple Silicon SMC Fan Control).

## Files

- `index.html` — Main landing page with interactive macOS desktop preview, Menu Bar widget popover, Bento Grid showcase, Apple SMC fan simulator, and safety model modal.
- `styles.css` — Apple Liquid Glass styling with Dark & Light appearance support.
- `script.js` — Interactive preview tabs, spinning fan rotor simulator, specular spotlight, and clipboard copy.

## Preview Locally

```bash
open index.html
```

Or serve locally:
```bash
python3 -m http.server 8080
```

## Deploy (GitHub Pages / Netlify / Cloudflare Pages / Vercel)

Because this site is pure static HTML, CSS, and JS with zero build dependencies:
1. Push this repository to GitHub.
2. Enable **GitHub Pages** (`Settings → Pages → Deploy from branch: main / root`), or connect the repo to **Netlify**, **Vercel**, or **Cloudflare Pages** with no build command and publish directory `.`.
