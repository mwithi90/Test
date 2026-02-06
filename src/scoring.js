const config = require('./config');

// Restaurant type adjacency map - types that are "close enough" for partial matching
const TYPE_ADJACENCY = {
  qsr: ['casual_dining', 'ghost_kitchen'],
  casual_dining: ['qsr', 'restaurant', 'pub_bar'],
  fine_dining: ['restaurant', 'hospitality'],
  coffee_cafe: ['bakery', 'independent'],
  pub_bar: ['casual_dining', 'restaurant', 'brewery'],
  hotel: ['hospitality', 'multi_unit'],
  multi_unit: ['hotel', 'hospitality'],
  independent: ['coffee_cafe', 'restaurant'],
  hospitality: ['hotel', 'multi_unit', 'fine_dining'],
  ghost_kitchen: ['qsr', 'delivery'],
  bakery: ['coffee_cafe', 'independent'],
  restaurant: ['casual_dining', 'fine_dining', 'pub_bar'],
};

function scoreCustomer(customer, prospect) {
  const weights = config.scoring.weights;
  const breakdown = {};

  // 1. Integration Match (35%)
  const prospectIntegrations = prospect.integrations.map((i) => i.toLowerCase());
  const customerIntegrations = customer.integrations; // already lowercased
  let integrationMatches = 0;
  const sharedIntegrations = [];

  for (const pi of prospectIntegrations) {
    for (const ci of customerIntegrations) {
      if (ci.includes(pi) || pi.includes(ci)) {
        integrationMatches++;
        // Find the raw (display) name
        const rawIdx = customer.integrations.indexOf(ci);
        sharedIntegrations.push(customer.integrationsRaw[rawIdx] || ci);
        break;
      }
    }
  }

  const integrationScore = prospectIntegrations.length > 0
    ? (integrationMatches / prospectIntegrations.length) * 100
    : 0;
  breakdown.integrations = { score: integrationScore, shared: sharedIntegrations };

  // 2. Restaurant Type Match (25%)
  let typeScore = 0;
  const prospectType = prospect.restaurant_type?.toLowerCase() || '';
  const customerType = customer.restaurantType;

  if (prospectType && customerType) {
    if (prospectType === customerType) {
      typeScore = 100;
    } else if (
      TYPE_ADJACENCY[prospectType]?.includes(customerType) ||
      TYPE_ADJACENCY[customerType]?.includes(prospectType)
    ) {
      typeScore = 50;
    } else if (prospectType.includes(customerType) || customerType.includes(prospectType)) {
      typeScore = 40;
    }
  }
  breakdown.restaurantType = { score: typeScore };

  // 3. Geography Match (20%)
  let geoScore = 0;
  const prospectCountry = prospect.geography?.country?.toLowerCase() || '';
  const prospectRegion = prospect.geography?.region?.toLowerCase() || '';

  if (prospectCountry && customer.country) {
    if (prospectCountry === customer.country) {
      geoScore = 60;
      if (prospectRegion && customer.region && prospectRegion === customer.region) {
        geoScore = 100;
      }
    }
  }
  breakdown.geography = { score: geoScore };

  // 4. Prestige (15%) - tier 1 = most prestigious, tier 5 = least
  const prestigeScore = Math.max(0, (6 - customer.prestigeTier) / 5) * 100;
  breakdown.prestige = { score: prestigeScore, tier: customer.prestigeTier };

  // 5. Reference Readiness (5%) - based on having notes, being marked referenceable
  let readinessScore = customer.referenceable ? 80 : 0;
  if (customer.notes) readinessScore = Math.min(100, readinessScore + 20);
  breakdown.readiness = { score: readinessScore };

  // Composite score
  const compositeScore = Math.round(
    integrationScore * weights.integrationMatch +
    typeScore * weights.restaurantType +
    geoScore * weights.geography +
    prestigeScore * weights.prestige +
    readinessScore * weights.referenceReadiness
  );

  return {
    customer,
    score: compositeScore,
    breakdown,
    sharedIntegrations,
  };
}

function rankCustomers(customers, prospect) {
  const scored = customers.map((c) => scoreCustomer(c, prospect));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, config.scoring.maxResults);
}

// Generate a human-readable "why" explanation for a scored customer
function generateWhyExplanation(scored) {
  const reasons = [];
  const b = scored.breakdown;

  if (b.integrations.shared.length > 0) {
    reasons.push(`Shared tech: ${b.integrations.shared.join(', ')}`);
  }
  if (b.restaurantType.score === 100) {
    reasons.push('Same restaurant type');
  } else if (b.restaurantType.score > 0) {
    reasons.push('Similar restaurant type');
  }
  if (b.geography.score === 100) {
    reasons.push('Same city/region');
  } else if (b.geography.score > 0) {
    reasons.push('Same country');
  }
  if (b.prestige.tier <= 2) {
    reasons.push('High-profile brand');
  }

  return reasons.length > 0 ? reasons.join(' | ') : 'General relevance';
}

module.exports = { scoreCustomer, rankCustomers, generateWhyExplanation };
