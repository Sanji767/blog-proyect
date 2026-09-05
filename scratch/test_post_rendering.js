const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'lta3kp7s',
  dataset: 'production',
  apiVersion: '2025-02-01',
  useCdn: false,
});

async function testQuery() {
  const postPreviewFields = `
    "slug": slug.current,
    title,
    description,
    excerpt,
    "date": coalesce(publishedAt, _createdAt),
    category,
    tags,
    featured,
    readingTime,
    author,
    youtubeId,
    views,
    "coverImage": coverImage.asset->url,
    "image": coverImage.asset->url
  `;

  const allPostPreviewsQuery = `
    *[
      _type == "post" &&
      (coalesce(language, "es") == $locale || language == "all") &&
      defined(slug.current) &&
      coalesce(publishedAt, _createdAt) <= now() &&
      !(_id in path("drafts.**"))
    ]
    | order(coalesce(publishedAt, _createdAt) desc) {
      ${postPreviewFields}
    }
  `;

  const postBySlugQuery = `
    *[
      _type == "post" &&
      (coalesce(language, "es") == $locale || language == "all") &&
      slug.current == $slug &&
      coalesce(publishedAt, _createdAt) <= now() &&
      !(_id in path("drafts.**"))
    ][0] {
      ${postPreviewFields},
      "content": body[]{
        ...,
        _type == "image" => {
          ...,
          "url": asset->url
        }
      }
    }
  `;

  const previews = await client.fetch(allPostPreviewsQuery, { locale: 'es' });
  console.log('Sanity Previews count (ES):', previews.length);
  console.log('Preview slugs:', previews.map(p => p.slug));

  const singlePost = await client.fetch(postBySlugQuery, { slug: 'cuenta-bancaria-para-adolescentes', locale: 'es' });
  console.log('Single Post (cuenta-bancaria-para-adolescentes):', singlePost ? { title: singlePost.title, contentCount: singlePost.content?.length, body: singlePost.content } : 'NULL');
}

testQuery().catch(console.error);
