import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls } from "@/data/recalls";
import SEO from "@/components/SEO";

const RecallsList = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="All Food Recalls | RecallsFood" description="Browse all active food recalls from the FDA and USDA. Search by product, brand, store, or pathogen." />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Food Recalls</h1>
          <p className="text-gray-600 mb-8">Stay up to date with the latest food recall alerts from the FDA and USDA.</p>
          <div className="space-y-4">
            {recalls.map((recall) => (
              <RecallCard key={recall.id} recall={recall} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecallsList;
