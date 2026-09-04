import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drawGenericListItem } from "../src/lib/genericListItem.mjs";

const W = 595.28;
const H = 841.89;
const M = 48;
const fontDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "fonts");
// Service-page design controls. Edit these values to tune the exported PDF.
const SERVICE_STYLE = {
  background: "#f8f7f3",
  primaryColor: "#3c3c3c",
  secondaryColor: "#e4e4e4",
  titleSize: 64,
  itemTitleSize: 24,
  bodySize: 12,
  circleRadius: 17,
  firstRowY: 405,
  rowGap: 183,
  leftColumnX: 48,
  rightColumnX: 315,
};

function useBrandFonts(doc) {
  doc.registerFont("Manrope", path.join(fontDir, "Manrope-Regular.ttf"));
  doc.registerFont("Manrope-Medium", path.join(fontDir, "Manrope-Medium.ttf"));
  doc.registerFont("Manrope-Semibold", path.join(fontDir, "Manrope-Semibold.ttf"));

  // Neue Montreal is licensed. When supplied, it is used automatically;
  // Helvetica keeps the renderer operational in the meantime.
  const montreal = path.join(fontDir, "NeueMontreal-Regular.ttf");
  if (fs.existsSync(montreal)) doc.registerFont("Neue Montreal", montreal);
  const montrealBold = path.join(fontDir, "NeueMontreal-Bold.ttf");
  if (fs.existsSync(montrealBold)) doc.registerFont("Neue Montreal Bold", montrealBold);
}

