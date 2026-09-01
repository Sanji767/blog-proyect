const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lta3kp7s',
  dataset: 'production',
  apiVersion: '2025-02-01',
  useCdn: false,
});

async function main() {
  try {
    const posts = await client.fetch('*[_type == "post"][0...5]{_id, title, slug, language}');
    console.log('Sanity Posts:', JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

main();
