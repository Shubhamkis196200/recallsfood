import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls, categories } from "@/data/recalls";
import SEO from "@/components/SEO";

const CategoryPage = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const categoryRecalls = recalls.filter((r) => r.categorySlug === slug);
  const categoryName = category?.name || slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Category";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title={`${categoryName} Recalls | RecallsFood`} description={`Food recalls for ${categoryName}. Stay informed about the latest safety alerts.`} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category?.icon} {categoryName} Recalls</h1>
          <p className="text-gray-600 mb-8">All food recalls in the {categoryName} category.</p>

          {categoryRecalls.length > 0 ? (
            <div className="space-y-4">
              {categoryRecalls.map((recall) => (
                <RecallCard key={recall.id} recall={recall} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg mb-2">No active recalls in this category</p>
              <p className="text-gray-400 text-sm">Check back later or <Link to="/" className="text-red-600 hover:text-red-700">browse all recalls</Link>.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
