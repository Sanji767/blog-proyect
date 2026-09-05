const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lta3kp7s',
  dataset: 'production',
  apiVersion: '2025-02-01',
  useCdn: false,
});

async function main() {
  const doc = await client.getDocument('fb216b08-20e1-4aea-ad47-d1cb462613fc');
  console.log('Doc fb216b08-20e1-4aea-ad47-d1cb462613fc:', JSON.stringify(doc, null, 2));
}

main().catch(console.error);
