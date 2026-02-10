export type Severity = "critical" | "warning" | "watch" | "resolved";
export type Pathogen = "Salmonella" | "Listeria" | "E. coli" | "Allergen" | "Foreign Material" | "Aflatoxin";

export interface RecallAlert {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  severity: Severity;
  pathogen: Pathogen;
  brand: string;
  product: string;
  category: string;
  categorySlug: string;
  stores: string[];
  statesAffected: string;
  dateIssued: string;
  recallClass: "I" | "II" | "III";
  image: string;
  excerpt: string;
  content: string;
  lotNumbers: string;
  upc: string;
  affectedProducts: { name: string; size: string; upc: string; lot: string; bestBy: string }[];
  whatToDo: string[];
  healthRisks: string;
  featured?: boolean;
  trending?: boolean;
}

export interface BlogGuide {
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
  tags: string[];
  featured?: boolean;
}

export const recalls: RecallAlert[] = [
  {
    id: "r1",
    slug: "chicken-products-recalled-salmonella-risk",
    title: "Urgent: Chicken Products Recalled Due to Salmonella Risk",
    subtitle: "Over 4.2 million pounds of frozen chicken recalled across 38 states",
    severity: "critical",
    pathogen: "Salmonella",
    brand: "Heritage Farms",
    product: "Frozen Chicken Strips & Nuggets",
    category: "Meat & Poultry",
    categorySlug: "meat-poultry",
    stores: ["Walmart", "Kroger", "Target"],
    statesAffected: "38 states — Nationwide",
    dateIssued: "2026-02-08",
    recallClass: "I",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80",
    excerpt: "The USDA has issued a Class I recall for Heritage Farms frozen chicken products after routine testing revealed Salmonella contamination in multiple production lots.",
    content: `The United States Department of Agriculture's Food Safety and Inspection Service (FSIS) announced a Class I recall affecting approximately 4.2 million pounds of frozen chicken products manufactured by Heritage Farms. The recall was initiated after routine FSIS testing detected Salmonella Enteritidis in samples collected from retail locations.\n\nThe contamination was first identified during a random sampling program at a Walmart location in Ohio on January 28, 2026. Subsequent testing confirmed the presence of Salmonella in multiple lots produced between October 2025 and January 2026.\n\nConsumers who have purchased these products are urged to check their freezers immediately and either discard the affected products or return them to the place of purchase for a full refund.`,
    lotNumbers: "EST. 19224A, 19224B, 19225A through 19230C",
    upc: "Multiple — see affected products list",
    affectedProducts: [
      { name: "Heritage Farms Chicken Strips 24oz", size: "24 oz", upc: "0-12345-67890-1", lot: "19224A-19226C", bestBy: "10/2026-01/2027" },
      { name: "Heritage Farms Chicken Nuggets 32oz", size: "32 oz", upc: "0-12345-67891-8", lot: "19224B-19228A", bestBy: "10/2026-01/2027" },
      { name: "Heritage Farms Popcorn Chicken 20oz", size: "20 oz", upc: "0-12345-67892-5", lot: "19225A-19230C", bestBy: "11/2026-02/2027" },
    ],
    whatToDo: [
      "Stop consuming these products immediately",
      "Check your freezer for matching lot numbers and UPC codes",
      "Return products to your place of purchase for a full refund",
      "If you have consumed these products and feel ill, contact your healthcare provider",
      "Report adverse reactions to the USDA at 1-888-674-6854",
    ],
    healthRisks: "Salmonella can cause serious and sometimes fatal infections in young children, elderly people, and those with weakened immune systems. Symptoms include diarrhea, fever, and abdominal cramps 12 to 72 hours after exposure. Most people recover within 4-7 days, but some may require hospitalization.",
    featured: true,
    trending: true,
  },
  {
    id: "r2",
    slug: "kroger-organic-baby-food-metal-fragments",
    title: "Kroger Recalls Organic Baby Food Over Metal Fragments",
    subtitle: "Simple Truth Organic baby food pouches pulled from shelves in 12 states",
    severity: "critical",
    pathogen: "Foreign Material",
    brand: "Simple Truth Organic (Kroger)",
    product: "Organic Baby Food Pouches",
    category: "Baby Food",
    categorySlug: "baby-food",
    stores: ["Kroger", "Fred Meyer", "Ralph's"],
    statesAffected: "12 states — Midwest and West Coast",
    dateIssued: "2026-02-06",
    recallClass: "I",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&q=80",
    excerpt: "Kroger has voluntarily recalled its Simple Truth Organic baby food pouches after consumers reported finding small metal fragments in the product.",
    content: `Kroger Co. has issued a voluntary recall of select Simple Truth Organic baby food pouches after three consumers in different states reported finding small metal fragments in the product. The FDA has classified this as a Class I recall due to the potential for serious injury.\n\nThe recall affects five varieties of Simple Truth Organic baby food pouches produced at Kroger's partner manufacturing facility in Michigan between December 2025 and January 2026. The metal fragments are believed to have originated from a processing equipment malfunction.\n\nKroger has already removed the affected products from store shelves and is contacting customers who purchased the items through their loyalty card program.`,
    lotNumbers: "Batch codes: BF2512-001 through BF2601-045",
    upc: "0-11110-90XXX series",
    affectedProducts: [
      { name: "Simple Truth Organic Apple Banana Puree", size: "3.5 oz", upc: "0-11110-90123-4", lot: "BF2512-001 to BF2512-030", bestBy: "06/2026" },
      { name: "Simple Truth Organic Sweet Potato Pear", size: "3.5 oz", upc: "0-11110-90124-1", lot: "BF2512-015 to BF2601-020", bestBy: "07/2026" },
      { name: "Simple Truth Organic Mango Carrot", size: "3.5 oz", upc: "0-11110-90125-8", lot: "BF2601-001 to BF2601-045", bestBy: "07/2026" },
    ],
    whatToDo: [
      "Do not feed these products to your child",
      "Inspect any opened pouches carefully before discarding",
      "Return products to any Kroger family store for a full refund",
      "If your child has consumed these products and shows signs of distress, seek medical attention immediately",
      "Report incidents to the FDA at 1-800-FDA-1088",
    ],
    healthRisks: "Metal fragments in food products pose a risk of dental injury, choking, and internal injury. Infants and young children are particularly vulnerable. Parents should monitor children who may have consumed these products for signs of distress, difficulty swallowing, or abdominal pain.",
    featured: true,
    trending: true,
  },
  {
    id: "r3",
    slug: "frozen-vegetables-listeria-contamination",
    title: "FDA Alert: Popular Frozen Vegetables Contaminated with Listeria",
    subtitle: "Multiple brands affected — check your freezer immediately",
    severity: "critical",
    pathogen: "Listeria",
    brand: "FreshPak Foods",
    product: "Frozen Vegetable Blends",
    category: "Frozen Foods",
    categorySlug: "frozen-foods",
    stores: ["Walmart", "Target", "Costco", "Whole Foods", "Kroger"],
    statesAffected: "Nationwide — all 50 states",
    dateIssued: "2026-02-04",
    recallClass: "I",
    image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&q=80",
    excerpt: "The FDA has issued an urgent recall for frozen vegetable products from FreshPak Foods after Listeria monocytogenes was detected in multiple product lines sold under various store brands.",
    content: `The Food and Drug Administration (FDA) announced a major recall of frozen vegetable products manufactured by FreshPak Foods, a leading private-label frozen food supplier. The recall affects products sold under multiple retail brands at major grocery chains nationwide.\n\nListeria monocytogenes was first detected during routine FDA sampling at a distribution center in Georgia. Subsequent investigation revealed the contamination likely originated at FreshPak's primary processing facility in central California.\n\nThis recall is particularly significant due to the number of retail brands affected. FreshPak manufactures frozen vegetables sold under store-brand labels at Walmart (Great Value), Target (Good & Gather), Costco (Kirkland), and several other major retailers.`,
    lotNumbers: "Production codes beginning with 'FP25' followed by dates 1001 through 1231",
    upc: "Multiple store brands — see affected products",
    affectedProducts: [
      { name: "Great Value Mixed Vegetables 12oz", size: "12 oz", upc: "0-78742-12345-6", lot: "FP251001-FP251130", bestBy: "04/2027" },
      { name: "Good & Gather Broccoli Florets 16oz", size: "16 oz", upc: "0-85239-01234-5", lot: "FP251015-FP251215", bestBy: "05/2027" },
      { name: "Kirkland Signature Stir Fry Blend 5.5lb", size: "5.5 lb", upc: "0-96619-55555-3", lot: "FP251101-FP251231", bestBy: "06/2027" },
    ],
    whatToDo: [
      "Check your freezer for any frozen vegetable products from the listed brands",
      "Do not consume products with matching lot numbers, even if cooked",
      "Discard affected products in a sealed container or return to store",
      "Clean and sanitize any surfaces that may have contacted the products",
      "Contact the FDA at 1-800-FDA-1088 to report adverse reactions",
    ],
    healthRisks: "Listeria monocytogenes is particularly dangerous for pregnant women, elderly adults, and immunocompromised individuals. It can cause listeriosis, which presents with fever, muscle aches, nausea, and diarrhea. In severe cases, it can lead to meningitis, septicemia, and can be fatal. Pregnant women face the risk of miscarriage, stillbirth, and serious infection of the newborn.",
    featured: false,
    trending: true,
  },
  {
    id: "r4",
    slug: "costco-imported-cheese-e-coli-concerns",
    title: "Costco Pulls Imported Cheese Over E. coli Concerns",
    subtitle: "French artisan cheese recalled at Costco locations in 22 states",
    severity: "warning",
    pathogen: "E. coli",
    brand: "Fromagerie du Mont-Blanc",
    product: "Artisan Raw Milk Brie",
    category: "Dairy & Eggs",
    categorySlug: "dairy-eggs",
    stores: ["Costco"],
    statesAffected: "22 states — see full list below",
    dateIssued: "2026-02-01",
    recallClass: "II",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
    excerpt: "Costco has removed an imported French brie cheese from shelves after testing by the FDA revealed the presence of Shiga toxin-producing E. coli (STEC).",
    content: `Costco Wholesale has voluntarily recalled Fromagerie du Mont-Blanc Artisan Raw Milk Brie after FDA import testing identified the presence of Shiga toxin-producing E. coli (STEC) in samples of the product.\n\nThe affected cheese was imported from France and sold exclusively at Costco warehouse locations in 22 states between November 2025 and January 2026. The product was sold in the specialty cheese section with a distinctive blue and white label.\n\nNo illnesses have been reported to date, but the FDA is urging consumers who purchased this product to discard it immediately or return it to Costco for a full refund.`,
    lotNumbers: "Lot 2025-11-FR through 2026-01-FR",
    upc: "3-41234-56789-0",
    affectedProducts: [
      { name: "Fromagerie du Mont-Blanc Artisan Brie 500g", size: "500g", upc: "3-41234-56789-0", lot: "2025-11-FR to 2026-01-FR", bestBy: "03/2026" },
    ],
    whatToDo: [
      "Do not consume this product",
      "Return to any Costco location for a full refund — no receipt needed",
      "If you've consumed this cheese and develop symptoms, contact your doctor",
      "Symptoms typically appear 3-4 days after exposure",
      "Report adverse reactions to the FDA at 1-800-FDA-1088",
    ],
    healthRisks: "Shiga toxin-producing E. coli can cause severe stomach cramps, diarrhea (often bloody), and vomiting. Most people recover within 5-7 days, but some infections can be life-threatening, particularly in children under 5 and the elderly, where it can lead to hemolytic uremic syndrome (HUS), a type of kidney failure.",
    featured: false,
    trending: false,
  },
  {
    id: "r5",
    slug: "peanut-butter-aflatoxin-national-recall",
    title: "National Recall: Peanut Butter Brand Tests Positive for Aflatoxin",
    subtitle: "NuttyBest peanut butter recalled due to elevated aflatoxin levels",
    severity: "warning",
    pathogen: "Aflatoxin",
    brand: "NuttyBest",
    product: "Creamy & Crunchy Peanut Butter",
    category: "Packaged Foods",
    categorySlug: "packaged-foods",
    stores: ["Walmart", "Target", "Kroger", "Whole Foods"],
    statesAffected: "Nationwide",
    dateIssued: "2026-01-28",
    recallClass: "II",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    excerpt: "NuttyBest has recalled its popular peanut butter products after testing revealed aflatoxin levels exceeding FDA limits, posing potential long-term health risks.",
    content: `NuttyBest Foods Inc. has issued a nationwide voluntary recall of its creamy and crunchy peanut butter products after internal quality testing revealed aflatoxin levels above the FDA's 20 parts per billion (ppb) action level.\n\nAflatoxins are naturally occurring toxins produced by certain molds that can grow on peanuts and other crops. While typically associated with long-term health effects rather than acute illness, elevated levels are considered a serious food safety concern by the FDA.\n\nThe recall affects all sizes of NuttyBest Creamy and Crunchy peanut butter produced at the company's Georgia facility between September 2025 and January 2026.`,
    lotNumbers: "All lots with 'GA' prefix from Sept 2025 - Jan 2026",
    upc: "0-99876-54321-0 series",
    affectedProducts: [
      { name: "NuttyBest Creamy Peanut Butter 16oz", size: "16 oz", upc: "0-99876-54321-0", lot: "GA-09XX to GA-01XX", bestBy: "09/2026-01/2027" },
      { name: "NuttyBest Crunchy Peanut Butter 16oz", size: "16 oz", upc: "0-99876-54322-7", lot: "GA-09XX to GA-01XX", bestBy: "09/2026-01/2027" },
      { name: "NuttyBest Creamy Peanut Butter 28oz", size: "28 oz", upc: "0-99876-54323-4", lot: "GA-09XX to GA-01XX", bestBy: "09/2026-01/2027" },
    ],
    whatToDo: [
      "Check your pantry for NuttyBest peanut butter with matching lot numbers",
      "Do not consume affected products",
      "Return to place of purchase for a full refund",
      "Contact NuttyBest customer service at 1-800-555-NUTS for additional information",
      "Report concerns to the FDA MedWatch program at 1-800-FDA-1088",
    ],
    healthRisks: "Aflatoxins are potent carcinogens produced by Aspergillus mold species. Short-term exposure to high levels can cause acute liver damage, while long-term exposure to lower levels is associated with increased cancer risk, particularly liver cancer. Children and individuals with existing liver conditions are especially vulnerable.",
    featured: false,
    trending: false,
  },
];

