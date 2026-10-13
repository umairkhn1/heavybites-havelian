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
