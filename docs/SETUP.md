# TenzoRef Bot - Setup Guide

## Prerequisites

- Node.js 20+
- A Slack workspace where you can install apps
- Google Cloud service account with Sheets API access
- Anthropic API key (for Claude)
- Optional: Tavily API key (for web search enrichment)

## 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**
2. Choose **From scratch**, name it `TenzoRef`, and select your workspace

### Configure Permissions

Under **OAuth & Permissions**, add these Bot Token Scopes:
- `chat:write` - Send messages
- `commands` - Handle slash commands
- `im:write` - Open DMs with users
- `app_mentions:read` - React to @mentions

### Enable Socket Mode

1. Go to **Socket Mode** and enable it
2. Generate an **App-Level Token** with `connections:write` scope
3. Save this as `SLACK_APP_TOKEN`

### Create the Slash Command

1. Go to **Slash Commands** and click **Create New Command**
2. Set:
   - Command: `/tenzo-ref`
   - Description: `Find the best customer references for a prospect`
   - Usage hint: `Opens a form to enter prospect details`

### Install the App

1. Go to **Install App** and click **Install to Workspace**
2. Copy the **Bot User OAuth Token** as `SLACK_BOT_TOKEN`
3. Copy the **Signing Secret** from **Basic Information** as `SLACK_SIGNING_SECRET`

## 2. Set Up Google Sheets Access

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the **Google Sheets API**
4. Go to **IAM & Admin > Service Accounts** and create a service account
5. Create a JSON key and download it as `service-account.json`
6. **Share the Google Sheet** with the service account email (e.g., `tenzo-ref@project.iam.gserviceaccount.com`) as a Viewer

## 3. Get API Keys

### Anthropic (required)
- Get an API key from [console.anthropic.com](https://console.anthropic.com/)

### Tavily (optional, for web search)
- Get an API key from [tavily.com](https://tavily.com/)
- This enables automatic prospect research; without it, the bot uses Claude's knowledge only

## 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...
GOOGLE_SHEETS_ID=1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4
GOOGLE_SHEETS_TAB=Sheet1
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account.json
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
```

### Google Sheet Column Mapping

If your sheet uses different column headers, override them via env vars:

```
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

## 5. Install and Run

```bash
npm install
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 6. Google Sheet Structure

For the bot to work, your Google Sheet should have these columns (header names are configurable):

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
| Prestige Tier | 1 (highest) to 5 (lowest) | 2 |
| Referenceable | Yes or No | Yes |
| Notes | Additional context | Great relationship with GM |

## Troubleshooting

**Bot doesn't respond to /tenzo-ref:**
- Check that Socket Mode is enabled
- Verify `SLACK_APP_TOKEN` starts with `xapp-`
- Check the slash command is configured correctly

**Google Sheet errors:**
- Ensure the service account email has Viewer access to the sheet
- Verify the sheet ID and tab name in your `.env`
- Check that the `service-account.json` file path is correct

**Research takes too long:**
- The bot uses Claude for research; response time depends on API latency
- Target is under 15 seconds total
- Without Tavily, research is faster but less detailed
