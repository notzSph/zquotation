/**
 * Draw a numbered, circled item for a PDFKit document.
 * `headingFont` is supplied by the caller so this primitive stays font-agnostic.
 */
export function drawGenericListItem(doc, {
  index,
  item,
  x,
  y,
  headingFont,
  circleRadius = 17,
  numberSize = 16,
  titleSize = 24,
  bodySize = 12,
  titleOffsetX = 56,
  titleWidth = 190,
  bodyOffsetY = 48,
  bodyWidth = 180,
  bodyLineGap = 6,
  borderColor = "#3c3c3c",
  textColor = "#3c3c3c",
}) {
  const diameter = circleRadius * 2;
  doc.circle(x + circleRadius, y + circleRadius, circleRadius)
    .lineWidth(0.8)
    .strokeColor(borderColor)
    .stroke();

  // This offset centres glyphs inside the circle, rather than their line box.
  headingFont(doc)
    .fontSize(numberSize)
    .fillColor(textColor)
    .text(String(index + 1).padStart(2, "0"), x, y + 5, {
      width: diameter,
      align: "center",
    });
  headingFont(doc)
    .fontSize(titleSize)
    .fillColor(textColor)
    .text(item.title, x + titleOffsetX, y + 1, {
      width: titleWidth,
      lineGap: -2,
    });
  doc.font("Manrope")
    .fontSize(bodySize)
    .fillColor(textColor)
    .text(item.copy, x + titleOffsetX, y + bodyOffsetY, {
      width: bodyWidth,
      lineGap: bodyLineGap,
    });
}
