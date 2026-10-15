// Đọc file Excel người dùng chọn. Thư viện xlsx khá nặng nên chỉ tải khi cần.
export async function readWorkbook(file) {
  const [XLSX, buffer] = await Promise.all([import("xlsx"), file.arrayBuffer()]);
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  return {
    sheetNames: workbook.SheetNames,
    rows: (sheetName) => XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
  };
}

// Số ngày kiểu Excel → Date (UTC).
export const excelSerialToDate = (value) => new Date(Math.round((value - 25569) * 86400 * 1000));

// Chuỗi tiền tệ có ký tự lạ → số.
export const toAmount = (value) => (typeof value === "number" ? value : Number(String(value || "0").replace(/[^0-9.-]+/g, "")));
