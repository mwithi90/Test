require('dotenv').config();

const config = {
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
  },
  google: {
    sheetsId: process.env.GOOGLE_SHEETS_ID || '1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4',
    sheetsTab: process.env.GOOGLE_SHEETS_TAB || 'Sheet1',
    serviceAccountKeyPath: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || './service-account.json',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY,
  },
  // Column mapping for the Google Sheet - update these if the sheet structure changes
  sheetColumns: {
    customerName: process.env.COL_CUSTOMER_NAME || 'Customer Name',
    restaurantType: process.env.COL_RESTAURANT_TYPE || 'Type',
    country: process.env.COL_COUNTRY || 'Country',
    region: process.env.COL_REGION || 'City/Region',
    locations: process.env.COL_LOCATIONS || 'Locations',
    pos: process.env.COL_POS || 'POS',
    labour: process.env.COL_LABOUR || 'Labour',
    inventory: process.env.COL_INVENTORY || 'Inventory',
    otherIntegrations: process.env.COL_OTHER_INTEGRATIONS || 'Other Integrations',
    prestigeTier: process.env.COL_PRESTIGE || 'Prestige Tier',
    referenceable: process.env.COL_REFERENCEABLE || 'Referenceable',
    notes: process.env.COL_NOTES || 'Notes',
  },
  scoring: {
    weights: {
      integrationMatch: 0.35,
      restaurantType: 0.25,
      geography: 0.20,
      prestige: 0.15,
      referenceReadiness: 0.05,
    },
    maxResults: 5,
  },
};

module.exports = config;
