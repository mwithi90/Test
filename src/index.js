const { App } = require('@slack/bolt');
const config = require('./config');
const { buildInputModal, buildResultsMessage } = require('./slackBlocks');
const { getIntegrationName } = require('./integrations');
const { fetchSheetData, formatSheetForAI } = require('./sheets');
const { researchProspect } = require('./research');
const { findReferences } = require('./matcher');

const app = new App({
  token: config.slack.botToken,
  signingSecret: config.slack.signingSecret,
  appToken: config.slack.appToken,
  socketMode: true,
});

// Slash command: /tenzo-ref
app.command('/tenzo-ref', async ({ ack, body, client }) => {
  await ack();

  await client.views.open({
    trigger_id: body.trigger_id,
    view: buildInputModal(),
  });
});

// Also support @mention as a trigger
app.event('app_mention', async ({ event, client }) => {
  await client.chat.postMessage({
    channel: event.channel,
    text: 'Use the `/tenzo-ref` slash command to find customer references for a prospect.',
  });
});

// Handle modal submission
app.view('tenzo_ref_submit', async ({ ack, body, view, client }) => {
  await ack();

  const userId = body.user.id;
  const values = view.state.values;

  // Extract form values
  const companyName = values.company_name.company_name_input.value;
  const leadName = values.lead_name.lead_name_input.value;
  const selectedIntegrations = (values.integrations.integrations_select.selected_options || [])
    .map((opt) => getIntegrationName(opt.value));
  const salesforceUrl = values.salesforce_url?.salesforce_url_input?.value || null;

  // Send a "working on it" DM to the rep
  const dm = await client.conversations.open({ users: userId });
  const loadingMsg = await client.chat.postMessage({
    channel: dm.channel.id,
    text: `:mag: Researching *${companyName}*... This usually takes 10-15 seconds.`,
  });

  try {
    // Step 1: Research the prospect (Claude + web search)
    const prospect = await researchProspect({
      companyName,
      leadName,
      integrations: selectedIntegrations,
      salesforceUrl,
    });

    if (salesforceUrl) {
      prospect.salesforce_url = salesforceUrl;
    }

    // Step 2: Fetch customer data from Google Sheet
    await fetchSheetData();
    const sheetData = formatSheetForAI();

    // Step 3: Use AI to find the best references + case studies
    const matcherResult = await findReferences({ prospect, sheetData });

    // Step 4: Build and send results
    const blocks = buildResultsMessage({ prospect, matcherResult });

    await client.chat.update({
      channel: dm.channel.id,
      ts: loadingMsg.ts,
      text: `Reference results for ${companyName}`,
      blocks,
    });
  } catch (error) {
    console.error('Error processing reference request:', error);

    await client.chat.update({
      channel: dm.channel.id,
      ts: loadingMsg.ts,
      text: `:warning: Sorry, something went wrong while researching *${companyName}*.\n\nError: ${error.message}\n\nPlease try again or contact the team if this persists.`,
    });
  }
});

// Start the app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`TenzoRef bot is running on port ${port}`);
})();
