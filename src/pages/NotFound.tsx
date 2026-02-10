import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { tools } from "@/data/tools";
import { recalls } from "@/data/recalls";
import SEO from "@/components/SEO";

const NotFound = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchResults = query.trim()
    ? [
        ...tools
          .filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
          .map(t => ({ type: "tool", title: t.name, path: `/tools/${t.slug}`, desc: t.description })),
        ...recalls
          .filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.brand.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
          .map(r => ({ type: "recall", title: r.title, path: `/recalls/${r.slug}`, desc: `${r.brand} — ${r.date}` })),
      ]
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="Page Not Found — 404 | RecallsFood.com" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl font-bold text-red-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist. It may have been moved or deleted.
          </p>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search recalls, tools, or guides..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="mb-8 text-left">
              <p className="text-sm text-gray-500 mb-3">Did you mean:</p>
              <div className="space-y-2">
                {searchResults.map((r, i) => (
                  <Link
                    key={i}
                    to={r.path}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-red-200 hover:shadow-md transition-all"
                  >
                    <span className="text-xs text-red-600 uppercase font-semibold">{r.type}</span>
                    <h3 className="font-medium text-gray-900">{r.title}</h3>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Go Home
            </Link>
            <Link to="/recalls" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Browse Recalls
            </Link>
            <Link to="/tools" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Browse Tools
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