function headingFont(doc) {
  return doc.font(fs.existsSync(path.join(fontDir, "NeueMontreal-Regular.ttf")) ? "Neue Montreal" : "Helvetica");
}
function headingBoldFont(doc) {
  return doc.font(fs.existsSync(path.join(fontDir, "NeueMontreal-Bold.ttf")) ? "Neue Montreal Bold" : "Helvetica-Bold");
}
function prospectTotal(rows) {
  const parseAmounts = (total) => (String(total).match(/\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?/g) || []).map((value) => {
    const lastSeparator = Math.max(value.lastIndexOf(","), value.lastIndexOf("."));
    const fractionLength = value.length - lastSeparator - 1;
    const normalized = lastSeparator >= 0 && fractionLength !== 3
      ? `${value.slice(0, lastSeparator).replace(/[.,]/g, "")}.${value.slice(lastSeparator + 1)}`
      : value.replace(/[.,]/g, "");
    return Number(normalized);
  });
  const values = rows.map((row) => parseAmounts(row.total));
  const min = values.reduce((sum, parts) => sum + (parts[0] || 0), 0);
  const max = values.reduce((sum, parts) => sum + (parts[1] ?? parts[0] ?? 0), 0);
  const currency = rows.some((row) => String(row.total).includes("€"));
  const suffix = currency ? "" : " ore";
  const format = (value) => currency ? `€${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : String(value);
  return `${format(min)}${min !== max ? `–${format(max)}` : ""}${suffix}`;
}

function line(doc, y) { doc.moveTo(M, y).lineTo(W - M, y).lineWidth(.5).strokeColor("#222").stroke(); }
function footer(doc, q, page) { doc.font("Helvetica").fontSize(7).fillColor("#333"); doc.text(q.provider.replace(/\n/g, " "), M, H - 31); doc.text(`${q.month} ${q.year}`, W / 2 - 35, H - 31, { width: 70, align: "center" }); doc.text(String(page).padStart(2, "0"), W - M - 24, H - 31, { width: 24, align: "right" }); }
function header(doc, q, title, page) { doc.font("Helvetica").fontSize(8).fillColor("#111").text(`${q.month} ${q.year}`.toUpperCase(), M, M); doc.font("Times-Roman").fontSize(34).text(title, M, 73); line(doc, 124); footer(doc, q, page); }
function addPage(doc) { doc.addPage({ size: "A4", margin: 0 }); }

export function createProposalPdf(q) {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const month = new Intl.DateTimeFormat("it-IT", { month: "long" }).format(now);
    q = {
      ...q,
      month: month.charAt(0).toUpperCase() + month.slice(1),
      year: String(now.getFullYear()),
    };
    const doc = new PDFDocument({ size: "A4", margin: 0, info: { Title: `${q.title} — ${q.client}`, Author: q.provider.replace(/\n/g, " ") } });
    useBrandFonts(doc);
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background);
    const coverImage = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "cover-architecture.png");
    if (fs.existsSync(coverImage)) doc.image(coverImage, 0, 390, { cover: [W, H - 390], align: "center", valign: "bottom" });
    doc.save().fillOpacity(.9).rect(68, 390, 230, H - 390).fill("#8f85d5").restore();
    doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider, 94, 56, { lineGap: 2 });
    doc.font("Manrope").fontSize(14).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 });
    headingFont(doc).fontSize(64).text(q.title.toUpperCase(), 51, 135, { width: 485, lineGap: -3 });
    doc.font("Manrope").fontSize(12).text("Presentata da:", 55, 293);
    headingFont(doc).fontSize(24).text(q.provider.replace(/\n/g, " "), 55, 310, { width: 200 });
    doc.font("Manrope").fontSize(12).text((q.contactLines || [q.providerMeta])[0], 55, 341);
    doc.font("Manrope").fontSize(12).text("Presentata per:", 298, 293);
    headingBoldFont(doc).fontSize(24).text(q.client, 298, 310, { width: 230 });
    if (q.clientVat) doc.font("Manrope").fontSize(12).text(`P.IVA ${q.clientVat}`, 298, 341, { width: 230 });

    addPage(doc);
    doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background);
    doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider, 94, 56, { lineGap: 2 });
    doc.font("Manrope").fontSize(14).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 });
    headingBoldFont(doc).fontSize(20).fillColor(SERVICE_STYLE.primaryColor).text("Introduzione", 56, 130);
    doc.moveTo(56, 180).lineTo(196, 180).lineWidth(1).strokeColor(SERVICE_STYLE.primaryColor).stroke();
    headingFont(doc).fontSize(33).text(`${q.title}\n${q.indexSubtitle || q.providerMeta}\n${q.client}`, 56, 205, { width: 485, lineGap: 8 });
    doc.font("Manrope").fontSize(12).text(q.intro, 56, 387, { width: 235, lineGap: 6 });
    const indexItems = q.indexItems || q.services.map((service) => ({ title: service.title, copy: [service.intro] }));
    let indexY = 382;
    indexItems.forEach((item, itemIndex) => {
      doc.circle(337, indexY + 12, 16).lineWidth(1).strokeColor(SERVICE_STYLE.primaryColor).stroke();
      doc.font("Manrope").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(String(itemIndex + 1).padStart(2, "0"), 321, indexY + 8, { width: 32, align: "center" });
      headingBoldFont(doc).fontSize(24).text(item.title, 369, indexY + 8, { width: 170, lineGap: 3 });
      let copyY = indexY + 47;
      item.copy.forEach((copy) => { doc.font("Manrope").fontSize(11).text(copy, 369, copyY, { width: 160, lineGap: 4 }); copyY += doc.heightOfString(copy, { width: 160, lineGap: 4 }) + 14; });
      indexY += 148;
    });
    const index = ["Introduction", ...q.services.map((x) => x.title), "Hourly Prospect", "Economic Prospect", "Maintenance", "Timeline", "Closing"];
    index.forEach((item, i) => { const y = 303 + i * 28; doc.font("Helvetica").fontSize(10).text(item, M, y); doc.text(String(i + 2).padStart(2, "0"), W - M - 24, y, { width: 24, align: "right" }); doc.moveTo(M, y + 19).lineTo(W - M, y + 19).lineWidth(.3).strokeColor("#999").stroke(); });

    q.services.forEach((service) => {
      addPage(doc);
      doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background);

      // Service description template — measured from the supplied reference.
      doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider.replace(/\n/g, "\n"), 94, 56, { lineGap: 2 });
      doc.font("Manrope").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 });
      headingFont(doc).fontSize(SERVICE_STYLE.titleSize).fillColor(SERVICE_STYLE.primaryColor).text(service.title, 47, 159, { width: 500, lineGap: -8 });
      doc.font("Manrope").fontSize(SERVICE_STYLE.bodySize).fillColor(SERVICE_STYLE.primaryColor).text(service.intro, 52, 292, { width: 420, lineGap: 6 });

      service.items.forEach((item, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = col ? SERVICE_STYLE.rightColumnX : SERVICE_STYLE.leftColumnX;
        const y = SERVICE_STYLE.firstRowY + row * SERVICE_STYLE.rowGap;
        drawGenericListItem(doc, {
          index: i,
          item,
          x,
          y,
          headingFont,
          circleRadius: SERVICE_STYLE.circleRadius,
          titleSize: SERVICE_STYLE.itemTitleSize,
          bodySize: SERVICE_STYLE.bodySize,
          borderColor: i === 1 || i === 2 ? SERVICE_STYLE.secondaryColor : SERVICE_STYLE.primaryColor,
          textColor: SERVICE_STYLE.primaryColor,
        });
      });
    });

    const prospect = (title, rows, note) => { addPage(doc); doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background); doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider, 94, 56, { lineGap: 2 }); doc.font("Manrope").fontSize(14).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 }); headingFont(doc).fontSize(40).fillColor(SERVICE_STYLE.primaryColor).text(title, 47, 125, { width: 480, lineGap: -4 }); let y = 215; const tableTop = 207; doc.rect(55, tableTop, 475, 34).fill("#0d1a26"); headingBoldFont(doc).fontSize(12).fillColor("#f8f7f3").text("VOCE", 55, y).text("DESCRIZIONE", 196, y).text("TOTALE", 438, y, { width: 80, align: "center" }); y += 23; doc.moveTo(55, y).lineTo(530, y).lineWidth(.6).strokeColor(SERVICE_STYLE.primaryColor).stroke(); y += 15; rows.forEach((row) => { doc.font("Manrope").fontSize(12); const descriptionHeight = doc.heightOfString(row.description, { width: 224, lineGap: 4 }); const height = Math.max(51, descriptionHeight + 15); headingBoldFont(doc).fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(row.label, 67, y + (height - 12) / 2, { width: 113 }); doc.font("Manrope").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(row.description, 208, y + (height - descriptionHeight) / 2, { width: 224, lineGap: 4 }); doc.text(row.total, 438, y + (height - 12) / 2, { width: 80, align: "center" }); y += height; doc.moveTo(55, y).lineTo(530, y).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke(); if (row !== rows[rows.length - 1]) y += 8; }); doc.font("Manrope-Medium").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text("TOTALE", 95, y + 20); headingBoldFont(doc).fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(prospectTotal(rows), 438, y + 20, { width: 80, align: "center" }); doc.moveTo(55, y + 45).lineTo(530, y + 45).lineWidth(.6).strokeColor(SERVICE_STYLE.primaryColor).stroke(); doc.moveTo(55, 207).lineTo(55, y + 45).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke(); doc.moveTo(196, 241).lineTo(196, y + 45).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke(); doc.moveTo(438, 241).lineTo(470, y + 45).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke(); doc.moveTo(530, 207).lineTo(530, y + 45).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke(); doc.font("Manrope").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(note, 55, Math.min(y + 105, 755), { width: 367, lineGap: 6 }); };
    const maintenance = () => {
      addPage(doc);
      doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background);
      doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider, 94, 56, { lineGap: 2 });
      doc.font("Manrope").fontSize(14).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 });
      headingFont(doc).fontSize(40).fillColor(SERVICE_STYLE.primaryColor).text("Maintenance", 47, 125, { width: 480, lineGap: -4 });
      doc.font("Manrope").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(q.maintenanceIntro || "A dedicated maintenance plan keeps the website secure, current and performing reliably after launch.", 55, 205, { width: 367, lineGap: 6 });
      const row = q.maintenance;
      const tableTop = 285;
      let y = tableTop + 8;
      doc.rect(55, tableTop, 475, 34).fill("#0d1a26");
      headingBoldFont(doc).fontSize(12).fillColor("#f8f7f3").text("VOCE", 55, y).text("DESCRIZIONE", 196, y).text("TOTALE", 438, y, { width: 80, align: "center" });
      y += 38;
      doc.font("Manrope").fontSize(12);
      const descriptionHeight = doc.heightOfString(row.description, { width: 224, lineGap: 4 });
      const height = Math.max(51, descriptionHeight + 15);
      headingBoldFont(doc).fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(row.label, 67, y + (height - 12) / 2, { width: 113 });
      doc.font("Manrope").fontSize(12).text(row.description, 208, y + (height - descriptionHeight) / 2, { width: 224, lineGap: 4 });
      doc.text(row.total, 438, y + (height - 12) / 2, { width: 80, align: "center" });
      y += height;
      doc.font("Manrope-Medium").fontSize(12).text("TOTALE", 95, y + 20);
      headingBoldFont(doc).fontSize(12).text(prospectTotal([row]), 438, y + 20, { width: 80, align: "center" });
      const bottom = y + 45;
      [55, 196, 438, 530].forEach((x) => doc.moveTo(x, tableTop).lineTo(x, bottom).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke());
      [tableTop + 34, y, bottom].forEach((lineY) => doc.moveTo(55, lineY).lineTo(530, lineY).lineWidth(.35).strokeColor(SERVICE_STYLE.primaryColor).stroke());
    };
    const timeline = () => {
      const phases = q.timeline || [];
      addPage(doc);
      doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background);
      doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider, 94, 56, { lineGap: 2 });
      doc.font("Manrope").fontSize(14).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 });
      headingFont(doc).fontSize(40).fillColor(SERVICE_STYLE.primaryColor).text("Timeline", 47, 125, { width: 480, lineGap: -4 });
      const routeX = W / 2;
      const top = 248;
      const stopGap = 120;
      const lastStopY = top + Math.max(phases.length - 1, 0) * stopGap;
      doc.moveTo(routeX, top).lineTo(routeX, lastStopY).lineWidth(4).strokeColor(SERVICE_STYLE.primaryColor).stroke();
      phases.forEach((phase, index) => {
        const stopY = top + index * stopGap;
        const isRight = index % 2 === 1;
        const textX = isRight ? routeX + 28 : 55;
        const textWidth = 190;
        const align = isRight ? "left" : "right";
        doc.circle(routeX, stopY, 10).fill(SERVICE_STYLE.primaryColor);
        const periodX = isRight ? textX + 13 : textX;
        const periodWidth = textWidth - 13;
        doc.font("Manrope-Medium").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(phase.period, periodX, stopY - 2, { width: periodWidth, align });
        const labelWidth = doc.widthOfString(phase.period);
        const flagX = isRight ? textX + 4 : textX + textWidth + 4;
        doc.moveTo(flagX, stopY - 2).lineTo(flagX, stopY + 9).lineWidth(1.5).strokeColor(SERVICE_STYLE.primaryColor).stroke();
        doc.moveTo(flagX, stopY - 2).lineTo(flagX + 7, stopY).lineTo(flagX, stopY + 3).closePath().fill(SERVICE_STYLE.primaryColor);
        headingBoldFont(doc).fontSize(13).text(phase.title, textX, stopY + 15, { width: textWidth, align, lineGap: 3 });
        let y = stopY + 46;
        phase.items.forEach((item) => {
          doc.font("Manrope").fontSize(10.5).text(item, textX, y, { width: textWidth, align, lineGap: 3 });
          y += doc.heightOfString(item, { width: textWidth, lineGap: 3 }) + 5;
        });
      });
      doc.font("Manrope").fontSize(12).fillColor(SERVICE_STYLE.primaryColor).text(q.timelineNote || "", 55, lastStopY + 92, { width: 367, lineGap: 6 });
    };
    const table = (title, rows, page, note) => { addPage(doc); header(doc, q, title, page); let y = 150; doc.font("Helvetica-Bold").fontSize(7).text("ITEM", M, y).text("DESCRIPTION", M + 132, y).text("TOTAL", W - M - 80, y, { width: 80, align: "right" }); y += 20; line(doc, y); y += 13; rows.forEach((row) => { doc.font("Helvetica-Bold").fontSize(8).text(row.label, M, y, { width: 120 }); doc.font("Helvetica").fontSize(8.5).text(row.description, M + 132, y, { width: 270, lineGap: 3 }); doc.font("Helvetica-Bold").fontSize(9).text(row.total, W - M - 90, y, { width: 90, align: "right" }); const height = Math.max(doc.heightOfString(row.description, { width: 270, lineGap: 3 }), 28); y += height + 16; }); doc.font("Helvetica").fontSize(8).fillColor("#555").text(note, M, y + 22, { width: 400, lineGap: 3 }); };
    const p = q.services.length + 2;
    prospect("Prospetto Orario", q.hours, "Il presente Prospetto Orario è da considerarsi indicativo e potrà essere adeguato in funzione di richieste specifiche o modifiche.");
    prospect("Prospetto Economico", q.economics, "Il presente Prospetto Economico è da considerarsi indicativo e potrà essere adeguato in funzione di richieste specifiche o modifiche.");
    maintenance();
    timeline();
    addPage(doc);
    doc.rect(0, 0, W, H).fill(SERVICE_STYLE.background);
    doc.font("Manrope-Medium").fontSize(14).fillColor(SERVICE_STYLE.primaryColor).text(q.provider, 94, 56, { lineGap: 2 });
    doc.font("Manrope").fontSize(14).text(`${q.month}\n${q.year}`, 470, 56, { width: 78, align: "right", lineGap: 1 });
    headingFont(doc).fontSize(64).fillColor(SERVICE_STYLE.primaryColor).text("Grazie", 55, 485, { lineGap: -6 });
    const contactLines = q.contactLines || [q.providerMeta];
    let contactY = 638;
    headingBoldFont(doc).fontSize(14).text(q.provider.replace(/\n/g, " "), 315, contactY, { width: 215, align: "right" });
    contactY += 29;
    contactLines.forEach((entry) => {
      doc.font("Manrope").fontSize(12).text(entry, 315, contactY, { width: 215, align: "right" });
      contactY += 25;
    });
    doc.moveTo(110, 724).lineTo(55, 754).lineWidth(1.5).strokeColor(SERVICE_STYLE.primaryColor).stroke();
    doc.moveTo(55, 754).lineTo(55, 739).moveTo(55, 754).lineTo(71, 754).lineWidth(1.5).strokeColor(SERVICE_STYLE.primaryColor).stroke();
    doc.font("Manrope").fontSize(7).text(`© ${q.year} ${q.provider.replace(/\n/g, " ")} | ${q.providerMeta}`, 55, 790, { width: 190 });
    doc.text("– Tutti i diritti riservati –", 245, 790, { width: 120, align: "center" });
    doc.text("Divieto di diffusione non autorizzata", 365, 790, { width: 165, align: "right" });
    doc.end();
  });
}
