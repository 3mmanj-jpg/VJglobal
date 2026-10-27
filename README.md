# V&J Global Business — Cloudflare Workers package

This repository contains the complete responsive website: Home, Build & Sell wholesale training, Fulfillment/3PL, About, Contact, website-creation quote, black-and-gold styling, the V&J Global Business logo, inquiry forms, and a Cloudflare Worker.

## Upload to GitHub
1. Download and extract this ZIP on your computer.
2. Open the extracted `VJ_Global_Business_Cloudflare` folder.
3. Upload the **contents** of this folder to the root of your GitHub repository (not the ZIP itself and not an extra enclosing folder).
4. Commit the changes.

## Cloudflare Workers Builds settings
- Build command: `echo "Preparing V&J Global Business"`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler deploy --dry-run`
- Root directory: `/` or blank (repository root)

`wrangler.jsonc` points to `worker.js` at the repository root and serves static assets from the same root. Do not delete `worker.js` or `wrangler.jsonc`.

## Inquiry forms
The forms submit to `/api/inquiry`. To send inquiry emails, add these Worker secrets/variables in Cloudflare: `RESEND_API_KEY`, `CONTACT_EMAIL`, and `FROM_EMAIL`. Until configured, the site shows a message directing visitors to email or WhatsApp instead of falsely claiming the form was sent.

Contact: vjglobalbusiness@gmail.com · +1 786 204 1326 · PayPal Business: @vjglobalbusiness.

Website creation offer shown on the site: $285 + $70; confirm exact domain and maintenance terms with the customer before payment.
