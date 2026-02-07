const { google } = require('googleapis');
const config = require('./config');

let cachedData = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: config.google.serviceAccountKeyPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth.getClient();
}

// Fetch raw sheet data - returns headers and rows as-is from the sheet
async function fetchSheetData() {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedData;
  }

  const authClient = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.google.sheetsId,
    range: `${config.google.sheetsTab}`,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) {
    throw new Error('Google Sheet is empty or has no data rows');
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Build array of objects keyed by header name
  const customers = dataRows.map((row) => {
    const record = {};
    headers.forEach((header, i) => {
      record[header.trim()] = (row[i] || '').trim();
    });
    return record;
  });

  // Log headers on first fetch so we can see what columns exist
  console.log(`Sheet loaded: ${customers.length} rows, columns: ${headers.join(' | ')}`);

  cachedData = { headers, customers };
  cacheTimestamp = now;
  return cachedData;
}

// Format sheet data as a compact text block for Claude to analyze
function formatSheetForAI() {
  if (!cachedData) return '';

  const { headers, customers } = cachedData;

  // Build a compact CSV-like representation
  let text = headers.join(' | ') + '\n';
  text += '-'.repeat(80) + '\n';

  for (const customer of customers) {
    const values = headers.map((h) => customer[h.trim()] || '');
    text += values.join(' | ') + '\n';
  }

  return text;
}

module.exports = { fetchSheetData, formatSheetForAI };
