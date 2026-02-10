import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls, stores } from "@/data/recalls";
import SEO from "@/components/SEO";

const StorePage = () => {
  const { slug } = useParams();
  const store = stores.find((s) => s.slug === slug);
  const storeName = store?.name || slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Store";
  const storeRecalls = recalls.filter((r) => r.stores.some((s) => s.toLowerCase().replace(/\s+/g, "-") === slug));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title={`${storeName} Food Recalls | RecallsFood`} description={`Current and recent food recalls at ${storeName}. Check if products you bought have been recalled.`} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/recalls" className="hover:text-red-600">Recalls</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{storeName}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{storeName} Food Recalls</h1>
          <p className="text-gray-600 mb-8">All food recalls affecting products sold at {storeName} locations.</p>

          {storeRecalls.length > 0 ? (
            <div className="space-y-4">
              {storeRecalls.map((recall) => (
                <RecallCard key={recall.id} recall={recall} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg mb-2">No active recalls for {storeName}</p>
              <p className="text-gray-400 text-sm">Check back later or <Link to="/" className="text-red-600 hover:text-red-700">browse all recalls</Link>.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StorePage;
