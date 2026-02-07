const { buildSlackOptionGroups } = require('./integrations');

// Build the input modal that opens when a rep triggers /tenzo-ref
function buildInputModal() {
  return {
    type: 'modal',
    callback_id: 'tenzo_ref_submit',
    title: { type: 'plain_text', text: 'Find References' },
    submit: { type: 'plain_text', text: 'Search' },
    close: { type: 'plain_text', text: 'Cancel' },
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Prospect Details' },
      },
      {
        type: 'input',
        block_id: 'company_name',
        label: { type: 'plain_text', text: 'Company Name' },
        element: {
          type: 'plain_text_input',
          action_id: 'company_name_input',
          placeholder: { type: 'plain_text', text: 'e.g. Wagamama' },
        },
      },
      {
        type: 'input',
        block_id: 'lead_name',
        label: { type: 'plain_text', text: 'Lead Name' },
        element: {
          type: 'plain_text_input',
          action_id: 'lead_name_input',
          placeholder: { type: 'plain_text', text: 'e.g. John Smith' },
        },
      },
      {
        type: 'input',
        block_id: 'integrations',
        label: { type: 'plain_text', text: 'Integrations They Use' },
        element: {
          type: 'multi_static_select',
          action_id: 'integrations_select',
          placeholder: { type: 'plain_text', text: 'Select integrations...' },
          option_groups: buildSlackOptionGroups(),
        },
      },
      {
        type: 'input',
        block_id: 'salesforce_url',
        label: { type: 'plain_text', text: 'Salesforce Link (optional)' },
        optional: true,
        element: {
          type: 'url_text_input',
          action_id: 'salesforce_url_input',
          placeholder: { type: 'plain_text', text: 'https://tenzo.my.salesforce.com/...' },
        },
      },
    ],
  };
}

// Build the results message from the AI matcher output
function buildResultsMessage({ prospect, matcherResult }) {
  const blocks = [];
  const references = matcherResult.references || [];
  const caseStudies = matcherResult.case_studies || [];

  // Header
  blocks.push({
    type: 'header',
    text: { type: 'plain_text', text: `Reference Finder: ${prospect.company_name}` },
  });

  // Prospect summary
  const prospectFields = [
    `*Lead:* ${prospect.lead_name}`,
    `*Type:* ${capitalize(prospect.restaurant_type) || 'Unknown'}`,
    `*Geography:* ${[prospect.geography?.region, prospect.geography?.country].filter(Boolean).join(', ') || 'Unknown'}`,
    `*Locations:* ${prospect.estimated_locations || 'Unknown'}`,
    `*Integrations:* ${prospect.integrations?.join(', ') || 'None specified'}`,
  ];
  if (prospect.salesforce_url) {
    prospectFields.push(`*Salesforce:* <${prospect.salesforce_url}|View Opportunity>`);
  }

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: prospectFields.join('\n'),
    },
  });

  if (prospect.research_summary) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `_${prospect.research_summary}_` }],
    });
  }

  blocks.push({ type: 'divider' });

  // Recommended references
  blocks.push({
    type: 'header',
    text: { type: 'plain_text', text: 'Recommended References' },
  });

  if (references.length === 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '_No strong matches found. Try broadening the integrations or check the reference sheet manually._' },
    });
  }

  references.forEach((ref, i) => {
    const sharedText = ref.shared_integrations?.length > 0
      ? `\n> :link: Shared stack: ${ref.shared_integrations.join(', ')}`
      : '';

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: [
          `*${i + 1}. ${ref.name}* — Score: ${ref.score}/100`,
          `> ${ref.type || 'Restaurant'} | ${ref.geography || 'Unknown'}`,
          sharedText,
          `> :bulb: _${ref.why}_`,
        ].filter(Boolean).join('\n'),
      },
    });
  });

  // Case studies
  if (caseStudies.length > 0) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'header',
      text: { type: 'plain_text', text: 'Relevant Case Studies' },
    });

    caseStudies.forEach((cs) => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*<${cs.url}|${cs.customer}>* — ${cs.key_result}\n> _${cs.why}_`,
        },
      });
    });
  }

  // Footer
  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Powered by TenzoRef | Data refreshed: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
      },
    ],
  });

  return blocks;
}

function capitalize(str) {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

module.exports = { buildInputModal, buildResultsMessage };
