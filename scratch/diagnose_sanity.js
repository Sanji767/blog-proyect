const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lta3kp7s',
  dataset: 'production',
  apiVersion: '2025-02-01',
  useCdn: false,
});

async function main() {
  try {
    const allDocs = await client.fetch(`*[_type == "post"]{
      _id,
      _createdAt,
      _updatedAt,
      title,
      language,
      "slug": slug.current,
      publishedAt,
      category,
      tags,
      "isDraft": _id in path("drafts.**")
    }`);

    console.log(`Found ${allDocs.length} posts in Sanity:`);
    console.log(JSON.stringify(allDocs, null, 2));
  } catch (err) {
    console.error('Error querying Sanity:', err);
  }
}

main();
