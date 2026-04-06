import type { FileConversionType } from "@/api/types/file";

export interface ConversionOption {
  conversion: FileConversionType;
  label: string;
}

const LABELS: Record<FileConversionType, string> = {
  csv_to_json: "CSV → JSON",
  json_to_csv: "JSON → CSV",
  xml_to_json: "XML → JSON",
  json_to_xml: "JSON → XML",
  xlsx_to_json: "Excel → JSON",
  docx_to_pdf: "Word → PDF",
  pdf_to_text: "PDF → текст",
  pdf_to_images: "PDF → изображения",
  pptx_to_pdf: "PowerPoint → PDF",
};

const MIME_MAP: Record<string, FileConversionType[]> = {
  "text/csv": ["csv_to_json"],
  "application/csv": ["csv_to_json"],
  "application/json": ["json_to_csv", "json_to_xml"],
  "text/xml": ["xml_to_json"],
  "application/xml": ["xml_to_json"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx_to_json"],
  "application/vnd.ms-excel": ["xlsx_to_json"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx_to_pdf"],
  "application/pdf": ["pdf_to_text", "pdf_to_images"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx_to_pdf"],
};

const EXT_MAP: Record<string, FileConversionType[]> = {
  csv: ["csv_to_json"],
  json: ["json_to_csv", "json_to_xml"],
  xml: ["xml_to_json"],
  xlsx: ["xlsx_to_json"],
  xls: ["xlsx_to_json"],
  docx: ["docx_to_pdf"],
  pdf: ["pdf_to_text", "pdf_to_images"],
  pptx: ["pptx_to_pdf"],
};

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  if (i < 0) return "";
  return name.slice(i + 1).toLowerCase();
}

/**
 * Список доступных конвертаций для типа файла (MIME и расширение).
 */
export function getConversionOptions(
  mimeType: string,
  fileName: string
): ConversionOption[] {
  const mime = (mimeType || "").toLowerCase().split(";")[0].trim();
  let conversions: FileConversionType[] = [];

  if (mime && MIME_MAP[mime]) {
    conversions = [...MIME_MAP[mime]];
  } else {
    const ext = extensionOf(fileName);
    if (ext && EXT_MAP[ext]) {
      conversions = [...EXT_MAP[ext]];
    }
  }

  const seen = new Set<FileConversionType>();
  const unique: FileConversionType[] = [];
  for (const c of conversions) {
    if (!seen.has(c)) {
      seen.add(c);
      unique.push(c);
    }
  }

  return unique.map((conversion) => ({
    conversion,
    label: LABELS[conversion],
  }));
}
