const BASE_URL = 'https://www.gotenzo.com';

// Static index of Tenzo case studies from gotenzo.com/resources/case-studies/
// This should be refreshed periodically as new case studies are published.
const CASE_STUDIES = [
  {
    customer: 'Bubala',
    type: 'restaurant',
    geography: { country: 'UK', region: 'London' },
    integrations: [],
    keyResult: 'Scaled with data confidence',
    tags: ['scaling', 'data-driven'],
    url: `${BASE_URL}/resources/case-study/from-gut-instinct-to-data-confidence-how-bubala-scales-smart-with-tenzo/`,
  },
  {
    customer: 'Teleferic Barcelona',
    type: 'restaurant',
    geography: { country: 'Spain', region: 'Barcelona' },
    integrations: [],
    keyResult: 'Built a data-driven culture',
    tags: ['data-driven', 'culture'],
    url: `${BASE_URL}/resources/case-study/building-a-data-driven-culture-at-teleferic-barcelona-with-tenzo/`,
  },
  {
    customer: 'Angelina',
    type: 'hospitality',
    geography: { country: 'UK', region: '' },
    integrations: [],
    keyResult: 'Team empowerment and operations elevation',
    tags: ['team', 'operations'],
    url: `${BASE_URL}/resources/case-study/how-angelina-uses-tenzo-to-empower-teams-and-elevate-operations/`,
  },
  {
    customer: 'ART Hospitality',
    type: 'multi_unit',
    geography: { country: 'UK', region: '' },
    integrations: ['Square'],
    keyResult: '25% growth',
    tags: ['growth', 'square'],
    url: `${BASE_URL}/resources/case-study/how-art-hospitality-combined-square-and-tenzo-to-see-25-growth/`,
  },
  {
    customer: 'MJMK',
    type: 'hospitality',
    geography: { country: 'UK', region: '' },
    integrations: [],
    keyResult: 'Mastered end-of-day reporting',
    tags: ['reporting', 'eod'],
    url: `${BASE_URL}/resources/case-study/how-mjmk-mastered-the-end-of-day-report-with-tenzo/`,
  },
  {
    customer: 'Grow Hackney',
    type: 'independent',
    geography: { country: 'UK', region: 'London' },
    integrations: ['Lightspeed'],
    keyResult: 'Preserved historical data during POS transition',
    tags: ['pos-transition', 'lightspeed', 'data-migration'],
    url: `${BASE_URL}/resources/case-study/how-tenzo-lightspeed-keeps-historical-data-during-a-pos-transition/`,
  },
  {
    customer: 'CoffeeAngel',
    type: 'coffee_cafe',
    geography: { country: 'Ireland', region: 'Dublin' },
    integrations: [],
    keyResult: 'Replaced custom BI with Tenzo',
    tags: ['bi-replacement', 'reporting', 'coffee'],
    url: `${BASE_URL}/resources/case-study/how-coffeeangel-built-their-own-bi-reporting-but-ultimately-moved-to-tenzo/`,
  },
  {
    customer: 'Fitz Group',
    type: 'multi_unit',
    geography: { country: 'UK', region: '' },
    integrations: [],
    keyResult: 'Prime costs lowered by 3 points',
    tags: ['forecasting', 'cost-reduction', 'prime-cost'],
    url: `${BASE_URL}/resources/case-study/how-tenzos-forecasting-helped-fitz-group-lower-their-prime-costs-by-3-points/`,
  },
  {
    customer: 'Fat Hippo',
    type: 'casual_dining',
    geography: { country: 'UK', region: 'Newcastle' },
    integrations: [],
    keyResult: '11% savings on bottom line',
    tags: ['cost-savings', 'bottom-line'],
    url: `${BASE_URL}/resources/case-study/how-tenzo-saves-fat-hippo-11-on-their-bottom-line/`,
  },
  {
    customer: 'Atis',
    type: 'hospitality',
    geography: { country: 'UK', region: '' },
    integrations: [],
    keyResult: 'Supercharged restaurant performance',
    tags: ['performance'],
    url: `${BASE_URL}/resources/case-study/how-tenzo-has-helped-atis-supercharge-their-restaurant-performance/`,
  },
  {
    customer: 'NONA',
    type: 'hospitality',
    geography: { country: 'Belgium', region: '' },
    integrations: [],
    keyResult: '4 operational improvements',
    tags: ['operations', 'multi-improvement'],
    url: `${BASE_URL}/resources/case-study/4-ways-tenzo-has-helped-improve-operations-at-nona/`,
  },
  {
    customer: 'Generator',
    type: 'multi_unit',
    geography: { country: 'Global', region: 'Miami' },
    integrations: [],
    keyResult: '75% reduction in reporting time',
    tags: ['reporting', 'global', 'time-savings', 'multi-location'],
    url: `${BASE_URL}/resources/case-study/how-generator-solved-their-global-reporting-problem-and-cut-down-time-spent-on-reports-by-75/`,
  },
];

// Restaurant type aliases for fuzzy matching
const TYPE_ALIASES = {
  restaurant: ['restaurant', 'dining', 'eatery'],
  casual_dining: ['casual dining', 'casual', 'fast casual'],
  fine_dining: ['fine dining', 'fine', 'upscale'],
  qsr: ['qsr', 'quick service', 'fast food'],
  coffee_cafe: ['coffee', 'cafe', 'café', 'bakery'],
  pub_bar: ['pub', 'bar', 'tavern', 'brewery'],
  hotel: ['hotel', 'hospitality', 'resort', 'accommodation'],
  multi_unit: ['multi-unit', 'group', 'chain', 'multi_unit', 'multi unit'],
  independent: ['independent', 'single', 'indie'],
  hospitality: ['hospitality'],
};

function findMatchingCaseStudies(prospectProfile) {
  const scored = CASE_STUDIES.map((cs) => {
    let score = 0;
    const reasons = [];

    // Integration match
    const prospectIntegrations = (prospectProfile.integrations || []).map((i) => i.toLowerCase());
    for (const csIntegration of cs.integrations) {
      if (prospectIntegrations.includes(csIntegration.toLowerCase())) {
        score += 30;
        reasons.push(`Uses ${csIntegration}`);
      }
    }

    // Geography match
    if (prospectProfile.geography) {
      if (cs.geography.country.toLowerCase() === (prospectProfile.geography.country || '').toLowerCase()) {
        score += 15;
        reasons.push(`Same country (${cs.geography.country})`);
      }
      if (
        cs.geography.region &&
        prospectProfile.geography.region &&
        cs.geography.region.toLowerCase() === prospectProfile.geography.region.toLowerCase()
      ) {
        score += 10;
        reasons.push(`Same region (${cs.geography.region})`);
      }
    }

    // Restaurant type match
    const prospectType = (prospectProfile.restaurant_type || '').toLowerCase();
    const csType = cs.type.toLowerCase();
    if (prospectType === csType) {
      score += 25;
      reasons.push(`Same restaurant type`);
    } else {
      // Check aliases for partial match
      for (const [canonical, aliases] of Object.entries(TYPE_ALIASES)) {
        const prospectMatches = aliases.some((a) => prospectType.includes(a));
        const csMatches = canonical === csType || aliases.some((a) => csType.includes(a));
        if (prospectMatches && csMatches) {
          score += 12;
          reasons.push(`Similar restaurant type`);
          break;
        }
      }
    }

    return { ...cs, score, reasons };
  });

  return scored
    .filter((cs) => cs.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

module.exports = { CASE_STUDIES, findMatchingCaseStudies };
