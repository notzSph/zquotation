# zQuotation

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Build](https://github.com/notzSph/zquotation/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

zQuotation is a lightweight React and Vite proposal generator. Edit a structured JSON brief and export the live A4 proposal preview as a PDF. The proposal layout is reusable: update the content and logo filename, then keep the same page system for each client.

## Features

- Live proposal preview with a reusable A4 page system.
- Structured JSON input for client, services, pricing, maintenance and timeline content.
- Browser-side PDF export using `html2canvas` and `jsPDF`.
- Optional PDFKit renderer in `app/server/pdf.mjs` for integrations that need server-side PDF generation.
- Included Manrope font assets and responsive preview styling.

## Change the logo

Add a logo file to `app/public/`, then set its filename in the JSON brief. For example:

```json
{
  "logo": "yourlogo.svg",
  "provider": "YOUR\nSTUDIO"
}
```

The `logo` value is resolved from `app/public/` and displayed in the proposal header on every page. SVG and raster image files are supported. The default seed brief uses `z-logo.svg`.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Run locally

```bash
cd app
npm ci --include=dev
npm run dev
```

Open the local URL printed by Vite. The default development port is `5174`.

## Build

```bash
cd app
npm run build
```

The production bundle is written to `app/dist/`.

## Using the generator

1. Start the development server.
2. Replace the JSON in the **Project brief** editor.
3. Keep the JSON valid and follow the shape of the example in `app/src/quote.ts`.
4. Select **Download A4 PDF** to export the proposal.

The seed content is intentionally generic. Replace the provider, client, contact details, copy and commercial values before sharing a proposal.

## Project structure

```text
app/
├── export/           Generated JSON/PDF exports (examples are tracked)
├── index.html        Vite entry document
├── package.json      App scripts and dependencies
├── src/
│   ├── components/   Preview page components and styles
│   ├── lib/          Shared PDF drawing helpers
│   ├── main.tsx      Application entrypoint and browser export
│   ├── quote.ts      Quote types and seed brief
│   └── style.css     Application and preview styles
├── server/pdf.mjs    Optional server-side PDFKit renderer
└── public/           Static images and brand assets
```

## License

MIT. See [LICENSE](LICENSE).
