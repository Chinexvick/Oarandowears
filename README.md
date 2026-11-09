# Orlando Wears: Fashion Boutique Website

*Where class meets style.*

A fast, dependency-free static website for **Orlando Wears**, a men's fashion boutique
(clothing, footwear and accessories). Orders and enquiries go straight to WhatsApp.

## What's inside

| Path | Purpose |
| --- | --- |
| `index.html` | The whole homepage |
| `assets/css/style.css` | All styles (black & gold luxury theme) |
| `assets/js/main.js` | Carousel, filters, scroll animations (vanilla JS, ~10 KB) |
| `assets/img/` | Optimised WebP images, metadata stripped |
| `assets/fonts/` | Self-hosted Cormorant Garamond + Manrope (no Google tracking) |
| `vercel.json` | Security headers + caching for Vercel |

## Features

- **Hero** with floating pill navigation and an arch-shaped look carousel (arrows, swipe, autoplay).
- **Scroll "film"**: a pinned lookbook where each scroll step wipes in the next scene
  while the camera slowly pushes in, so it plays like a video controlled by the scroll wheel.
- **Collection** with category filters; every product opens WhatsApp with a pre-filled message.
- **Accessories** section with parallax detail shots, brand story, CTA and contact footer.
- Respects `prefers-reduced-motion` (animations switch off for people who need that).

## Security & performance

- No frameworks, no third-party scripts, no trackers, no cookies, no forms, no API keys.
- Strict Content-Security-Policy: only files from this site can load or run.
- HSTS, `nosniff`, clickjacking protection (`X-Frame-Options: DENY`), locked-down permissions.
- All outbound links use `rel="noopener noreferrer"`.
- Photos were re-encoded so **no EXIF / GPS / camera data** is published.
- Total page weight is roughly 1 MB, and most images lazy-load as you scroll.

## Editing

- **WhatsApp number**: search for `2348141273507` in `index.html` and `assets/js/main.js`.
- **Add a product**: copy one `<li class="card">` block in `index.html`, change the image,
  name, category (`data-cat`) and the `data-wa` message.
- **New images**: export as WebP (about 900 px wide, quality around 75) into `assets/img/`.
  Re-save photos before uploading so their location data is removed.

## Deploying

The site is static, so there is no build step.

- **Vercel**: import the GitHub repo, framework preset **Other**, and leave the build command empty.
- **Local preview**: `python3 -m http.server 8080`, then open http://localhost:8080
