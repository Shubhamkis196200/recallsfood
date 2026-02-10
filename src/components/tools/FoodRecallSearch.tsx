import { useState } from "react";
import { recalls } from "@/data/recalls";
import { Link } from "react-router-dom";

const FoodRecallSearch = () => {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();
  const results = q ? recalls.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.brand.toLowerCase().includes(q) ||
    r.product.toLowerCase().includes(q) ||
    r.reason.toLowerCase().includes(q)
  ) : [];

  return (
    <div className="space-y-4">
      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search recalls by product, brand, or reason..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />

      {q && (
        <p className="text-sm text-gray-500">{results.length} recall{results.length !== 1 ? "s" : ""} found</p>
      )}

      <div className="space-y-3">
        {results.map(r => (
          <Link key={r.slug} to={`/recalls/${r.slug}`} className="block p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-red-600">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{r.brand} — {r.product}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                r.classification === "Class I" ? "bg-red-100 text-red-700" :
                r.classification === "Class II" ? "bg-orange-100 text-orange-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>{r.classification}</span>
            </div>
          </Link>
        ))}
      </div>

      {!q && <p className="text-sm text-gray-400 text-center py-4">Start typing to search through recent food recalls</p>}
    </div>
  );
};

export default FoodRecallSearch;
