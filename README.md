# Heavybites Havelian: Website

Static, mobile-first site for Heavybites Havelian (pizza, fast food, ice cream) in Havelian.
Orders are sent to WhatsApp (0333 1244488). No backend needed.

## Edit prices / deals
Open `menu-data.js`. Every deal and menu item lives there; the site updates automatically.

## Change the WhatsApp number
In `menu-data.js` edit `whatsapp` (country code, no +), e.g. `923331244488`.

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. Vercel → Add New → Project → import the repo.
3. Framework preset: **Other**. No build command. Output directory: leave blank.
4. Deploy.

## Files
- `index.html`, `style.css`, `app.js`: the site
- `menu-data.js`: all menu + deals data
- `assets/`: logo and the shop's own posters

## SEO checklist
- Title/description target "pizza in Havelian", "pizza shop Havelian" and nearby-city searches.
- JSON-LD: Restaurant (with geo, hours, menu link) + FAQPage schema, both in index.html.
- robots.txt + sitemap.xml included.
- Canonical URL is set to https://heavybites-havelian.vercel.app/. If you deploy to a custom domain, replace it in index.html, sitemap.xml and robots.txt.
- After deploying: register the shop on Google Business Profile (google.com/business) - it is the single biggest factor for appearing in "pizza in Havelian" map results.
- Then submit the URL in Google Search Console and request indexing.
