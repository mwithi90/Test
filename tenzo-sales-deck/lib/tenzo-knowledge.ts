import type {
  TenzoFeature,
  TenzoIntegration,
  Competitor,
  TenzoPillar,
} from "@/types";

// ============================================================================
// TENZO PRODUCT OVERVIEW
// ============================================================================

export const TENZO_OVERVIEW = {
  name: "Tenzo",
  tagline: "Tenzo powers restaurant performance",
  description:
    "Bring your tech stack together in one place, get meaningful recommendations on how to hit targets.",
  industry: "Restaurant management and hospitality operations",
  customers: "250+ companies across 1,500+ locations globally",
  targetRoles: [
    "CEOs/founders",
    "Operations managers",
    "Finance teams",
    "General managers",
    "IT departments",
    "Hospitality consultants",
  ],
};

// ============================================================================
// FOUR PILLARS OF TENZO
// ============================================================================

export const TENZO_PILLARS: Record<TenzoPillar, { description: string; capabilities: string[] }> = {
  "Data Aggregation": {
    description: "ETL data from core systems into our data warehouse",
    capabilities: [
      "Real-time data integration when possible",
      "Automated data maintenance",
      "70+ platform integrations",
      "Integration with sales systems, labor management, inventory, reviews, and external factors (weather, events)",
    ],
  },
  "BI Tool": {
    description: "Build custom dashboards and reports",
    capabilities: [
      "Custom dashboard and report creation",
      "Financial calendar customization",
      "Location hierarchy and area creation",
      "Sales target uploads",
      "Scheduled email reports",
    ],
  },
  "Decision Enablement": {
    description: "Drive action with operators through alerts and mobile app",
    capabilities: [
      "Real-time alerts for operators",
      "Mobile app for on-the-go access",
      "Chat with data / democratize data access",
      "Tailored experience for each user group",
    ],
  },
  "Demand Forecasting": {
    description: "AI Machine Learning forecasts for labor optimization",
    capabilities: [
      "AI-powered demand forecasting",
      "Weather, events, and holiday consideration",
      "Historical sales pattern analysis",
      "Push forecasts to Deputy, Planday, and Workforce",
    ],
  },
};

// ============================================================================
// KEY FEATURES & CAPABILITIES
// ============================================================================

export const TENZO_FEATURES: TenzoFeature[] = [
  {
    name: "Real-Time Data Aggregation",
    pillar: "Data Aggregation",
    description: "Automatically sync data from 70+ platforms in real-time",
    benefits: [
      "No manual data entry or compilation",
      "Always up-to-date insights",
      "Eliminate data errors from manual processes",
    ],
    useCases: [
      "Multi-location operators need consolidated view",
      "Finance teams tired of Excel compilation",
      "Operators using multiple disconnected systems",
    ],
  },
  {
    name: "Custom Dashboards & Reports",
    pillar: "BI Tool",
    description: "Build tailored dashboards for different teams and use cases",
    benefits: [
      "See exactly the metrics that matter to you",
      "No dependency on IT or consultants for changes",
      "Financial calendar alignment",
    ],
    useCases: [
      "CEOs wanting executive overview",
      "Operations managers tracking KPIs by location",
      "Finance teams with custom reporting periods",
    ],
  },
  {
    name: "Automated Alerts & Notifications",
    pillar: "Decision Enablement",
    description: "Proactive alerts when metrics deviate from targets",
    benefits: [
      "React to issues in real-time, not after the fact",
      "Reduce time spent manually checking reports",
      "Mobile app keeps managers informed anywhere",
    ],
    useCases: [
      "General managers need to know about problems immediately",
      "Operations teams managing multiple locations",
      "Finance teams monitoring budget variances",
    ],
  },
  {
    name: "AI Demand Forecasting",
    pillar: "Demand Forecasting",
    description:
      "Machine learning forecasts considering weather, events, holidays",
    benefits: [
      "Optimize labor scheduling",
      "Reduce over/under staffing",
      "Improve profit margins",
    ],
    useCases: [
      "Labor is the biggest controllable cost",
      "Locations with variable demand patterns",
      "Operators using Deputy, Planday, or Workforce",
    ],
  },
  {
    name: "Chat with Data",
    pillar: "Decision Enablement",
    description: "Democratize data access through conversational interface",
    benefits: [
      "Anyone can get answers without knowing SQL or BI tools",
      "Reduce bottlenecks on data/analytics teams",
      "Empower frontline managers with insights",
    ],
    useCases: [
      "GMs want quick answers without calling HQ",
      "Operations teams with varying technical skills",
      "Growing teams that need to scale data access",
    ],
  },
];

