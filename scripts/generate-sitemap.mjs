#!/usr/bin/env node
// Generate sitemap.xml at build time

const BASE_URL = 'https://recallsfood.com';
const today = new Date().toISOString().split('T')[0];

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/recalls', priority: '0.9', changefreq: 'daily' },
  { url: '/guides', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/archive', priority: '0.6', changefreq: 'weekly' },
  { url: '/newsletter', priority: '0.7', changefreq: 'monthly' },
  { url: '/search', priority: '0.5', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
];

// Categories
const categories = [
  'meat-poultry', 'dairy-eggs', 'produce', 'packaged-foods',
  'beverages', 'pet-food', 'supplements', 'baby-food', 'frozen-foods',
];

// Stores
const stores = ['walmart', 'costco', 'target', 'kroger', 'whole-foods'];

// Pathogens
const pathogenSlugs = ['salmonella', 'e-coli', 'listeria', 'norovirus'];

// Recalls (slugs)
const recallSlugs = [
  'chicken-products-recalled-salmonella-risk',
  'kroger-organic-baby-food-metal-fragments',
  'frozen-vegetables-listeria-contamination',
  'costco-imported-cheese-e-coli-concerns',
  'peanut-butter-aflatoxin-national-recall',
];

// Guides (slugs)
const guideSlugs = [
  'how-to-check-if-your-food-has-been-recalled',
  'complete-guide-food-thermometer-safety',
  'understanding-fda-food-recall-classes',
  'how-to-store-food-safely-refrigerator-guide',
  'most-common-foodborne-pathogens',
];

// Articles/blog (slugs)
const articleSlugs = [
  'every-food-recalled-january-2026',
  'what-to-do-if-you-ate-recalled-food',
  'why-food-recalls-are-increasing-2026',
  'listeria-101-symptoms-risks-protection',
  'safe-cooking-temperatures-printable-chart',
  'walmart-food-recalls-2026-complete-list',
];

function urlEntry(path, priority = '0.7', changefreq = 'weekly', lastmod = today) {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const entries = [
  ...staticPages.map(p => urlEntry(p.url, p.priority, p.changefreq)),
  ...categories.map(c => urlEntry(`/category/${c}`, '0.7', 'daily')),
  ...stores.map(s => urlEntry(`/stores/${s}`, '0.7', 'daily')),
  ...pathogenSlugs.map(p => urlEntry(`/pathogens/${p}`, '0.6', 'monthly')),
  ...recallSlugs.map(r => urlEntry(`/recalls/${r}`, '0.8', 'weekly')),
  ...guideSlugs.map(g => urlEntry(`/guides/${g}`, '0.7', 'monthly')),
  ...articleSlugs.map(a => urlEntry(`/blog/${a}`, '0.7', 'monthly')),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

const fs = await import('fs');
const path = await import('path');
const { fileURLToPath } = await import('url');

const __dirname = path.default.dirname(fileURLToPath(import.meta.url));
const publicPath = path.default.resolve(__dirname, '..', 'public', 'sitemap.xml');
const distPath = path.default.resolve(__dirname, '..', 'dist', 'sitemap.xml');

fs.default.writeFileSync(publicPath, sitemap);
console.log(`✅ sitemap.xml written to public/ (${entries.length} URLs)`);

if (fs.default.existsSync(path.default.resolve(__dirname, '..', 'dist'))) {
  fs.default.writeFileSync(distPath, sitemap);
  console.log(`✅ sitemap.xml written to dist/`);
}
