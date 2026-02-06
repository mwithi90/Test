# TenzoRef Bot - Setup Guide

## Prerequisites

- **Node.js 20+** — check with `node --version`
- A **Slack workspace** where you have permission to install apps
- A **Google Cloud** account (free tier is fine)
- An **Anthropic** account for the Claude API
- Optional: A **Tavily** account for web search enrichment

---

## 1. Create a Slack App

### 1.1 Create the App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**
2. Choose **From scratch**
3. Name: `TenzoRef`
4. Select your Tenzo workspace
5. Click **Create App**

### 1.2 Configure Bot Permissions

1. In the left sidebar, go to **OAuth & Permissions**
2. Scroll down to **Scopes > Bot Token Scopes**
3. Click **Add an OAuth Scope** and add each of these:
   - `chat:write` — Send messages as the bot
   - `commands` — Register and respond to slash commands
   - `im:write` — Open DMs with users to send results
   - `app_mentions:read` — Respond when someone @mentions the bot

### 1.3 Enable Interactivity (required for modals)

1. In the left sidebar, go to **Interactivity & Shortcuts**
2. Toggle **Interactivity** to **On**
3. For the Request URL, enter any placeholder for now (e.g. `https://placeholder.com`) — Socket Mode bypasses this, but the toggle must be on
4. Click **Save Changes**

### 1.4 Enable Event Subscriptions

1. In the left sidebar, go to **Event Subscriptions**
2. Toggle **Enable Events** to **On**
3. Under **Subscribe to bot events**, click **Add Bot User Event** and add:
   - `app_mention`
4. Click **Save Changes**

### 1.5 Enable Socket Mode

Socket Mode lets the bot connect via WebSocket instead of requiring a public URL. This is the simplest deployment option.

1. In the left sidebar, go to **Socket Mode**
2. Toggle it **On**
3. You'll be prompted to generate an **App-Level Token**:
   - Token name: `tenzo-ref-socket`
   - Scope: `connections:write`
   - Click **Generate**
4. **Copy this token** — it starts with `xapp-`. Save it as your `SLACK_APP_TOKEN`

### 1.6 Create the Slash Command

1. In the left sidebar, go to **Slash Commands**
2. Click **Create New Command**
3. Fill in:
   - **Command:** `/tenzo-ref`
   - **Short Description:** `Find the best customer references for a prospect`
   - **Usage Hint:** `Opens a form to enter prospect details`
4. Click **Save**

### 1.7 Install the App to Your Workspace

1. In the left sidebar, go to **Install App**
2. Click **Install to Workspace**
3. Review permissions and click **Allow**
4. **Copy the Bot User OAuth Token** — it starts with `xoxb-`. Save it as your `SLACK_BOT_TOKEN`

### 1.8 Get the Signing Secret

1. In the left sidebar, go to **Basic Information**
2. Under **App Credentials**, find **Signing Secret**
3. Click **Show** and copy it. Save it as your `SLACK_SIGNING_SECRET`

---

## 2. Set Up Google Sheets Access

This is the most involved step. You need to create a Google Cloud service account, download its credentials as a JSON file, and share your Google Sheet with it.

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. If you don't have a project yet:
   - Click the project dropdown at the top of the page
   - Click **New Project**
   - Name: `tenzo-ref-bot`
   - Click **Create**
3. Make sure this project is selected in the top dropdown

### 2.2 Enable the Google Sheets API

1. Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for **Google Sheets API**
3. Click on it and click **Enable**
4. Wait for it to enable (takes a few seconds)

### 2.3 Create a Service Account

A service account is like a "robot user" that the bot uses to authenticate with Google.

