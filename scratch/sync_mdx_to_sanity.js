const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ES_DIR = path.join(__dirname, '../src/content/blog/posts');
const EN_DIR = path.join(__dirname, '../src/content/blog/posts-en');

function scanDir(dirPath, lang) {
  if (!fs.existsSync(dirPath)) return [];
  const years = fs.readdirSync(dirPath).filter(y => !y.startsWith('_') && fs.statSync(path.join(dirPath, y)).isDirectory());
  const docs = [];

  for (const year of years) {
    const yearPath = path.join(dirPath, year);
    const files = fs.readdirSync(yearPath);
    for (const file of files) {
      if (!/\.mdx?$/.test(file)) continue;
      const fullPath = path.join(yearPath, file);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(raw);
      const fileNameNoExt = path.basename(file, path.extname(file));
      const slug = (data.slug?.trim() || fileNameNoExt).toLowerCase().replace(/\s+/g, '-');

      docs.push({
        _type: 'post',
        _id: `post-${lang}-${slug}`,
        title: data.title ?? 'Sin título',
        language: lang,
        slug: { _type: 'slug', current: slug },
        publishedAt: data.date ? `${data.date}T12:00:00Z` : `${year}-01-01T12:00:00Z`,
        description: data.description ?? '',
        excerpt: data.excerpt ?? data.description ?? '',
        featured: !!data.featured,
        category: (data.category ?? 'general').toLowerCase(),
        tags: Array.isArray(data.tags) ? data.tags.map(t => String(t).toLowerCase().trim()) : [],
        readingTime: data.readingTime ?? '5 min',
        author: data.author ?? 'Equipo FinanzasEU',
        views: data.views ?? 0,
      });
    }
  }
  return docs;
}

const esDocs = scanDir(ES_DIR, 'es');
const enDocs = scanDir(EN_DIR, 'en');

console.log(`[Sanity Sync Analyzer] Ready to sync ${esDocs.length} Spanish posts and ${enDocs.length} English posts to Sanity project 'lta3kp7s' (dataset: 'production').`);