export const guides: BlogGuide[] = [
  {
    id: "g1",
    slug: "how-to-check-if-your-food-has-been-recalled",
    title: "How to Check if Your Food Has Been Recalled",
    subtitle: "Three free methods to stay informed about food safety alerts",
    category: "Food Safety Guides",
    author: "Dr. Sarah Mitchell",
    date: "2026-01-20",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    excerpt: "Food recalls happen more often than you might think — over 300 in 2025 alone. Here are three reliable ways to check if anything in your kitchen has been recalled.",
    content: `Food recalls are more common than most people realize. In 2025 alone, the FDA and USDA issued over 300 food recalls affecting thousands of products. The good news is that staying informed has never been easier.\n\n## Method 1: Check FDA and USDA Websites Directly\n\nThe most reliable source for recall information is the government itself. The FDA maintains a searchable database at FDA.gov/recalls, while the USDA's Food Safety and Inspection Service (FSIS) publishes meat and poultry recalls at fsis.usda.gov/recalls.\n\n## Method 2: Sign Up for Email Alerts\n\nBoth the FDA and USDA offer free email notification services. You can sign up at FoodSafety.gov to receive alerts whenever a new recall is announced. These emails typically arrive within hours of the official announcement.\n\n## Method 3: Use RecallsFood.com\n\nWe aggregate recalls from both the FDA and USDA, add plain-English explanations, and make it easy to search by product, brand, or store. Sign up for our weekly newsletter to get a digest of all recalls delivered to your inbox every Monday.\n\n## What to Do If You Find a Recalled Product\n\n1. **Stop using it immediately** — don't taste-test to see if it seems fine\n2. **Check the specific lot numbers** — not all products from a brand may be affected\n3. **Return it for a refund** or dispose of it properly\n4. **Monitor your health** if you've already consumed the product\n5. **Report any adverse reactions** to the FDA or USDA`,
    tags: ["food-safety", "recalls", "how-to", "fda"],
    featured: true,
  },
  {
    id: "g2",
    slug: "complete-guide-food-thermometer-safety",
    title: "The Complete Guide to Food Thermometer Safety",
    subtitle: "Why a food thermometer is your best defense against foodborne illness",
    category: "Food Safety Guides",
    author: "Chef James Rodriguez",
    date: "2026-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
    excerpt: "A food thermometer is the only reliable way to ensure your food has been cooked to a safe temperature. Here's everything you need to know about choosing and using one.",
    content: `Color and texture are not reliable indicators of whether meat has been cooked to a safe temperature. The only way to know for certain is to use a food thermometer. According to the USDA, using a food thermometer is the single most effective way to prevent foodborne illness from undercooked meat.\n\n## Safe Minimum Internal Temperatures\n\n- **Poultry (whole, parts, ground):** 165°F (74°C)\n- **Ground meats (beef, pork, lamb):** 160°F (71°C)\n- **Beef, pork, lamb (steaks, roasts, chops):** 145°F (63°C) + 3-minute rest\n- **Fish and shellfish:** 145°F (63°C)\n- **Leftovers and casseroles:** 165°F (74°C)\n- **Eggs:** Cook until yolk and white are firm\n\n## Types of Food Thermometers\n\n### Instant-Read Digital Thermometers\nThe most popular and practical choice for home cooks. They give readings in 2-5 seconds and are accurate to within 1°F.\n\n### Oven-Safe Thermometers\nDesigned to remain in food during cooking. Useful for roasts and large cuts of meat.\n\n### Thermocouple Thermometers\nThe fastest and most accurate type, reading temperature in just 1-2 seconds. Popular among professional chefs.\n\n## How to Use a Food Thermometer Correctly\n\n1. Insert into the thickest part of the food\n2. Avoid touching bone, fat, or gristle\n3. Wait for the reading to stabilize\n4. Clean the probe between uses to prevent cross-contamination`,
    tags: ["food-safety", "cooking", "thermometer", "temperature"],
    featured: false,
  },
  {
    id: "g3",
    slug: "understanding-fda-food-recall-classes",
    title: "Understanding FDA Food Recall Classes: I, II, and III",
    subtitle: "What the recall classification means for your safety",
    category: "Food Safety Guides",
    author: "Dr. Sarah Mitchell",
    date: "2026-01-10",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    excerpt: "Not all food recalls are created equal. The FDA classifies recalls into three classes based on the level of health risk. Here's what each class means and how to respond.",
    content: `When the FDA announces a food recall, it assigns a classification that indicates the severity of the health risk. Understanding these classes helps you prioritize which recalls to take most seriously.\n\n## Class I: Dangerous or Defective\n\n**Risk Level: Most Serious**\n\nA Class I recall involves a situation where there is a reasonable probability that the use of or exposure to a product will cause serious adverse health consequences or death.\n\n**Examples:** Food contaminated with Listeria, Salmonella, E. coli O157:H7, or containing dangerous foreign objects like glass or metal.\n\n**What to do:** Take immediate action. Stop consuming the product, discard or return it, and monitor your health.\n\n## Class II: May Cause Temporary Health Problems\n\n**Risk Level: Moderate**\n\nA Class II recall involves a situation where the use of or exposure to a product may cause temporary or medically reversible adverse health consequences, or where the probability of serious adverse health consequences is remote.\n\n**Examples:** Products with undeclared allergens, minor contamination, or labeling errors that could affect people with specific health conditions.\n\n**What to do:** Check your products and take appropriate action, especially if you have allergies or are in a vulnerable health group.\n\n## Class III: Not Likely to Cause Health Problems\n\n**Risk Level: Low**\n\nA Class III recall involves a situation where the use of or exposure to a product is not likely to cause adverse health consequences.\n\n**Examples:** Minor labeling issues, cosmetic defects, or nutrient content discrepancies that don't pose health risks.\n\n**What to do:** Be aware, but don't panic. Follow the manufacturer's instructions for returns or refunds.`,
    tags: ["food-safety", "fda", "recalls", "education"],
    featured: false,
  },
  {
    id: "g4",
    slug: "how-to-store-food-safely-refrigerator-guide",
    title: "How to Store Food Safely: Refrigerator Temperature Guide",
    subtitle: "Keep your family safe with proper food storage practices",
    category: "Food Safety Guides",
    author: "Dr. Emily Park",
    date: "2026-01-05",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
    excerpt: "Your refrigerator is your first line of defense against foodborne bacteria. Learn the optimal temperatures and storage times to keep your food safe.",
    content: `Proper food storage is one of the most important — and most overlooked — aspects of food safety. According to the CDC, approximately 48 million Americans get sick from foodborne illness each year, and improper storage is a leading contributor.\n\n## The Temperature Danger Zone\n\nBacteria multiply rapidly between 40°F (4°C) and 140°F (60°C). This range is known as the "Danger Zone." Food should never be left in this temperature range for more than 2 hours (1 hour if the ambient temperature is above 90°F).\n\n## Refrigerator Guidelines\n\n- **Temperature setting:** 40°F (4°C) or below\n- **Freezer setting:** 0°F (-18°C) or below\n- **Use a thermometer:** Don't trust the built-in dial — use a separate appliance thermometer\n\n## Storage Times (Refrigerator at 40°F)\n\n| Food | Storage Time |\n|------|-------------|\n| Raw ground meats | 1-2 days |\n| Raw steaks, chops | 3-5 days |\n| Raw poultry | 1-2 days |\n| Cooked leftovers | 3-4 days |\n| Opened deli meats | 3-5 days |\n| Hard cheese | 3-4 weeks |\n| Eggs | 3-5 weeks |\n| Fresh berries | 3-7 days |\n\n## Organization Tips\n\n1. **Store raw meats on the bottom shelf** to prevent drips onto other foods\n2. **Keep produce in designated drawers** with proper humidity settings\n3. **Use the "first in, first out" rule** — move older items to the front\n4. **Don't overcrowd** — air needs to circulate for even cooling\n5. **Store leftovers in clear, dated containers**`,
    tags: ["food-safety", "storage", "refrigerator", "kitchen"],
    featured: false,
  },
  {
    id: "g5",
    slug: "most-common-foodborne-pathogens",
    title: "10 Most Common Foodborne Pathogens and How to Avoid Them",
    subtitle: "Know your enemy: a guide to the bacteria, viruses, and parasites in your food",
    category: "Food Safety Guides",
    author: "Dr. Sarah Mitchell",
    date: "2025-12-28",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
    excerpt: "From Salmonella to Norovirus, these are the most common pathogens responsible for foodborne illness in the United States — and how to protect yourself.",
    content: `Each year, the CDC estimates that 48 million Americans get sick, 128,000 are hospitalized, and 3,000 die from foodborne illness. Understanding the most common pathogens can help you take steps to protect yourself and your family.\n\n## 1. Norovirus\n**Cases per year:** ~19-21 million\n**Common sources:** Leafy greens, fresh fruits, shellfish, contaminated water\n**Prevention:** Wash hands thoroughly, wash produce, cook shellfish to 145°F\n\n## 2. Salmonella\n**Cases per year:** ~1.35 million\n**Common sources:** Eggs, poultry, meat, unpasteurized dairy\n**Prevention:** Cook poultry to 165°F, don't eat raw eggs, avoid cross-contamination\n\n## 3. Clostridium perfringens\n**Cases per year:** ~1 million\n**Common sources:** Meat, poultry, gravies kept at unsafe temperatures\n**Prevention:** Keep hot foods above 140°F, refrigerate leftovers within 2 hours\n\n## 4. Campylobacter\n**Cases per year:** ~1.5 million\n**Common sources:** Raw or undercooked poultry, unpasteurized milk\n**Prevention:** Cook poultry thoroughly, practice good kitchen hygiene\n\n## 5. Staphylococcus aureus\n**Cases per year:** ~240,000\n**Common sources:** Foods handled by infected workers — sandwiches, salads, pastries\n**Prevention:** Proper hand washing, keep foods at safe temperatures\n\n## 6. E. coli (STEC)\n**Cases per year:** ~265,000\n**Common sources:** Ground beef, raw produce, unpasteurized juice\n**Prevention:** Cook ground beef to 160°F, wash produce, avoid raw milk\n\n## 7. Listeria monocytogenes\n**Cases per year:** ~1,600 (but very serious)\n**Common sources:** Deli meats, soft cheeses, smoked seafood, raw sprouts\n**Prevention:** Avoid high-risk foods if pregnant/immunocompromised, reheat deli meats\n\n## 8. Toxoplasma\n**Cases per year:** ~87,000\n**Common sources:** Undercooked meat, contaminated water, cat litter\n**Prevention:** Cook meat thoroughly, wash hands after handling raw meat\n\n## 9. Cyclospora\n**Cases per year:** Varies (outbreaks)\n**Common sources:** Imported fresh produce (berries, herbs, lettuce)\n**Prevention:** Wash produce thoroughly (though this may not eliminate all parasites)\n\n## 10. Hepatitis A\n**Cases per year:** ~2,500\n**Common sources:** Shellfish, contaminated produce, infected food handlers\n**Prevention:** Get vaccinated, wash hands, cook shellfish properly`,
    tags: ["food-safety", "pathogens", "bacteria", "health", "education"],
    featured: false,
  },
];

// Categories for navigation
export const categories = [
  { name: "Meat & Poultry", slug: "meat-poultry", icon: "🥩" },
  { name: "Dairy & Eggs", slug: "dairy-eggs", icon: "🧀" },
  { name: "Produce", slug: "produce", icon: "🥬" },
  { name: "Packaged Foods", slug: "packaged-foods", icon: "📦" },
  { name: "Beverages", slug: "beverages", icon: "🥤" },
  { name: "Pet Food", slug: "pet-food", icon: "🐾" },
  { name: "Supplements", slug: "supplements", icon: "💊" },
  { name: "Baby Food", slug: "baby-food", icon: "👶" },
  { name: "Frozen Foods", slug: "frozen-foods", icon: "🧊" },
];

// Stores for filtering
export const stores = [
  { name: "Walmart", slug: "walmart" },
  { name: "Costco", slug: "costco" },
  { name: "Target", slug: "target" },
  { name: "Kroger", slug: "kroger" },
  { name: "Whole Foods", slug: "whole-foods" },
];
