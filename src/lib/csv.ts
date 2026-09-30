/**
 * Zero-dependency CSV export used by the accessible data-table export mode
 * (DC254_Map_and_Cable_Tracker_UX_Redesign.md, Phase 3). Client-side only:
 * builds a UTF-8 BOM-prefixed blob so Excel reads the quoting correctly.
 */
export function downloadCsv(filename: string, rows: string[][]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const body = rows.map((r) => r.map((c) => esc(c ?? "")).join(",")).join("\r\n");
  const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
