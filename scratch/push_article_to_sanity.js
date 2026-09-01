const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lta3kp7s',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function markdownToPortableText(markdownText) {
  const lines = markdownText.split('\n');
  const blocks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === '---') continue;

    if (line.startsWith('### ')) {
      blocks.push({
        _type: 'block',
        _key: `h3_${i}`,
        style: 'h3',
        children: [{ _type: 'span', _key: `span_${i}`, text: line.replace(/^###\s+/, ''), marks: [] }],
        markDefs: [],
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        _type: 'block',
        _key: `h2_${i}`,
        style: 'h2',
        children: [{ _type: 'span', _key: `span_${i}`, text: line.replace(/^##\s+/, ''), marks: [] }],
        markDefs: [],
      });
    } else if (line.startsWith('# ')) {
      blocks.push({
        _type: 'block',
        _key: `h1_${i}`,
        style: 'h2',
        children: [{ _type: 'span', _key: `span_${i}`, text: line.replace(/^#\s+/, ''), marks: [] }],
        markDefs: [],
      });
    } else if (line.startsWith('> ')) {
      blocks.push({
        _type: 'block',
        _key: `quote_${i}`,
        style: 'blockquote',
        children: [{ _type: 'span', _key: `span_${i}`, text: line.replace(/^>\s+/, ''), marks: [] }],
        markDefs: [],
      });
    } else {
      blocks.push({
        _type: 'block',
        _key: `p_${i}`,
        style: 'normal',
        children: [{ _type: 'span', _key: `span_${i}`, text: line, marks: [] }],
        markDefs: [],
      });
    }
  }

  return blocks;
}

const rawContent = fs.readFileSync(
  path.join(__dirname, '../src/content/blog/posts/2026/cuentas-bancarias-adolescentes-2026.mdx'),
  'utf-8'
);

// Remove frontmatter
const bodyMarkdown = rawContent.replace(/^---[\s\S]*?---\s*/, '');
const bodyBlocks = markdownToPortableText(bodyMarkdown);

const doc = {
  _id: 'post-es-cuentas-bancarias-adolescentes-2026',
  _type: 'post',
  title: 'Cuentas bancarias para adolescentes: las mejores opciones para jóvenes en 2026',
  language: 'es',
  slug: {
    _type: 'slug',
    current: 'cuentas-bancarias-adolescentes-2026',
  },
  publishedAt: '2026-03-08T12:00:00Z',
  description:
    'Guía completa y comparativa sobre cuentas bancarias para adolescentes y menores: comisiones, tarjetas de débito, control parental, ahorro y consejos para padres en 2026.',
  excerpt:
    'Descubre cómo funcionan las cuentas bancarias para adolescentes, qué pueden hacer los menores con ellas y las mejores opciones con control parental en 2026.',
  featured: true,
  category: 'cuentas-familiares',
  tags: ['adolescentes', 'menores', 'cuentas-jovenes', 'tarjetas-debito', 'educacion-financiera', 'control-parental'],
  readingTime: '8 min',
  author: 'Equipo FinanzasEU',
  views: 0,
  body: bodyBlocks,
};

fs.writeFileSync(
  path.join(__dirname, 'sanity_post_adolescentes.json'),
  JSON.stringify(doc, null, 2),
  'utf-8'
);

console.log('[Sanity Article Prep] Document created successfully in scratch/sanity_post_adolescentes.json with', bodyBlocks.length, 'blocks.');

async function upload() {
  if (client.config().token) {
    try {
      const res = await client.createOrReplace(doc);
      console.log('[Sanity API] Document uploaded/replaced directly in Sanity dataset:', res._id);
    } catch (err) {
      console.warn('[Sanity API Warning]:', err.message);
    }
  } else {
    console.log('[Sanity API Info] Client initialized without write token (can be imported in Sanity Studio or with SANITY_API_TOKEN).');
  }
}

upload();
