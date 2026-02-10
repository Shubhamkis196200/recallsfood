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
  // Featured Articles
  {
    id: "1",
    slug: "spring-2025-haute-couture-paris",
    title: "Spring 2025 Haute Couture: Paris Fashion Week's Most Defining Moments",
    subtitle: "From Dior's architectural mastery to Chanel's timeless reinvention",
    category: "Luxury Fashion",
    author: "Isabella Fontaine",
    date: "2025-03-15",
    readTime: "8 min read",
    image: "/images/haute-couture-spring.jpg",
    excerpt: "This season's haute couture presentations transcended mere fashion, offering a masterclass in artisanal excellence and creative vision.",
    content: "The Spring 2025 haute couture collections unveiled in Paris represented a watershed moment in contemporary luxury fashion...",
    featured: true,
    trending: true,
  },
  {
    id: "2",
    slug: "valentino-creative-director-interview",
    title: "In Conversation: Valentino's New Creative Director on Heritage and Innovation",
    subtitle: "An exclusive dialogue about reimagining Italian luxury for the modern era",
    category: "Designer Spotlight",
    author: "Marcus Chen",
    date: "2025-03-14",
    readTime: "12 min read",
    image: "/images/valentino-interview.jpg",
    excerpt: "We sit down with fashion's newest visionary to discuss their bold approach to one of Italy's most storied houses.",
    content: "In the sun-drenched atelier overlooking Rome's Spanish Steps, we meet the designer tasked with steering Valentino into its next chapter...",
    featured: true,
    trending: true,
  },
  {
    id: "3",
    slug: "sustainable-luxury-future",
    title: "The Future of Sustainable Luxury: Beyond Greenwashing",
    subtitle: "How leading fashion houses are redefining eco-conscious craftsmanship",
    category: "Global Trends",
    author: "Sofia Ramirez",
    date: "2025-03-13",
    readTime: "10 min read",
    image: "/images/sustainable-luxury.jpg",
    excerpt: "As consumer consciousness evolves, luxury brands are pioneering innovative approaches to sustainability without compromising quality.",
    content: "The luxury fashion industry stands at a crossroads. With growing environmental awareness...",
    featured: true,
  },

  // Luxury Fashion Category
  {
    id: "4",
    slug: "fall-2025-runway-trends",
    title: "Fall 2025: The Runway Trends That Will Define Next Season",
    subtitle: "Power dressing, romantic silhouettes, and avant-garde tailoring take center stage",
    category: "Luxury Fashion",
    author: "Alexandra Winters",
    date: "2025-03-12",
    readTime: "7 min read",
    image: "/images/fall-trends.jpg",
    excerpt: "From Milan to New York, the Fall 2025 shows revealed a cohesive narrative of strength, femininity, and innovation.",
    content: "The Fall 2025 season showcased a remarkable synthesis of contrasting aesthetics...",
    trending: true,
  },
  {
    id: "5",
    slug: "couture-craftsmanship-atelier",
    title: "Inside the Atelier: The Art of Couture Craftsmanship",
    subtitle: "Meet the artisans preserving centuries-old techniques",
    category: "Luxury Fashion",
    author: "Pierre Dubois",
    date: "2025-03-11",
    readTime: "9 min read",
    image: "/images/atelier-craftsmanship.jpg",
    excerpt: "Behind every haute couture piece lies hundreds of hours of meticulous handwork by master artisans.",
    content: "In the hushed ateliers of Paris's most prestigious fashion houses...",
  },
  {
    id: "6",
    slug: "luxury-menswear-evolution",
    title: "The Evolution of Luxury Menswear: Breaking Traditional Boundaries",
    subtitle: "Contemporary designers are redefining masculine elegance",
    category: "Luxury Fashion",
    author: "James Morrison",
    date: "2025-03-10",
    readTime: "6 min read",
    image: "/images/menswear-evolution.jpg",
    excerpt: "Today's luxury menswear challenges conventional notions of masculinity while honoring sartorial heritage.",
    content: "The landscape of men's luxury fashion has undergone a profound transformation...",
  },

  // Designer Spotlight Category
  {
    id: "7",
    slug: "emerging-designer-profile-2025",
    title: "Rising Stars: The Emerging Designers Shaping Fashion's Future",
    subtitle: "Five visionary talents redefining luxury for a new generation",
    category: "Designer Spotlight",
    author: "Elena Vasquez",
    date: "2025-03-09",
    readTime: "11 min read",
    image: "/images/emerging-designers.jpg",
    excerpt: "Meet the innovative designers whose fresh perspectives are capturing the attention of fashion's elite.",
    content: "In an industry often dominated by established names, a new generation of designers...",
  },
  {
    id: "8",
    slug: "hermes-artistic-director-legacy",
    title: "Hermès Artistic Director: Building Upon a Legacy of Excellence",
    subtitle: "Balancing tradition and modernity at the pinnacle of luxury",
    category: "Designer Spotlight",
    author: "Catherine Laurent",
    date: "2025-03-08",
    readTime: "10 min read",
    image: "/images/hermes-director.jpg",
    excerpt: "An intimate look at how Hermès maintains its legendary status while embracing contemporary vision.",
    content: "Few fashion houses command the reverence and heritage of Hermès...",
    trending: true,
  },
  {
    id: "9",
    slug: "japanese-designers-minimalism",
    title: "Japanese Minimalism: Designers Redefining Quiet Luxury",
    subtitle: "The enduring influence of Japanese aesthetics on global fashion",
    category: "Designer Spotlight",
    author: "Yuki Tanaka",
    date: "2025-03-07",
    readTime: "8 min read",
    image: "/images/japanese-minimalism.jpg",
    excerpt: "Exploring how Japanese designers continue to shape the conversation around refined, understated elegance.",
    content: "Japanese fashion has long been synonymous with a particular kind of sophistication...",
  },

  // Global Trends Category
  {
    id: "10",
    slug: "digital-fashion-metaverse",
    title: "Digital Fashion and the Metaverse: Luxury's Virtual Revolution",
    subtitle: "How leading brands are embracing digital-first experiences",
    category: "Global Trends",
    author: "Marcus Chen",
    date: "2025-03-06",
    readTime: "9 min read",
    image: "/images/digital-fashion.jpg",
    excerpt: "The intersection of technology and luxury is creating unprecedented opportunities for brand engagement.",
    content: "As virtual worlds become increasingly sophisticated, luxury fashion brands...",
  },
  {
    id: "11",
    slug: "gen-z-luxury-consumption",
    title: "Understanding Gen Z's Approach to Luxury Consumption",
    subtitle: "Authenticity, values, and experiences over traditional status symbols",
    category: "Global Trends",
    author: "Sofia Ramirez",
    date: "2025-03-05",
    readTime: "7 min read",
    image: "/images/gen-z-luxury.jpg",
    excerpt: "The next generation of luxury consumers is reshaping the industry with their unique priorities and values.",
    content: "Generation Z's relationship with luxury fashion fundamentally differs from previous generations...",
  },
  {
    id: "12",
    slug: "artisan-collaborations-trend",
    title: "Artisan Collaborations: Luxury Brands Celebrating Traditional Crafts",
    subtitle: "Prestigious partnerships preserving global artisanal heritage",
    category: "Global Trends",
    author: "Isabella Fontaine",
    date: "2025-03-04",
    readTime: "8 min read",
    image: "/images/artisan-collaborations.jpg",
    excerpt: "Leading fashion houses are forging meaningful partnerships with traditional artisans worldwide.",
    content: "In an era of mass production, luxury brands are increasingly turning to artisan collaborations...",
  },

  // Premium Lifestyle Category
  {
    id: "13",
    slug: "luxury-travel-destinations-2025",
    title: "The World's Most Exclusive Travel Destinations for 2025",
    subtitle: "Private islands, heritage hotels, and bespoke experiences",
    category: "Premium Lifestyle",
    author: "Alexander Sterling",
    date: "2025-03-03",
    readTime: "10 min read",
    image: "/images/luxury-travel.jpg",
    excerpt: "Discover the most coveted destinations where discerning travelers seek unparalleled experiences.",
    content: "For those who seek the extraordinary, 2025 offers an array of exceptional destinations...",
  },
  {
    id: "14",
    slug: "haute-cuisine-michelin-guide",
    title: "Haute Cuisine: This Year's Most Anticipated Michelin Revelations",
    subtitle: "The gastronomic experiences defining culinary excellence",
    category: "Premium Lifestyle",
    author: "Pierre Dubois",
    date: "2025-03-02",
    readTime: "9 min read",
    image: "/images/haute-cuisine.jpg",
    excerpt: "From Tokyo to Paris, we explore the restaurants pushing the boundaries of fine dining.",
    content: "The latest Michelin Guide reveals a fascinating evolution in haute cuisine...",
    trending: true,
  },
  {
    id: "15",
    slug: "luxury-wellness-retreats",
    title: "Luxury Wellness: The World's Most Transformative Retreats",
    subtitle: "Where holistic health meets five-star indulgence",
    category: "Premium Lifestyle",
    author: "Sofia Ramirez",
    date: "2025-03-01",
    readTime: "8 min read",
    image: "/images/wellness-retreats.jpg",
    excerpt: "The intersection of wellness and luxury creates sanctuaries for complete rejuvenation.",
    content: "Today's luxury wellness retreats offer far more than traditional spa experiences...",
  },

  // Accessories & Watches Category
  {
    id: "16",
    slug: "haute-horlogerie-baselworld",
    title: "Haute Horlogerie: The Masterpieces Unveiled at Baselworld 2025",
    subtitle: "Exceptional timepieces showcasing the pinnacle of watchmaking",
    category: "Accessories & Watches",
    author: "James Morrison",
    date: "2025-02-28",
    readTime: "11 min read",
    image: "/images/haute-horlogerie.jpg",
    excerpt: "This year's most impressive timepieces demonstrate the enduring artistry of Swiss watchmaking.",
    content: "Baselworld 2025 has once again proven why it remains the premier showcase...",
  },
  {
    id: "17",
    slug: "investment-handbags-guide",
    title: "Investment Handbags: The Ultimate Guide to Timeless Luxury Pieces",
    subtitle: "Classic designs that appreciate in value and style",
    category: "Accessories & Watches",
    author: "Alexandra Winters",
    date: "2025-02-27",
    readTime: "7 min read",
    image: "/images/investment-handbags.jpg",
    excerpt: "Certain handbags transcend trends, becoming valuable assets that retain and increase their worth.",
    content: "In the world of luxury accessories, select handbags have proven to be remarkable investments...",
  },
  {
    id: "18",
    slug: "fine-jewelry-renaissance",
    title: "The Fine Jewelry Renaissance: Contemporary Designers to Know",
    subtitle: "Modern artisans reimagining precious adornment",
    category: "Accessories & Watches",
    author: "Elena Vasquez",
    date: "2025-02-26",
    readTime: "9 min read",
    image: "/images/fine-jewelry.jpg",
    excerpt: "A new generation of jewelry designers is bringing fresh creativity to the world of haute joaillerie.",
    content: "The fine jewelry landscape is experiencing a remarkable renaissance...",
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
