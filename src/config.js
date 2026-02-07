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
};

module.exports = config;
