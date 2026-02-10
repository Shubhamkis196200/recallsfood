import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls, guides } from "@/data/recalls";
import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const filteredRecalls = query.length > 1
    ? recalls.filter((r) =>
        [r.title, r.brand, r.product, r.pathogen, ...r.stores, r.category].some((f) =>
          f.toLowerCase().includes(query.toLowerCase())
        )
      )
    : [];

  const filteredGuides = query.length > 1
    ? guides.filter((g) =>
        [g.title, g.excerpt, ...g.tags].some((f) =>
          f.toLowerCase().includes(query.toLowerCase())
        )
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="Search Food Recalls | RecallsFood" description="Search for food recalls by product, brand, store, or pathogen." />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Recalls & Guides</h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, brand, store, or pathogen..."
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-8"
            autoFocus
          />

          {query.length > 1 && (
            <>
              {filteredRecalls.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Recalls ({filteredRecalls.length})</h2>
                  <div className="space-y-4">
                    {filteredRecalls.map((r) => <RecallCard key={r.id} recall={r} />)}
                  </div>
                </div>
              )}

              {filteredGuides.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Guides ({filteredGuides.length})</h2>
                  <div className="space-y-3">
                    {filteredGuides.map((g) => (
                      <Link key={g.id} to={`/guides/${g.slug}`} className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-gray-900">{g.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{g.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredRecalls.length === 0 && filteredGuides.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No results found for "{query}"</p>
                  <p className="text-gray-400 text-sm mt-2">Try searching for a product, brand, store, or pathogen name.</p>
                </div>
              )}
            </>
          )}

          {query.length <= 1 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Start typing to search recalls and guides</p>
              <p className="text-sm mt-2">Try: "chicken", "Walmart", "Listeria", "baby food"</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
