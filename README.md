# Min Jahong Resume Site

Static bilingual resume website for GitHub Pages.

## Contents

- `index.html`: Korean/English resume site
- `styles.css`: responsive styling
- `script.js`: language switch and contact form behavior
- `api/contact.js`: Node.js mail API for serverless hosting
- `assets/profile.jpg`: profile photo extracted from the resume PDF
- GitHub Pages can publish this site from the `main` branch root.

## Publish With GitHub Pages

1. Create a GitHub repository and push this folder.
2. In GitHub, open `Settings > Pages`.
3. Set `Build and deployment` to `Deploy from a branch`.
4. Select branch `main` and folder `/ (root)`.

The contact form posts to `/api/contact`, which sends email through SMTP. GitHub Pages cannot run this Node.js API by itself, so deploy this repository on a Node/serverless host such as Vercel, Render, or Railway.

Required environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_TO`
- `MAIL_FROM` optional, defaults to `SMTP_USER`

Original resume and portfolio documents are intentionally excluded from the published site.