// ============================================================================
// INTEGRATIONS
// ============================================================================

export const TENZO_INTEGRATIONS: TenzoIntegration[] = [
  // POS Systems
  { name: "Lightspeed", category: "POS" },
  { name: "Square", category: "POS" },
  { name: "Toast", category: "POS" },
  { name: "Zonal", category: "POS" },

  // Labor Management
  { name: "Planday", category: "Labor" },
  { name: "Deputy", category: "Labor" },
  { name: "Workforce", category: "Labor" },
  { name: "Fourth Labour", category: "Labor" },
  { name: "Harri", category: "Labor" },

  // Inventory
  { name: "Marketman", category: "Inventory" },
  { name: "Fourth Inventory", category: "Inventory" },
  { name: "Nory", category: "Inventory" },
  {
    name: "Zonal",
    category: "Inventory",
    limitations: "Limited - purchases only, no theoretical usage or waste",
  },
  {
    name: "Apicbase",
    category: "Inventory",
    limitations: "Limited - purchases only",
  },
  {
    name: "Comtrex",
    category: "Inventory",
    limitations: "Limited - purchases only",
  },
  {
    name: "Tevalis",
    category: "Inventory",
    limitations: "Limited - purchases only",
  },

  // Other
  { name: "Reservations platforms", category: "Reservations" },
  { name: "Review platforms", category: "Reviews" },
  { name: "Weather data", category: "External Data" },
  { name: "Events data", category: "External Data" },
];

// ============================================================================
// WHAT NOT TO SAY (LIMITATIONS)
// ============================================================================

export const TENZO_LIMITATIONS = {
  data: ["We do not connect to accounting tools"],
  forecasting: [
    "We do not guarantee forecast accuracy",
    "We do not forecast specific items to be sold",
    "We do not help with bakery prep plans",
  ],
  inventory: [
    "Zonal, Apicbase, Comtrex, and Tevalis are limited integrations",
    "We only receive purchase information from limited integrations",
    "No theoretical usage, waste, or detailed inventory management from limited integrations",
  ],
};

// ============================================================================
// COMPETITIVE LANDSCAPE
// ============================================================================

