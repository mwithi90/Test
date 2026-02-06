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
  const customers = rows.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, i) => {
      record[header.trim()] = (row[i] || '').trim();
    });
    return record;
  });

  cachedData = { headers, customers };
  cacheTimestamp = now;
  return cachedData;
}

// Parse a customer record into a normalized structure using the configured column mapping
function normalizeCustomer(record) {
  const cols = config.sheetColumns;

  // Collect all integrations from separate columns into one array
  const integrations = [];
  const posVal = record[cols.pos];
  const labourVal = record[cols.labour];
  const inventoryVal = record[cols.inventory];
  const otherVal = record[cols.otherIntegrations];

  if (posVal) integrations.push(...posVal.split(/[,;]+/).map((s) => s.trim()).filter(Boolean));
  if (labourVal) integrations.push(...labourVal.split(/[,;]+/).map((s) => s.trim()).filter(Boolean));
  if (inventoryVal) integrations.push(...inventoryVal.split(/[,;]+/).map((s) => s.trim()).filter(Boolean));
  if (otherVal) integrations.push(...otherVal.split(/[,;]+/).map((s) => s.trim()).filter(Boolean));

  return {
    name: record[cols.customerName] || 'Unknown',
    restaurantType: (record[cols.restaurantType] || '').toLowerCase(),
    country: (record[cols.country] || '').toLowerCase(),
    region: (record[cols.region] || '').toLowerCase(),
    locations: parseInt(record[cols.locations], 10) || 0,
    integrations: integrations.map((i) => i.toLowerCase()),
    integrationsRaw: integrations,
    prestigeTier: parseInt(record[cols.prestigeTier], 10) || 3,
    referenceable: (record[cols.referenceable] || 'yes').toLowerCase() === 'yes',
    notes: record[cols.notes] || '',
    _raw: record,
  };
}

async function getCustomers() {
  const { customers } = await fetchSheetData();
  return customers.map(normalizeCustomer).filter((c) => c.referenceable);
}

module.exports = { fetchSheetData, getCustomers, normalizeCustomer };