1. Go to [IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **+ Create Service Account** at the top
3. Fill in:
   - **Service account name:** `tenzo-ref-sheets`
   - **Service account ID:** this auto-fills (e.g. `tenzo-ref-sheets@tenzo-ref-bot.iam.gserviceaccount.com`)
   - **Description:** `Read access to the customer reference Google Sheet`
4. Click **Create and Continue**
5. Skip the "Grant this service account access" step — click **Continue**
6. Skip the "Grant users access" step — click **Done**

### 2.4 Create and Download the JSON Key File

This is the critical step. The JSON key file is what allows the bot to authenticate as the service account.

1. In the [Service Accounts list](https://console.cloud.google.com/iam-admin/serviceaccounts), click on the service account you just created (`tenzo-ref-sheets@...`)
2. Go to the **Keys** tab
3. Click **Add Key > Create new key**
4. Select **JSON** format
5. Click **Create**
6. **A JSON file will automatically download to your computer.** It will be named something like `tenzo-ref-bot-abc123.json`

### 2.5 Place the JSON Key File in Your Project

1. Rename the downloaded file to `service-account.json`
2. Move it to the root of this project directory (next to `package.json`):

```
tenzo-ref-bot/
├── package.json
├── service-account.json    <-- put it here
├── .env
├── src/
│   └── ...
```

**What's inside the JSON file:**

The file contains credentials for the service account. It looks like this (do NOT share this file publicly):

```json
{
  "type": "service_account",
  "project_id": "tenzo-ref-bot",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "tenzo-ref-sheets@tenzo-ref-bot.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

The `client_email` field is especially important — you'll need it in the next step.

**Security note:** This file is in `.gitignore` and should NEVER be committed to version control.

### 2.6 Share the Google Sheet with the Service Account

1. Open the JSON key file and copy the `client_email` value (e.g. `tenzo-ref-sheets@tenzo-ref-bot.iam.gserviceaccount.com`)
2. Open the [Customer Reference Google Sheet](https://docs.google.com/spreadsheets/d/1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4/edit?gid=541496272#gid=541496272)
3. Click **Share** (top right)
4. Paste the service account email into the "Add people" field
5. Set permission to **Viewer** (read-only is all we need)
6. Uncheck "Notify people" (it's a robot, no need to email it)
7. Click **Share**

### 2.7 Find the Sheet ID and Tab Name

The **Sheet ID** is the long string in the Google Sheet URL:

```
https://docs.google.com/spreadsheets/d/1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4/edit?gid=541496272#gid=541496272
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        This is the Sheet ID
```

The **Tab Name** is the name shown on the tab at the bottom of the spreadsheet (e.g. "Sheet1", "Customers", "Reference List"). Look at the tab you want the bot to read and use its exact name, including capitalization and spaces.

Set these in your `.env`:
```
GOOGLE_SHEETS_ID=1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4
GOOGLE_SHEETS_TAB=Sheet1
```

### 2.8 Verify the Connection

After completing the full setup, you can test the Google Sheets connection in isolation:

```bash
node -e "
  require('dotenv').config();
  const { fetchSheetData } = require('./src/sheets');
  fetchSheetData()
    .then(data => {
      console.log('Connected! Found', data.customers.length, 'rows');
      console.log('Headers:', data.headers);
      console.log('First row:', data.customers[0]);
    })
    .catch(err => console.error('Error:', err.message));
"
```

If this works, you'll see the row count and column headers from your sheet.

**Common errors at this step:**
- `Error: ENOENT: no such file or directory` — the `service-account.json` path is wrong
- `Error: The caller does not have permission` — you haven't shared the sheet with the service account email
- `Error: Requested entity was not found` — the Sheet ID or tab name is wrong
- `Error: Google Sheets API has not been enabled` — go back to step 2.2

---

## 3. Get API Keys

### 3.1 Anthropic API Key (required)

The bot uses Claude to research prospect companies and generate intelligent match explanations.

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Go to **API Keys** in the left sidebar
4. Click **Create Key**
5. Name: `tenzo-ref-bot`
6. Copy the key — it starts with `sk-ant-`
7. Save it as your `ANTHROPIC_API_KEY`

**Cost:** Each `/tenzo-ref` lookup uses roughly 1,000-2,000 tokens (~$0.01-0.02 per lookup using Sonnet).

### 3.2 Tavily API Key (optional, for web search)

Tavily provides real-time web search, which helps the bot automatically research prospect companies (find their restaurant type, location count, geography, etc.).

**Without Tavily:** The bot still works, but relies only on Claude's training knowledge to profile the prospect. For well-known chains this is fine; for smaller or newer companies, results may be less accurate.

**With Tavily:** The bot does a live web search for each prospect, giving more up-to-date and accurate profiling.

1. Go to [tavily.com](https://tavily.com/)
2. Sign up for a free account (1,000 searches/month free)
3. Copy your API key from the dashboard
4. Save it as your `TAVILY_API_KEY`

---

## 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in every value you've collected:

```bash
# Slack (from steps 1.5, 1.7, 1.8)
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token

# Google Sheets (from steps 2.5, 2.7)
GOOGLE_SHEETS_ID=1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4
GOOGLE_SHEETS_TAB=Sheet1
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account.json

# Anthropic (from step 3.1)
ANTHROPIC_API_KEY=sk-ant-your-key

# Tavily - optional (from step 3.2)
TAVILY_API_KEY=tvly-your-key
```

### Google Sheet Column Mapping

The bot maps columns by header name. If your sheet uses different column headers than the defaults below, override them:

```bash
COL_CUSTOMER_NAME=Customer Name
COL_RESTAURANT_TYPE=Type
COL_COUNTRY=Country
COL_REGION=City/Region
COL_LOCATIONS=Locations
COL_POS=POS
COL_LABOUR=Labour
COL_INVENTORY=Inventory
COL_OTHER_INTEGRATIONS=Other Integrations
COL_PRESTIGE=Prestige Tier
COL_REFERENCEABLE=Referenceable
COL_NOTES=Notes
```

For example, if your sheet has a column called "Brand" instead of "Customer Name", set:
```bash
COL_CUSTOMER_NAME=Brand
```

---

## 5. Install and Run

```bash
# Install dependencies
npm install

# Start the bot
npm start
```

For development with auto-reload on file changes:
```bash
npm run dev
```

You should see:
```
TenzoRef bot is running on port 3000
```

### Verify It's Working

1. Open Slack
2. Type `/tenzo-ref` in any channel
3. A modal should open with fields for Company Name, Lead Name, Integrations, and Salesforce Link
4. Fill in test data and submit
5. You should receive a DM from the bot with results within 15 seconds

---

## 6. Google Sheet Structure

For the bot to work, your Google Sheet should have these columns (header names are configurable via env vars — see section 4):

| Column | Description | Example |
|--------|-------------|---------|
| Customer Name | Company name | Fat Hippo |
| Type | Restaurant category | Casual Dining |
| Country | HQ country | UK |
| City/Region | Primary geography | Newcastle |
| Locations | Number of sites | 15 |
| POS | Point of sale system | Lightspeed |
| Labour | Staff scheduling tool | Deputy |
| Inventory | Inventory system | MarketMan |
| Other Integrations | Additional tech (comma-separated) | Deliverect, Uber Eats |
| Prestige Tier | 1 (highest prestige) to 5 (lowest) | 2 |
| Referenceable | Whether they can be referenced: Yes or No | Yes |
| Notes | Context for the rep | Great relationship with GM |

**Tip:** The bot reads column names from the first row (header row). Data starts from row 2. Empty cells are handled gracefully.

---

## 7. Deployment Options

For production use, the bot needs to run continuously so it can respond to Slack events.

| Option | Complexity | Cost | Notes |
|--------|-----------|------|-------|
| **Railway** | Low | ~$5/mo | `railway up` — easiest option |
| **Render** | Low | Free tier available | Background worker, add env vars in dashboard |
| **AWS EC2 / Lightsail** | Medium | ~$5/mo | Run with `pm2` or `systemd` |
| **Heroku** | Low | ~$7/mo | Add `Procfile: worker: node src/index.js` |

For any of these, you'll need to:
1. Set all the environment variables from section 4
2. Upload or securely provide the `service-account.json` file
3. Ensure the process stays running (Socket Mode requires a persistent connection)

---

## Troubleshooting

### Slack Issues

**Bot doesn't respond to `/tenzo-ref`:**
- Check that Socket Mode is enabled (step 1.5)
- Verify `SLACK_APP_TOKEN` starts with `xapp-`
- Verify the slash command was created (step 1.6)
- Check the terminal for error messages

**Modal doesn't open:**
- Check that **Interactivity** is turned on (step 1.3)
- Verify `SLACK_BOT_TOKEN` starts with `xoxb-`

**No DM received after submitting:**
- Check the `im:write` scope is added (step 1.2)
- Check the terminal for errors during processing

### Google Sheet Issues

**"ENOENT: no such file or directory":**
- The `service-account.json` file is not at the path specified in `GOOGLE_SERVICE_ACCOUNT_KEY_PATH`
- Check the file exists: `ls -la service-account.json`

**"The caller does not have permission":**
- The Google Sheet has not been shared with the service account email
- Go back to step 2.6 and share the sheet

**"Requested entity was not found":**
- The `GOOGLE_SHEETS_ID` is wrong — double-check against the URL (step 2.7)
- The `GOOGLE_SHEETS_TAB` doesn't match the exact tab name at the bottom of the sheet

**"Google Sheets API has not been enabled":**
- Go back to step 2.2 and enable the API in your Google Cloud project

**"Could not load the default credentials":**
- The `service-account.json` file is malformed or incomplete
- Re-download it from step 2.4

### API Issues

**"Invalid API Key" from Anthropic:**
- Double-check your `ANTHROPIC_API_KEY` starts with `sk-ant-`
- Verify the key is active at [console.anthropic.com](https://console.anthropic.com/)

**Research is slow or times out:**
- Without Tavily, the bot relies on Claude alone (faster but less detailed)
- Target total response time is under 15 seconds
- If consistently slow, check your network connection to the Anthropic API

---

## Security Checklist

Before going live, confirm:

- [ ] `service-account.json` is in `.gitignore` and NOT committed to the repo
- [ ] `.env` is in `.gitignore` and NOT committed to the repo
- [ ] The Google Sheet is shared as **Viewer** only (not Editor)
- [ ] API keys have appropriate rate limits set
- [ ] The Slack app is installed only in the intended workspace
