// Kho dữ liệu trong bộ nhớ cho chế độ `npm run dev:mock`. Mất khi tắt server.
import { seed } from "../../dev/mock-data.js";

let store = null;
const getStore = () => (store ||= structuredClone(seed));

export function read(sheetName) {
  return structuredClone(getStore()[sheetName] || []);
}

export function append(sheetName, rows) {
  const sheet = (getStore()[sheetName] ||= [[]]);
  sheet.push(...structuredClone(rows));
}

export function replace(sheetName, rows) {
  const sheet = getStore()[sheetName] || [[]];
  getStore()[sheetName] = [sheet[0], ...structuredClone(rows)];
}

export function updateCell(sheetName, cell, value) {
  const match = /^([A-Z])(\d+)$/.exec(cell);
  if (!match) throw new Error(`Ô không hợp lệ: ${cell}`);
  const col = match[1].charCodeAt(0) - 65;
  const row = Number(match[2]) - 1;
  const sheet = getStore()[sheetName];
  while (sheet.length <= row) sheet.push([]);
  while (sheet[row].length <= col) sheet[row].push("");
  sheet[row][col] = value;
}