export const COMPETITORS: Competitor[] = [
  {
    name: "Excel",
    type: "Excel",
    strengths: ["Free", "Flexible", "Powerful", "Familiar to finance teams"],
    weaknesses: [
      "Complex to maintain",
      "Slow and time-consuming",
      "Error-prone manual processes",
      "No real-time updates",
      "Difficult to scale across locations",
    ],
    tenzoAdvantages: [
      "Automated data aggregation eliminates manual work",
      "Real-time updates vs. periodic manual updates",
      "No risk of formula errors or data entry mistakes",
      "Built-in collaboration and access control",
      "Scales effortlessly to hundreds of locations",
    ],
  },
  {
    name: "All-in-One (Nory, R365, Crunchtime, Fourth)",
    type: "All-in-One",
    strengths: [
      "Bundled pricing",
      "Some automation",
      "Improved reporting over Excel",
      "Single vendor relationship",
    ],
    weaknesses: [
      "Often lacks ALL integrations needed (reservations, reviews, etc.)",
      "Cannot always build custom reports",
      "Not great reporting capabilities",
      "Must use their entire tech stack",
      "Limited flexibility",
    ],
    tenzoAdvantages: [
      "Work with your existing best-of-breed tech stack",
      "70+ integrations vs. limited all-in-one options",
      "Powerful custom reporting and dashboards",
      "Not locked into one vendor's full suite",
      "Best-in-class BI capabilities",
    ],
  },
  {
    name: "Traditional BI (Power BI, Tableau with consultants)",
    type: "Traditional BI",
    strengths: [
      "Powerful and customizable",
      "Lots of advanced capabilities",
      "Can integrate with anything (with work)",
      "Promise of lower long-term costs",
    ],
    weaknesses: [
      "Very complex to use",
      "Expensive to maintain integrations",
      "6+ months to set up",
      "Difficult to change underlying systems (new integrations needed)",
      "Requires technical expertise",
      "Consultant dependency (e.g., Tahola in UK)",
    ],
    tenzoAdvantages: [
      "Hospitality-specific, not generic BI",
      "Pre-built integrations maintained by Tenzo",
      "Quick setup (weeks, not months)",
      "Easy to use - no SQL or technical skills required",
      "We manage integration updates when systems change",
      "Purpose-built for restaurant operators, not data scientists",
    ],
  },
  {
    name: "Direct BI Competitors (Ingest.ai, Ezora)",
    type: "Direct BI Competitor",
    strengths: [
      "Often cheaper than Tenzo",
      "May integrate with accounting platforms",
    ],
    weaknesses: [
      "Fewer integrations",
      "Less mature product",
      "Smaller customer base and proof points",
    ],
    tenzoAdvantages: [
      "250+ companies, 1,500+ locations proven at scale",
      "70+ integrations vs. limited competitor options",
      "Four comprehensive pillars (not just BI)",
      "AI demand forecasting included",
      "Decision enablement features (alerts, mobile, chat)",
    ],
  },
];

// ============================================================================
// KEY PARTNERS & TOOLS
// ============================================================================

export const KEY_PARTNERS = [
  {
    name: "Lightspeed",
    note: "Awful reporting. Can't see all sites in one place",
    opportunity: "Huge reporting needs here - perfect fit for Tenzo",
  },
  {
    name: "Zonal",
    note: "Will often sell customers a Power BI solution connected to Zonal Stock and POS",
    opportunity:
      "They may have a reporting solution, but Tenzo is more user-friendly and hospitality-focused",
  },
  {
    name: "Fourth",
    note: "Sells an array of products including Fourth Labour, Inventory, and Analytics",
    opportunity:
      "Fourth Analytics is very clunky and we can beat this - position as better alternative",
  },
  {
    name: "Harri",
    note: "Sells their own forecasting product",
    opportunity:
      "Customer may want to stick with Harri forecasting - position Tenzo's other pillars",
  },
  {
    name: "Nory",
    note: "All-in-one labour and inventory tool. Inexpensive",
    opportunity:
      "Hard to win, but Nory does not have ability to build custom reports - highlight this gap",
  },
  {
    name: "Marketman",
    note: "Inventory tool with poor reporting",
    opportunity: "We can add a lot of value - strong reporting needs",
  },
];

// ============================================================================
// COMMON USE CASES & PAIN POINTS
// ============================================================================

