# Product Requirements Document: Tenzo Reference Finder Slack Bot

**Author:** Product Team
**Date:** 2026-02-06
**Status:** Draft v1.0

---

## 1. Problem Statement

Tenzo's sales reps need to quickly identify which existing customers are the best references when speaking to a new lead. Today this is a manual process: reps must search through spreadsheets, recall past conversations, and guess which customer stories will resonate. This wastes time, leads to inconsistent reference selection, and misses opportunities to use our strongest proof points.

## 2. Solution Overview

A Slack bot (`@tenzo-ref` or `/tenzo-ref`) that a sales rep can message with details about a prospect. The bot will:

1. Accept prospect information from the rep
2. Research the prospect company automatically
3. Scan the internal Google Sheet of current customers
4. Return up to **5 best-fit reference customers**, ranked by relevance
5. Surface any matching **case studies** from gotenzo.com

---

## 3. User Flow

```
Rep in Slack                        Bot
    |                                |
    |-- /tenzo-ref ------------------>|
    |                                |-- Opens modal form
    |<-- Modal: input fields --------|
    |                                |
    |-- Submits:                     |
    |   - Company Name               |
    |   - Lead Name                  |
    |   - Integrations (multi-select)|
    |   - SF Link (optional)         |
    |                                |
    |                                |-- 1. Research prospect (web + AI)
    |                                |-- 2. Query Google Sheet
    |                                |-- 3. Score & rank matches
    |                                |-- 4. Find relevant case studies
    |                                |
    |<-- Results card: --------------|
    |   Top 5 references             |
    |   Relevant case studies         |
    |   Prospect summary              |
```

## 4. Detailed Requirements

### 4.1 Slack Interface

**Trigger:** Slash command `/tenzo-ref` or app mention `@TenzoRef`

**Input Modal (Slack Block Kit):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Company Name | Text input | Yes | Prospect's company name |
| Lead Name | Text input | Yes | Contact name at the prospect |
| Integrations | Multi-select | Yes | Dropdown of known integrations (POS, labour, inventory, etc.) |
| Salesforce Link | URL input | No | Link to the Salesforce opportunity or lead |

**Integration Options (pre-populated in multi-select):**

*POS Systems:*
- Lightspeed, Square, Toast, Oracle Micros, Zonal, Tevalis, iKentoo, Clover, Aloha, Revel, TouchBistro, Epos Now

*Labour/Scheduling:*
- Planday, Deputy, 7Shifts, Bizimply, Harri, S4Labour, Workforce.com, Homebase, HotSchedules

*Inventory:*
- MarketMan, Procure Wizard, MarginEdge, BlueCart, Apicbase

*Other:*
- Deliverect, Uber Eats, Deliveroo, Just Eat, OpenTable, ResDiary, SevenRooms

### 4.2 Prospect Research

On submission, the bot should:

1. **Web search** the company name to determine:
   - Type of restaurant/hospitality business (QSR, casual dining, fine dining, coffee/cafe, pub/bar, hotel F&B, ghost kitchen, multi-unit group)
   - Geography (country, city/region)
   - Approximate number of locations
   - Any publicly known tech stack info
2. **Enrich with AI** - Use Claude to synthesize research into a structured prospect profile

**Output: Prospect Profile Object**
```json
{
  "company_name": "Example Bistro",
  "lead_name": "Jane Smith",
  "integrations": ["Lightspeed", "Planday", "MarketMan"],
  "restaurant_type": "casual_dining",
  "geography": {
    "country": "UK",
    "region": "London"
  },
  "estimated_locations": 12,
  "salesforce_url": "https://...",
  "research_summary": "12-location casual dining group in London..."
}
```

### 4.3 Google Sheet Scanning

