# Tenzo Sales Deck Generator

AI-powered sales presentation generator for Tenzo Account Executives. Upload a discovery call transcript and automatically generate a customized Google Slides presentation tailored to your prospect's needs.

## Features

- 🤖 **AI-Powered Analysis**: Uses Anthropic Claude to analyze discovery call transcripts
- 🎯 **Smart Insights**: Automatically identifies pain points, maps to Tenzo solutions, and prioritizes demo areas
- 📊 **Google Slides Integration**: Generates professional, branded presentations in Google Slides
- 🎨 **Tenzo Branding**: Applies Tenzo brand colors and styling automatically
- ⚡ **Fast & Easy**: From transcript to presentation in under 2 minutes

## What Gets Generated

The app creates a custom presentation with:

1. **Title Slide** - Personalized with client company name
2. **Your Top Challenges** - Identified pain points from the discovery call
3. **How Tenzo Solves It** - Solutions mapped to each pain point (multiple slides)
4. **Key Demo Areas** - Prioritized list of features to demonstrate
5. **Next Steps** - Call to action

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- **Anthropic API key** (for Claude AI)
- **Google Service Account** (for Google Slides API)

## Setup Instructions

### 1. Install Dependencies

```bash
cd tenzo-sales-deck
npm install
```

### 2. Get API Keys

#### Anthropic Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

#### Google Service Account (for Google Slides)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable these APIs:
   - Google Slides API
   - Google Drive API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name it "tenzo-sales-deck"
   - Click "Create and Continue"
   - Skip roles and permissions (click "Continue" then "Done")
5. Generate a key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the JSON file
6. Extract these values from the JSON file:
   - `client_email` → GOOGLE_SERVICE_ACCOUNT_EMAIL
   - `private_key` → GOOGLE_PRIVATE_KEY

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
Your
Private
Key
Here
-----END PRIVATE KEY-----"
```

**Important**: Keep the quotes around the private key and preserve the line breaks.

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Step 1: Upload Transcript

- Drag and drop a transcript file (.txt, .pdf, .docx)
- OR paste the transcript directly into the text area
- Click "Analyze Transcript"

### Step 2: Review Analysis

The app will show:
- Client context (company name, type, locations, current tools)
- Identified pain points (sorted by severity)
- How Tenzo solves each pain
- Recommended demo areas
- Competitive insights

Review the analysis and click "Generate Google Slides Presentation"

### Step 3: Get Your Presentation

- Preview the generated slides in the embedded viewer
- Copy the shareable link
- Open in Google Slides to edit and customize
- Share with your prospect

## Tips for Best Results

### Transcript Quality

- **Minimum length**: 50 characters (though 500+ words is better)
- **Include key details**: Company name, restaurant type, number of locations
- **Capture pains clearly**: Make sure challenges are explicitly mentioned
- **Note current tools**: Mention what systems they're currently using

### Example Good Transcript

```
AE: Thanks for joining, can you tell me about your operation?

Prospect: We're Pizza Palace, a casual dining chain with 15 locations across the northeast. Currently using Lightspeed POS and Excel for our reporting.

AE: What are your biggest challenges right now?

Prospect: Our finance team spends hours every week compiling sales data from each location into Excel. By the time we have the reports ready, the week is already over. We can't react fast enough to problems. Also, our labor costs are way over budget because we're just guessing at how to schedule staff.

AE: How are you handling forecasting currently?

Prospect: We're not, really. Managers use their best guess based on last year. But we've had a lot of variability with weather and local events that we're not accounting for.
```

This transcript would generate excellent insights because it clearly identifies:
- Company details (Pizza Palace, 15 locations)
- Current tools (Lightspeed, Excel)
- Pain points (manual reporting, delayed insights, labor costs, poor forecasting)
- Specific problems (week-old data, over-budget labor, lack of forecasting)

## Customization

### Updating Tenzo Product Knowledge

Edit `/lib/tenzo-knowledge.ts` to:
- Add new features
- Update integration list
- Modify competitive positioning
- Add new use cases

### Modifying Slide Design

Edit `/lib/google-slides.ts` to:
- Change colors (update `TENZO_COLORS`)
- Modify slide layouts
- Add new slide types
- Customize text and formatting

### Adjusting AI Analysis

Edit `/lib/prompts.ts` to:
- Change how Claude analyzes transcripts
- Modify the output structure
- Add new analysis categories

## Troubleshooting

### "ANTHROPIC_API_KEY not set"

- Make sure `.env` file exists in project root
- Check the variable name is exactly `ANTHROPIC_API_KEY`
- Restart the dev server after changing `.env`

### "Google Service Account credentials not configured"

- Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` are in `.env`
- Check that private key has proper line breaks (should start with `-----BEGIN PRIVATE KEY-----`)
- Make sure both APIs are enabled in Google Cloud Console

### Analysis returns empty or poor results

- Check transcript is detailed enough (500+ words recommended)
- Ensure pain points are explicitly stated (not implied)
- Verify API key is valid and has credits

### Slides generation fails

- Confirm both Google Slides API and Google Drive API are enabled
- Check service account has proper permissions
- Verify private key format is correct in `.env`

### Rate limit errors

- Anthropic Claude has rate limits on free tier
- Wait a few minutes and try again
- Consider upgrading to paid tier for production use

## Development

### Project Structure

```
tenzo-sales-deck/
├── app/
│   ├── api/
│   │   ├── analyze-transcript/    # Claude analysis endpoint
│   │   └── generate-slides/       # Google Slides generation endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main UI
├── components/
│   ├── ui/
│   │   └── button.tsx             # Button component
│   ├── AnalysisResults.tsx        # Analysis display
│   ├── PresentationPreview.tsx    # Final presentation view
│   └── TranscriptUpload.tsx       # Upload interface
├── lib/
│   ├── claude.ts                  # Claude API integration
│   ├── google-slides.ts           # Google Slides API integration
│   ├── prompts.ts                 # AI prompt templates
│   └── tenzo-knowledge.ts         # Tenzo product data
├── types/
│   └── index.ts                   # TypeScript types
└── .env                           # Environment variables (create this)
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Slides**: Google Slides API
- **Deployment**: Vercel (recommended)

## Deployment (Optional)

To deploy to Vercel:

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Note**: Make sure to add all environment variables from `.env` to Vercel's environment variables settings.

## Cost Estimates

### Per Presentation

- **Claude API**: ~$0.05-0.10 per analysis (depending on transcript length)
- **Google Slides API**: Free (subject to quotas)

### Monthly (assuming 100 presentations)

- **Total**: ~$5-10/month
- Very affordable for team use

## Security Notes

- **Never commit `.env` file** to git (already in `.gitignore`)
- Service account has minimal permissions (only creates files)
- API keys should be kept confidential
- Generated presentations are set to "anyone with link" by default

## Support

For questions or issues:
1. Check this README
2. Review the troubleshooting section
3. Contact your development team

## License

Proprietary - For Tenzo internal use only

---

**Built with ❤️ for Tenzo Account Executives**
