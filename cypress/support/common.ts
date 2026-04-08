// common.ts - Utility functions migrated from Ruby common.rb

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export function writeFile(filePath: string, data: string, mode: string = 'w'): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, data, { encoding: 'utf8' });
}

export function writeFileBinary(filePath: string, data: Buffer): void {
  writeFile(filePath, data.toString('binary'), 'wb');
}

export function createNewFile(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.closeSync(fs.openSync(filePath, 'w'));
}

export function appendToFile(filePath: string, data: string): void {
  fs.appendFileSync(filePath, data);
}

export function downloadFile(url: string, filePath?: string): string {
  // Note: In Node.js/Cypress, downloading files requires additional libraries like axios
  // For simplicity, this is a placeholder
  filePath = filePath || path.join('downloads', path.basename(url));
  console.log(`Downloading file from ${url} to ${filePath}`);
  // Implement download logic if needed
  return filePath;
}

export function createDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function readCsvFile(filePath: string, skipNumberSign: boolean = true): any[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const options: any = { columns: true, skip_empty_lines: true };
  if (skipNumberSign) {
    options.skip_lines_with_error = true; // Approximate
  }
  return parse(content, options);
}

export function readCsvFileToHash(filePath: string, skipNumberSign: boolean = true): any[] {
  const records = readCsvFile(filePath, skipNumberSign);
  return records.map(row => {
    console.log(row);
    return row;
  });
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function readJsonFile(filePath: string): any {
  return JSON.parse(readFile(filePath));
}

export function createTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function timeInIso(): string {
  return new Date().toISOString();
}

export function timeInIsoShift(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function timeNow(): string {
  return new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, 'Z');
}

export function dateNow(): Date {
  return new Date();
}

export function dateOfNext(day: string): Date {
  const date = new Date(day);
  const today = new Date();
  const delta = date > today ? 0 : 7;
  date.setDate(date.getDate() + delta);
  return date;
}

export function dateShiftDays(daysNum: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysNum);
  return date;
}

export function dateToTimestamp(date: string): number {
  return Math.floor(new Date(date).getTime() / 1000);
}

export function convertToJson(object: any): any {
  if (typeof object === 'string') {
    try {
      return JSON.parse(object);
    } catch {
      return JSON.parse(JSON.stringify(object));
    }
  }
  return object;
}

let currentUser: any;

export function setUser(user: any): void {
  currentUser = { ...user };
}

export function getCurrentUser(): any {
  return currentUser;
}

export function wordFromChars(charsAmount: number): string {
  return 'a'.repeat(charsAmount);
}

export function wordFromNumbers(numbersAmount: number): string {
  return '1'.repeat(numbersAmount);
}

export function emailFromCharsAmount(charsAmount: number): string {
  return 'a'.repeat(charsAmount - 9) + '@mail.com';
}

export function buildErrorMessage(key: string, message: string): any {
  return { errorCode: key, errorDescription: message };
}

export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).replace(/-/g, '');
}

export function generateUniqueName(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `${timestamp}${Math.floor(Math.random() * 10000)}`;
}

export function randomString(charAmount: number = 4): string {
  let result = '';
  for (let i = 0; i < charAmount; i++) {
    result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  return result;
}