export const COMMON_PAIN_POINTS = [
  {
    pain: "Spending hours compiling data from multiple systems into Excel",
    category: "Data Aggregation" as TenzoPillar,
    indicators: [
      "Manual exports",
      "Weekly reporting process",
      "Finance team doing data entry",
      "VLOOKUPs and pivot tables breaking",
    ],
    solution: "Real-time data aggregation from all systems automatically",
  },
  {
    pain: "Can't see all locations in one place",
    category: "BI Tool" as TenzoPillar,
    indicators: [
      "Multi-location operator",
      "Using systems with poor multi-site reporting",
      "Creating separate reports for each location",
    ],
    solution:
      "Custom dashboards showing all locations with hierarchy and areas",
  },
  {
    pain: "Reporting doesn't match our financial calendar or structure",
    category: "BI Tool" as TenzoPillar,
    indicators: [
      "Fiscal periods don't match calendar months",
      "Custom week definitions",
      "Specific area groupings needed",
    ],
    solution: "Fully customizable financial calendars and location hierarchies",
  },
  {
    pain: "Labor costs are out of control",
    category: "Demand Forecasting" as TenzoPillar,
    indicators: [
      "Over/under staffing",
      "Relying on managers' gut feel for scheduling",
      "Labor % above targets",
      "Using Deputy, Planday, or Workforce",
    ],
    solution:
      "AI demand forecasting that pushes optimal schedules to labor platforms",
  },
  {
    pain: "Problems discovered too late - after the week/month is over",
    category: "Decision Enablement" as TenzoPillar,
    indicators: [
      "Reactive management",
      "Weekly review meetings",
      "Issues only found in reports days later",
    ],
    solution:
      "Real-time alerts and mobile app so managers know about issues immediately",
  },
  {
    pain: "Data locked up - only analysts can get answers",
    category: "Decision Enablement" as TenzoPillar,
    indicators: [
      "IT/analytics bottleneck",
      "Managers waiting for reports",
      "Can't self-serve data",
    ],
    solution:
      "Chat with data democratizes access - anyone can get answers",
  },
  {
    pain: "Current BI tool is too complex to use",
    category: "BI Tool" as TenzoPillar,
    indicators: [
      "Power BI or Tableau implementation",
      "Only technical people can build reports",
      "Consultant dependency",
    ],
    solution:
      "Purpose-built for restaurant operators, not data scientists - easy to use",
  },
  {
    pain: "Integrations keep breaking when systems update",
    category: "Data Aggregation" as TenzoPillar,
    indicators: [
      "Custom-built integrations",
      "Consultant maintaining connections",
      "Data pipelines failing",
    ],
    solution: "Tenzo maintains all integrations - we handle updates",
  },
  {
    pain: "Setup took forever and cost a fortune",
    category: "Data Aggregation" as TenzoPillar,
    indicators: [
      "6+ months implementation",
      "High consultant costs",
      "Still not fully operational",
    ],
    solution: "Quick setup in weeks, not months - pre-built integrations",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get Tenzo advantages over a specific competitor
 */
export function getTenzoAdvantages(competitorName: string): string[] {
  const competitor = COMPETITORS.find(
    (c) => c.name.toLowerCase().includes(competitorName.toLowerCase())
  );
  return competitor?.tenzoAdvantages || [];
}

/**
 * Map a pain point description to likely Tenzo solution
 */
export function mapPainToSolution(painDescription: string): {
  pillar: TenzoPillar;
  features: TenzoFeature[];
  solution: string;
} | null {
  const lowerPain = painDescription.toLowerCase();

  // Check each common pain point
  for (const commonPain of COMMON_PAIN_POINTS) {
    // Simple keyword matching - could be enhanced with better NLP
    const keywords = commonPain.indicators.join(" ").toLowerCase();
    if (
      lowerPain.includes(commonPain.pain.toLowerCase().slice(0, 20)) ||
      commonPain.indicators.some((indicator) =>
        lowerPain.includes(indicator.toLowerCase())
      )
    ) {
      const relatedFeatures = TENZO_FEATURES.filter(
        (f) => f.pillar === commonPain.category
      );
      return {
        pillar: commonPain.category,
        features: relatedFeatures,
        solution: commonPain.solution,
      };
    }
  }

  return null;
}

/**
 * Get relevant demo areas based on identified pain points
 */
export function getDemoAreasForPains(pains: string[]): string[] {
  const demoAreas = new Set<string>();

  pains.forEach((pain) => {
    const mapped = mapPainToSolution(pain);
    if (mapped) {
      mapped.features.forEach((feature) => {
        demoAreas.add(feature.name);
      });
    }
  });

  return Array.from(demoAreas);
}
