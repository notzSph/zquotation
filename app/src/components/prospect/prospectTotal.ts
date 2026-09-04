import type { Row } from "../../quote";

function parseAmounts(total: string) {
  return (total.match(/\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?/g) || []).map((value) => {
    const separator = Math.max(value.lastIndexOf(","), value.lastIndexOf("."));
    const decimals = value.length - separator - 1;
    return Number(separator >= 0 && decimals !== 3 ? `${value.slice(0, separator).replace(/[.,]/g, "")}.${value.slice(separator + 1)}` : value.replace(/[.,]/g, ""));
  });
}

export function prospectTotal(rows: Row[]) {
  const values = rows.map((row) => parseAmounts(row.total));
  const min = values.reduce((sum, value) => sum + (value[0] || 0), 0);
  const max = values.reduce((sum, value) => sum + (value[1] ?? value[0] ?? 0), 0);
  const currency = rows.some((row) => row.total.includes("€"));
  const format = (value: number) => currency ? `€${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : String(value);
  return min ? `${format(min)}${min === max ? "" : `–${format(max)}`}${currency ? "" : " ore"}` : "";
}
