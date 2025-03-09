import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ExportType = "csv" | "excel" | "pdf";

export const exportData = <T extends Record<string, unknown>>(
  data: T[],
  fileName: string,
  exportType: ExportType
) => {
  if (!data.length) {
    console.warn("No data to export.");
    return;
  }

  switch (exportType) {
    case "csv":
      exportToCSV(data, fileName);
      break;
    case "excel":
      exportToExcel(data, fileName);
      break;
    case "pdf":
      exportToPDF(data, fileName);
      break;
    default:
      console.error("Unsupported export type:", exportType);
  }
};

const exportToCSV = <T extends Record<string, unknown>>(
  data: T[],
  fileName: string
) => {
  const csvContent = [
    Object.keys(data[0] || {}).join(","), // Headers
    ...data.map((item) => Object.values(item).join(",")), // Rows
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, fileName, "csv");
};

const exportToExcel = <T extends Record<string, unknown>>(
  data: T[],
  fileName: string
) => {
  let tableHTML = "<table border='1'><tr>";

    // Add table headers
  tableHTML +=
    Object.keys(data[0] || {})
      .map((header) => `<th>${header}</th>`)
      .join("") + "</tr>";

  // Add table rows
  tableHTML += data
    .map(
      (row) =>
        `<tr>${Object.values(row)
          .map((val) => `<td>${val}</td>`)
          .join("")}</tr>`
    )
    .join("");

  tableHTML += "</table>";

  const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
  downloadBlob(blob, fileName, "xls");
};

const exportToPDF = <T extends Record<string, unknown>>(
  data: T[],
  fileName: string
) => {
  const win = window.open("", "", "width=800,height=600");
  if (!win) return console.error("Popup blocked!");

  let html = `<html><head><title>${fileName}</title></head><body><h1>${fileName}</h1><table border='1'><tr>`;

  // Headers
  html +=
    Object.keys(data[0] || {})
      .map((header) => `<th>${header}</th>`)
      .join("") + "</tr>";

  // Rows
  html += data
    .map(
      (row) =>
        `<tr>${Object.values(row)
          .map((val) => `<td>${val}</td>`)
          .join("")}</tr>`
    )
    .join("");

  html += "</table></body></html>";

  win.document.write(html);
  win.document.close();
  win.print();
};

const downloadBlob = (blob: Blob, fileName: string, extension: string) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.${extension}`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
