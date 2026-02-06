// Known integrations grouped by category, used to populate the Slack modal multi-select
const INTEGRATIONS = {
  pos: {
    label: 'POS Systems',
    options: [
      'Lightspeed',
      'Square',
      'Toast',
      'Oracle Micros',
      'Zonal',
      'Tevalis',
      'iKentoo',
      'Clover',
      'Aloha',
      'Revel',
      'TouchBistro',
      'Epos Now',
      'Goodtill',
      'Vita Mojo',
      'Orderbird',
    ],
  },
  labour: {
    label: 'Labour / Scheduling',
    options: [
      'Planday',
      'Deputy',
      '7Shifts',
      'Bizimply',
      'Harri',
      'S4Labour',
      'Workforce.com',
      'Homebase',
      'HotSchedules',
      'Rotacloud',
      'Fourth',
    ],
  },
  inventory: {
    label: 'Inventory',
    options: [
      'MarketMan',
      'Procure Wizard',
      'MarginEdge',
      'BlueCart',
      'Apicbase',
      'Cooking the Books',
      'Supy',
    ],
  },
  delivery: {
    label: 'Delivery / Ordering',
    options: [
      'Deliverect',
      'Uber Eats',
      'Deliveroo',
      'Just Eat',
      'DoorDash',
      'Grubhub',
    ],
  },
  reservations: {
    label: 'Reservations',
    options: [
      'OpenTable',
      'ResDiary',
      'SevenRooms',
      'Resy',
      'TheFork',
      'Quandoo',
    ],
  },
  reviews: {
    label: 'Reviews / Feedback',
    options: [
      'Google Reviews',
      'TripAdvisor',
      'Yumpingo',
      'Feed It Back',
    ],
  },
};

// Flatten all integration names for easy lookup
function getAllIntegrationNames() {
  const names = [];
  for (const category of Object.values(INTEGRATIONS)) {
    names.push(...category.options);
  }
  return names;
}

// Build Slack option groups for the multi-select
function buildSlackOptionGroups() {
  return Object.values(INTEGRATIONS).map((category) => ({
    label: { type: 'plain_text', text: category.label },
    options: category.options.map((name) => ({
      text: { type: 'plain_text', text: name },
      value: name.toLowerCase().replace(/[\s/.]+/g, '_'),
    })),
  }));
}

// Reverse lookup: value -> display name
function getIntegrationName(value) {
  for (const category of Object.values(INTEGRATIONS)) {
    for (const name of category.options) {
      if (name.toLowerCase().replace(/[\s/.]+/g, '_') === value) {
        return name;
      }
    }
  }
  return value;
}

module.exports = { INTEGRATIONS, getAllIntegrationNames, buildSlackOptionGroups, getIntegrationName };
