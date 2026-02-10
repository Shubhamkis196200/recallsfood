import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { recalls } from "@/data/recalls";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

interface PathogenInfo {
  name: string;
  slug: string;
  description: string;
  symptoms: string;
  riskGroups: string;
  prevention: string[];
  incubation: string;
  commonSources: string[];
}

const pathogens: Record<string, PathogenInfo> = {
  salmonella: {
    name: "Salmonella",
    slug: "salmonella",
    description:
      "Salmonella is one of the most common causes of foodborne illness in the United States, responsible for approximately 1.35 million infections annually. It is a group of bacteria found in raw poultry, eggs, beef, and sometimes on unwashed fruits and vegetables.",
    symptoms:
      "Diarrhea, fever, stomach cramps, nausea, and vomiting. Symptoms typically appear 6 hours to 6 days after infection and last 4–7 days.",
    riskGroups: "Children under 5, adults over 65, and people with weakened immune systems are most at risk for severe illness.",
    prevention: [
      "Cook poultry to an internal temperature of 165°F",
      "Don't eat raw or undercooked eggs",
      "Wash hands after handling raw meat",
      "Avoid cross-contamination in the kitchen",
      "Refrigerate perishable foods within 2 hours",
    ],
    incubation: "6 hours to 6 days",
    commonSources: ["Eggs", "Poultry", "Raw meat", "Unpasteurized milk", "Raw fruits and vegetables"],
  },
  "e-coli": {
    name: "E. coli (STEC)",
    slug: "e-coli",
    description:
      "Shiga toxin-producing E. coli (STEC) is a dangerous strain of bacteria that can cause severe illness. While most E. coli strains are harmless, STEC produces toxins that damage the lining of the intestine and can lead to life-threatening complications.",
    symptoms:
      "Severe stomach cramps, bloody diarrhea, and vomiting. Some people may develop a low-grade fever. Symptoms usually appear 3–4 days after exposure.",
    riskGroups: "Children under 5 are at highest risk for developing hemolytic uremic syndrome (HUS), a potentially fatal kidney complication.",
    prevention: [
      "Cook ground beef to 160°F internal temperature",
      "Wash all produce thoroughly under running water",
      "Avoid unpasteurized milk and juice",
      "Wash hands after contact with animals",
      "Prevent cross-contamination in the kitchen",
    ],
    incubation: "3–4 days (range: 1–10 days)",
    commonSources: ["Ground beef", "Raw produce (lettuce, spinach)", "Unpasteurized milk and juice", "Raw flour", "Contaminated water"],
  },
  listeria: {
    name: "Listeria monocytogenes",
    slug: "listeria",
    description:
      "Listeria monocytogenes causes listeriosis, one of the most serious foodborne infections. While relatively rare (about 1,600 cases per year in the U.S.), it has a high fatality rate of approximately 20–30% among those hospitalized.",
    symptoms:
      "Fever, muscle aches, nausea, and diarrhea. In severe cases, headache, stiff neck, confusion, loss of balance, and convulsions. Pregnant women may experience mild flu-like symptoms but the infection can cause miscarriage or stillbirth.",
    riskGroups: "Pregnant women, newborns, adults 65+, and immunocompromised individuals.",
    prevention: [
      "Avoid unpasteurized dairy products and soft cheeses",
      "Reheat deli meats and hot dogs to 165°F before eating",
      "Don't eat refrigerated smoked seafood unless cooked",
      "Wash raw produce thoroughly",
      "Keep refrigerator at 40°F or below",
      "Clean refrigerator regularly, especially after spills",
    ],
    incubation: "1–4 weeks (can be up to 70 days)",
    commonSources: ["Deli meats", "Soft cheeses", "Smoked seafood", "Raw sprouts", "Unpasteurized milk"],
  },
  norovirus: {
    name: "Norovirus",
    slug: "norovirus",
    description:
      "Norovirus is the leading cause of foodborne illness in the United States, causing an estimated 19–21 million illnesses each year. It is highly contagious and can spread through contaminated food, water, surfaces, or person-to-person contact.",
    symptoms:
      "Nausea, vomiting, diarrhea, and stomach cramps. May also include low-grade fever, headache, and body aches. Symptoms appear 12–48 hours after exposure and usually last 1–3 days.",
    riskGroups: "Young children, older adults, and immunocompromised individuals are at risk for severe dehydration.",
    prevention: [
      "Wash hands thoroughly with soap and water (hand sanitizer is not as effective)",
      "Wash fruits and vegetables before eating",
      "Cook shellfish to 145°F or higher",
      "Clean and disinfect contaminated surfaces with bleach",
      "Do not prepare food for others when sick",
    ],
    incubation: "12–48 hours",
    commonSources: ["Leafy greens", "Fresh fruits", "Shellfish", "Contaminated water", "Ready-to-eat foods handled by infected workers"],
  },
};

const PathogenPage = () => {
  const { slug } = useParams();
  const pathogen = slug ? pathogens[slug] : undefined;

  if (!pathogen) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pathogen Not Found</h1>
          <p className="text-gray-600 mb-6">The pathogen page you're looking for doesn't exist.</p>
          <div className="space-y-2">
            <p className="font-medium">Browse pathogens:</p>
            {Object.values(pathogens).map((p) => (
              <Link key={p.slug} to={`/pathogens/${p.slug}`} className="block text-red-600 hover:text-red-700">
                {p.name}
              </Link>
            ))}
          </div>
          <Link to="/" className="block mt-6 text-red-600 font-medium hover:text-red-700">← Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedRecalls = recalls.filter(
    (r) => r.pathogen.toLowerCase().replace(". ", "-").replace(" ", "-") === slug || r.pathogen.toLowerCase() === slug
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title={`${pathogen.name}: Symptoms, Risks & Food Safety | RecallsFood.com`}
        description={`Learn about ${pathogen.name} — symptoms, at-risk groups, prevention tips, and related food recalls.`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Pathogens", url: "/pathogens/salmonella" },
          { name: pathogen.name, url: `/pathogens/${pathogen.slug}` },
        ]}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-red-600">Home</Link> / <span className="text-gray-900">{pathogen.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pathogen.name}</h1>
          <p className="text-lg text-gray-700 mb-8">{pathogen.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-red-800 mb-2">⚠️ Symptoms</h2>
              <p className="text-gray-700">{pathogen.symptoms}</p>
              <p className="text-sm text-gray-500 mt-2"><strong>Incubation period:</strong> {pathogen.incubation}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-amber-800 mb-2">👥 Who's Most At Risk</h2>
              <p className="text-gray-700">{pathogen.riskGroups}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Common Food Sources</h2>
            <div className="flex flex-wrap gap-2">
              {pathogen.commonSources.map((source) => (
                <span key={source} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{source}</span>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">🛡️ Prevention Tips</h2>
            <ul className="space-y-2">
              {pathogen.prevention.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {relatedRecalls.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Recalls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedRecalls.map((recall) => (
                  <RecallCard key={recall.id} recall={recall} />
                ))}
              </div>
            </div>
          )}

          <NewsletterSignup />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PathogenPage;
