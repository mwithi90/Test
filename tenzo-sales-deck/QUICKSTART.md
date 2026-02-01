# Quick Start Guide

Get your Tenzo Sales Deck Generator running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
cd tenzo-sales-deck
npm install
```

## Step 2: Get Your API Keys (2 min)

### Anthropic Claude API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up (free tier available)
3. Go to API Keys and create a new key
4. Copy the key (starts with `sk-ant-`)

### Google Service Account

1. Visit [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Slides API** and **Google Drive API**
4. Go to IAM & Admin > Service Accounts
5. Click "Create Service Account"
6. Name it "tenzo-sales-deck" and click "Create"
7. Skip roles and click "Done"
8. Click on your new service account
9. Go to "Keys" tab > "Add Key" > "Create New Key" > Choose "JSON"
10. Download the JSON file and save it somewhere safe

## Step 3: Configure Environment (1 min)

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your favorite editor
nano .env
```

Add your keys:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
Paste
Your
Private
Key
Here
-----END PRIVATE KEY-----"
```

To get the Google values:
- Open the JSON file you downloaded
- Copy `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- Copy `private_key` → `GOOGLE_PRIVATE_KEY` (keep the quotes!)

## Step 4: Run the App (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test with Sample Transcript (30 seconds)

1. Click the upload area or paste the sample transcript
2. Copy the contents of `SAMPLE_TRANSCRIPT.txt`
3. Paste it into the text area
4. Click "Analyze Transcript"
5. Review the analysis
6. Click "Generate Google Slides Presentation"
7. Open your new presentation!

## Done! 🎉

You now have a working Tenzo Sales Deck Generator.

## Next Steps

- Try with a real discovery call transcript
- Customize the Tenzo knowledge base (`lib/tenzo-knowledge.ts`)
- Adjust the slide design (`lib/google-slides.ts`)
- Share with your team!

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review the troubleshooting section
- Contact your development team

---

**Pro Tip**: For best results, use transcripts that are 500+ words and explicitly mention pain points, current tools, and business context.