**Source:** [Customer Reference Sheet](https://docs.google.com/spreadsheets/d/1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4/edit?gid=541496272#gid=541496272)

The bot reads the Google Sheet via the Google Sheets API. Expected columns (to be confirmed once sheet access is granted):

| Expected Column | Used For |
|----------------|----------|
| Customer Name | Display in results |
| Restaurant Type | Matching criteria |
| Geography / Country / Region | Matching criteria |
| Integrations / Tech Stack | Matching criteria |
| Number of Locations | Context + prestige signal |
| Prestige / Tier | Ranking weight |
| NPS / Satisfaction Score | Willingness to reference |
| Notes / Contact | Rep context |

**Important:** The sheet column mapping should be configurable via environment variables or a config file, since the sheet structure may change.

### 4.4 Scoring Algorithm

Each customer in the sheet is scored against the prospect profile. The algorithm uses weighted criteria:

| Criterion | Weight | Logic |
|-----------|--------|-------|
| **Integration Match** | 35% | % of prospect's integrations that match the customer's stack. Exact POS match scores highest. |
| **Restaurant Type** | 25% | Exact match = full score. Adjacent types (e.g., casual dining / fast casual) = partial score. |
| **Geography** | 20% | Same country = partial. Same region/city = full. International prospects match with same-region customers. |
| **Prestige** | 15% | Higher-profile brands score higher. Based on: brand recognition, location count, any "logo" tier designation in the sheet. |
| **Reference Readiness** | 5% | NPS/satisfaction score if available. Customers who have done case studies get a bonus. |

**Output:** Top 5 customers, sorted by composite score.

### 4.5 Case Study Matching

The bot maintains a local index of Tenzo case studies (scraped/cached from gotenzo.com). Current case studies:

| Customer | Type | Key Result | URL |
|----------|------|------------|-----|
| Bubala | Restaurant | Scaled with data confidence | /resources/case-study/from-gut-instinct-to-data-confidence-how-bubala-scales-smart-with-tenzo/ |
| Teleferic Barcelona | Restaurant/Bar | Data-driven culture | /resources/case-study/building-a-data-driven-culture-at-teleferic-barcelona-with-tenzo/ |
| Angelina | Hospitality | Team empowerment | /resources/case-study/how-angelina-uses-tenzo-to-empower-teams-and-elevate-operations/ |
| ART Hospitality | Multi-unit (Square) | 25% growth | /resources/case-study/how-art-hospitality-combined-square-and-tenzo-to-see-25-growth/ |
| MJMK | Hospitality | EOD reporting | /resources/case-study/how-mjmk-mastered-the-end-of-day-report-with-tenzo/ |
| Grow Hackney | Independent (Lightspeed) | POS transition | /resources/case-study/how-tenzo-lightspeed-keeps-historical-data-during-a-pos-transition/ |
| CoffeeAngel | Coffee/Cafe | BI replacement | /resources/case-study/how-coffeeangel-built-their-own-bi-reporting-but-ultimately-moved-to-tenzo/ |
| Fitz Group | Multi-unit | Prime costs -3pts | /resources/case-study/how-tenzos-forecasting-helped-fitz-group-lower-their-prime-costs-by-3-points/ |
| Fat Hippo | Restaurant | 11% bottom line savings | /resources/case-study/how-tenzo-saves-fat-hippo-11-on-their-bottom-line/ |
| Atis | Hospitality | Performance boost | /resources/case-study/how-tenzo-has-helped-atis-supercharge-their-restaurant-performance/ |
| NONA | Hospitality | 4 operational improvements | /resources/case-study/4-ways-tenzo-has-helped-improve-operations-at-nona/ |
| Generator | Multi-location (global) | 75% less reporting time | /resources/case-study/how-generator-solved-their-global-reporting-problem-and-cut-down-time-spent-on-reports-by-75/ |

Case studies are matched if they share integrations, geography, or restaurant type with the prospect.

### 4.6 Response Format

The bot replies in the same Slack channel/DM with a rich Block Kit message:

```
---------------------------------------------
REFERENCE FINDER: [Prospect Company Name]
Lead: [Lead Name]
Profile: [Restaurant Type] | [Geography] | [X locations]
Integrations: Lightspeed, Planday, MarketMan
SF: [link if provided]
---------------------------------------------

RECOMMENDED REFERENCES (ranked):

1. [Customer Name] - Score: 92/100
   Type: Casual Dining | London, UK | 24 locations
   Shared Stack: Lightspeed, Planday
   Why: Same POS, same city, similar size casual dining group

2. [Customer Name] - Score: 87/100
   Type: QSR | Manchester, UK | 15 locations
   Shared Stack: Lightspeed
   Why: Same POS, UK-based QSR chain, strong brand name

3. ...

---------------------------------------------

RELEVANT CASE STUDIES:

- Fat Hippo: 11% bottom-line savings (link)
  Match: Same restaurant type, UK geography

- Fitz Group: Prime costs lowered by 3 points (link)
  Match: Multi-unit group, forecasting focus

---------------------------------------------
Powered by TenzoRef | Data refreshed: [timestamp]
```

---

## 5. Technical Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Slack API   │────>│  Tenzo Ref Bot   │────>│  Google Sheets  │
│  (Bolt SDK)  │<────│  (Node.js)       │<────│  API            │
└─────────────┘     │                  │     └─────────────────┘
                    │                  │
                    │  ┌───────────┐   │     ┌─────────────────┐
                    │  │ Scoring   │   │────>│  Claude API     │
                    │  │ Engine    │   │<────│  (Research +    │
                    │  └───────────┘   │     │   Matching)     │
                    │                  │     └─────────────────┘
                    │  ┌───────────┐   │
                    │  │ Case Study│   │     ┌─────────────────┐
                    │  │ Index     │   │────>│  Web Search     │
                    │  └───────────┘   │<────│  (Prospect      │
                    └──────────────────┘     │   Research)     │
                                            └─────────────────┘
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Runtime | Node.js 20+ | Slack Bolt SDK is best supported in JS/TS |
| Slack SDK | @slack/bolt | Official Slack framework |
| Google Sheets | googleapis | Official Google API client |
| AI | @anthropic-ai/sdk (Claude) | Prospect research + intelligent matching |
| Web Research | Tavily or Serper API | Company enrichment |
| Hosting | Railway / Render / AWS Lambda | Lightweight, always-on for Slack events |
| Config | dotenv | Environment-based configuration |

### Environment Variables

```
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_APP_TOKEN=xapp-...  (for Socket Mode)
GOOGLE_SHEETS_ID=1Jz22zQDeEiUYuM5F-EYn8YXNt3lzKuArgqIxI6sE5H4
GOOGLE_SHEETS_TAB=... (sheet/tab name)
GOOGLE_SERVICE_ACCOUNT_KEY=... (path to service account JSON)
ANTHROPIC_API_KEY=sk-ant-...
WEB_SEARCH_API_KEY=... (Tavily or Serper)
```

---

## 6. Data Flow

1. **Rep triggers** `/tenzo-ref` in Slack
2. **Modal opens** with input fields
3. **Rep submits** company info
4. **Bot acknowledges** with "Researching [Company]..." message
5. **Parallel execution:**
   - a. Web search for prospect company info
   - b. Fetch latest data from Google Sheet
6. **AI processing:**
   - Claude receives prospect info + web research + sheet data
   - Generates prospect profile
   - Scores each customer against the prospect
   - Selects top 5 + matching case studies
7. **Bot posts** formatted results back to Slack
8. **Total time target:** < 15 seconds from submission to response

---

## 7. Google Sheet Requirements

For this system to work, the Google Sheet needs to contain (at minimum):

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
| Other Integrations | Additional tech | Deliverect, Uber Eats |
| Prestige Tier | Logo tier (1-5) | 3 |
| Referenceable | Yes/No | Yes |
| Notes | Additional context | Great relationship with GM |

**Access:** The sheet must be shared with the bot's Google service account email.

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Usage | 80%+ of reps use it weekly | Slack analytics |
| Time saved | 15+ min per prospect research | Rep survey |
| Reference quality | Reps rate suggestions as relevant 4/5+ | Feedback buttons in bot |
| Response time | < 15 seconds | Bot telemetry |
| Adoption | Used for 90%+ of new opportunities | CRM correlation |

---

## 9. Future Enhancements (v2+)

- **Salesforce integration:** Auto-pull prospect info from SF when link is provided
- **Feedback loop:** "Was this helpful?" buttons that improve future scoring
- **Auto-logging:** Write the reference suggestions back to the SF opportunity
- **Team notifications:** Alert CSMs when their customer is being used as a reference
- **Reference fatigue tracking:** Flag customers being referenced too often
- **CRM enrichment:** Pull lead/opp data directly from Salesforce instead of manual input
- **Competitor intel:** Surface competitive displacement stories when prospect uses a competitor product

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Google Sheet data is stale | Poor recommendations | Add "last updated" tracking; prompt ops team to refresh |
| Prospect research returns wrong company | Wrong recommendations | Show research summary so rep can verify; add "refine" button |
| Sheet column structure changes | Bot breaks | Use configurable column mapping, not hardcoded indices |
| Rate limits on APIs | Slow/failed responses | Cache sheet data (refresh every 5 min), queue requests |
| Rep enters minimal info | Lower match quality | Make key fields required; use AI to infer from company name |

---

## 11. Implementation Phases

### Phase 1: MVP (Week 1-2)
- Slash command + modal input
- Google Sheet reading
- Basic scoring (integration match + geography + type)
- Static case study index
- Formatted Slack response

### Phase 2: Intelligence (Week 3-4)
- AI-powered prospect research
- Claude-enhanced scoring and "why" explanations
- Dynamic case study matching
- Prestige weighting

### Phase 3: Polish (Week 5-6)
- Feedback buttons
- Error handling + edge cases
- Analytics dashboard
- Salesforce link parsing
- Documentation + onboarding
