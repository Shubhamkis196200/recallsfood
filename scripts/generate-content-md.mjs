#!/usr/bin/env node
// Generate .md files for all content in public/content/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '..', 'public', 'content');
const distOutputDir = path.resolve(__dirname, '..', 'dist', 'content');

// Ensure directories exist
[outputDir, distOutputDir].forEach(dir => {
  fs.mkdirSync(path.join(dir, 'recalls'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'guides'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'blog'), { recursive: true });
});

// Recall data
const recalls = [
  {
    slug: 'chicken-products-recalled-salmonella-risk',
    title: 'Urgent: Chicken Products Recalled Due to Salmonella Risk',
    date: '2026-02-08',
    category: 'Meat & Poultry',
    severity: 'critical',
    pathogen: 'Salmonella',
    brand: 'Heritage Farms',
    body: 'The USDA has issued a Class I recall affecting approximately 4.2 million pounds of frozen chicken products manufactured by Heritage Farms. The recall was initiated after routine FSIS testing detected Salmonella Enteritidis in samples collected from retail locations.\n\nThe contamination was first identified during a random sampling program at a Walmart location in Ohio on January 28, 2026. Subsequent testing confirmed the presence of Salmonella in multiple lots produced between October 2025 and January 2026.\n\nConsumers who have purchased these products are urged to check their freezers immediately and either discard the affected products or return them to the place of purchase for a full refund.',
  },
  {
    slug: 'kroger-organic-baby-food-metal-fragments',
    title: 'Kroger Recalls Organic Baby Food After Metal Fragments Found',
    date: '2026-02-06',
    category: 'Baby Food',
    severity: 'critical',
    pathogen: 'Foreign Material',
    brand: 'Kroger Simple Truth',
    body: 'Kroger Co. has issued a voluntary recall of select Simple Truth Organic baby food pouches after three consumers in different states reported finding small metal fragments in the product. The FDA has classified this as a Class I recall due to the potential for serious injury.',
  },
  {
    slug: 'frozen-vegetables-listeria-contamination',
    title: 'FDA Alert: Popular Frozen Vegetables Contaminated with Listeria',
    date: '2026-02-04',
    category: 'Frozen Foods',
    severity: 'critical',
    pathogen: 'Listeria',
    brand: 'FreshPak Foods',
    body: 'The FDA announced a major recall of frozen vegetable products manufactured by FreshPak Foods, a leading private-label frozen food supplier. The recall affects products sold under multiple retail brands at major grocery chains nationwide.',
  },
  {
    slug: 'costco-imported-cheese-e-coli-concerns',
    title: 'Costco Pulls Imported Cheese Over E. coli Concerns',
    date: '2026-02-01',
    category: 'Dairy & Eggs',
    severity: 'warning',
    pathogen: 'E. coli',
    brand: 'Fromagerie du Mont-Blanc',
    body: 'Costco Wholesale has voluntarily recalled Fromagerie du Mont-Blanc Artisan Raw Milk Brie after FDA import testing identified the presence of Shiga toxin-producing E. coli (STEC) in samples of the product.',
  },
  {
    slug: 'peanut-butter-aflatoxin-national-recall',
    title: 'National Recall: Peanut Butter Brand Tests Positive for Aflatoxin',
    date: '2026-01-28',
    category: 'Packaged Foods',
    severity: 'warning',
    pathogen: 'Aflatoxin',
    brand: 'NuttyBest',
    body: 'NuttyBest Foods Inc. has issued a nationwide voluntary recall of its creamy and crunchy peanut butter products after internal quality testing revealed aflatoxin levels above the FDA action level of 20 parts per billion.',
  },
];

