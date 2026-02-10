export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
  featured?: boolean;
  trending?: boolean;
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "every-food-recalled-january-2026",
    title: "Every Food Recalled in January 2026 — The Complete List",
    subtitle: "A comprehensive roundup of all FDA and USDA food recalls from January",
    category: "Recall Roundups",
    author: "RecallsFood Team",
    date: "2026-02-01",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    excerpt: "January 2026 saw 28 food recalls from the FDA and USDA. Here's the complete list with affected products, stores, and what to do.",
    content: "January 2026 was a busy month for food recalls...",
    featured: true,
    trending: true,
  },
  {
    id: "2",
    slug: "what-to-do-if-you-ate-recalled-food",
    title: "What To Do If You Ate Recalled Food: A Step-by-Step Guide",
    subtitle: "Don't panic — here's exactly what to do next",
    category: "Food Safety Guides",
    author: "Dr. Sarah Mitchell",
    date: "2026-01-25",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
    excerpt: "Found out you ate recalled food? Here's a calm, step-by-step guide on what to do, when to see a doctor, and how to report it.",
    content: "Finding out you've eaten recalled food can be alarming...",
    featured: true,
    trending: true,
  },
  {
    id: "3",
    slug: "why-food-recalls-are-increasing-2026",
    title: "Why Food Recalls Are Increasing: What the Data Tells Us",
    subtitle: "Over 300 recalls in 2025 — and the trend is accelerating",
    category: "Analysis",
    author: "RecallsFood Team",
    date: "2026-01-20",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    excerpt: "Food recalls have increased dramatically over the past five years. We examine the data, the causes, and what it means for consumers.",
    content: "The number of food recalls has been climbing steadily...",
    featured: true,
  },
  {
    id: "4",
    slug: "listeria-101-symptoms-risks-protection",
    title: "Listeria 101: Symptoms, Risks, and How to Protect Your Family",
    subtitle: "Everything you need to know about this dangerous foodborne pathogen",
    category: "Food Safety Guides",
    author: "Dr. Sarah Mitchell",
    date: "2026-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
    excerpt: "Listeria monocytogenes is responsible for some of the deadliest food recalls. Learn the symptoms, who's at risk, and how to stay safe.",
    content: "Listeria monocytogenes is a particularly dangerous foodborne pathogen...",
    trending: true,
  },
  {
    id: "5",
    slug: "safe-cooking-temperatures-printable-chart",
    title: "Safe Cooking Temperatures for Every Type of Meat (Printable Chart)",
    subtitle: "The USDA-recommended internal temperatures that kill harmful bacteria",
    category: "Food Safety Guides",
    author: "Chef James Rodriguez",
    date: "2026-01-10",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
    excerpt: "A food thermometer is your best defense against foodborne illness. Here are the safe internal temperatures for every type of meat.",
    content: "Color and texture are not reliable indicators of doneness...",
  },
  {
    id: "6",
    slug: "walmart-food-recalls-2026-complete-list",
    title: "Walmart Food Recalls 2026: Complete Updated List",
    subtitle: "All food recalls affecting Walmart stores this year",
    category: "Store Recalls",
    author: "RecallsFood Team",
    date: "2026-02-05",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    excerpt: "A continuously updated list of all food products recalled from Walmart stores in 2026, including Great Value brand items.",
    content: "Walmart is the largest grocery retailer in the United States...",
    trending: true,
  },
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return articles.filter(article => article.category === category);
};

export const getFeaturedArticles = (): Article[] => {
  return articles.filter(article => article.featured);
};

export const getTrendingArticles = (): Article[] => {
  return articles.filter(article => article.trending);
};