const guides = [
  {
    slug: 'how-to-check-if-your-food-has-been-recalled',
    title: 'How to Check if Your Food Has Been Recalled',
    date: '2026-01-20',
    category: 'Food Safety Guides',
    author: 'Dr. Sarah Mitchell',
    body: 'Food recalls are more common than most people realize. In 2025 alone, the FDA and USDA issued over 300 food recalls affecting thousands of products. Here are three reliable ways to check if anything in your kitchen has been recalled.',
  },
  {
    slug: 'complete-guide-food-thermometer-safety',
    title: 'The Complete Guide to Food Thermometer Safety',
    date: '2026-01-18',
    category: 'Food Safety Guides',
    author: 'Chef James Rodriguez',
    body: 'A food thermometer is the single most effective tool for preventing foodborne illness at home. Color, texture, and time are unreliable indicators of whether your food has reached a safe internal temperature.',
  },
  {
    slug: 'understanding-fda-food-recall-classes',
    title: 'Understanding FDA Food Recall Classes: I, II, and III',
    date: '2026-01-14',
    category: 'Food Safety Guides',
    author: 'RecallsFood Team',
    body: 'When the FDA announces a food recall, it assigns a classification (Class I, II, or III) that indicates the level of health risk. Understanding these classes can help you determine how urgently you need to act.',
  },
  {
    slug: 'how-to-store-food-safely-refrigerator-guide',
    title: 'How to Store Food Safely: A Refrigerator Guide',
    date: '2026-01-10',
    category: 'Food Safety Guides',
    author: 'Dr. Sarah Mitchell',
    body: 'Proper food storage is one of the simplest ways to prevent foodborne illness. Your refrigerator should be set to 40°F or below, and your freezer to 0°F.',
  },
  {
    slug: 'most-common-foodborne-pathogens',
    title: 'The 10 Most Common Foodborne Pathogens',
    date: '2026-01-05',
    category: 'Food Safety Guides',
    author: 'Dr. Sarah Mitchell',
    body: 'Each year, the CDC estimates that 48 million Americans get sick, 128,000 are hospitalized, and 3,000 die from foodborne illness. Understanding the most common pathogens can help you take steps to protect yourself.',
  },
];

const articles = [
  {
    slug: 'every-food-recalled-january-2026',
    title: 'Every Food Recalled in January 2026 — The Complete List',
    date: '2026-02-01',
    category: 'Recall Roundups',
    author: 'RecallsFood Team',
    body: 'January 2026 saw 28 food recalls from the FDA and USDA. Here is the complete list with affected products, stores, and what to do.',
  },
  {
    slug: 'what-to-do-if-you-ate-recalled-food',
    title: 'What To Do If You Ate Recalled Food: A Step-by-Step Guide',
    date: '2026-01-25',
    category: 'Food Safety Guides',
    author: 'Dr. Sarah Mitchell',
    body: 'Finding out you have eaten recalled food can be alarming. Here is a calm, step-by-step guide on what to do, when to see a doctor, and how to report it.',
  },
  {
    slug: 'why-food-recalls-are-increasing-2026',
    title: 'Why Food Recalls Are Increasing: What the Data Tells Us',
    date: '2026-01-20',
    category: 'Analysis',
    author: 'RecallsFood Team',
    body: 'Food recalls have increased dramatically over the past five years. We examine the data, the causes, and what it means for consumers.',
  },
];

function generateMd(item, type) {
  const frontmatter = [
    '---',
    `title: "${item.title}"`,
    `date: "${item.date}"`,
    `category: "${item.category}"`,
  ];
  if (item.severity) frontmatter.push(`severity: "${item.severity}"`);
  if (item.pathogen) frontmatter.push(`pathogen: "${item.pathogen}"`);
  if (item.brand) frontmatter.push(`brand: "${item.brand}"`);
  if (item.author) frontmatter.push(`author: "${item.author}"`);
  frontmatter.push(`type: "${type}"`);
  frontmatter.push('---');
  frontmatter.push('');
  frontmatter.push(`# ${item.title}`);
  frontmatter.push('');
  frontmatter.push(item.body);

  return frontmatter.join('\n');
}

let count = 0;
for (const item of recalls) {
  const md = generateMd(item, 'recall');
  for (const dir of [outputDir, distOutputDir]) {
    fs.writeFileSync(path.join(dir, 'recalls', `${item.slug}.md`), md);
  }
  count++;
}

for (const item of guides) {
  const md = generateMd(item, 'guide');
  for (const dir of [outputDir, distOutputDir]) {
    fs.writeFileSync(path.join(dir, 'guides', `${item.slug}.md`), md);
  }
  count++;
}

for (const item of articles) {
  const md = generateMd(item, 'blog');
  for (const dir of [outputDir, distOutputDir]) {
    fs.writeFileSync(path.join(dir, 'blog', `${item.slug}.md`), md);
  }
  count++;
}

console.log(`✅ Generated ${count} .md files in public/content/ and dist/content/`);
