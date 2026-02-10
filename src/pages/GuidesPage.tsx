import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { guides } from "@/data/recalls";
import SEO from "@/components/SEO";

const GuidesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="Food Safety Guides | RecallsFood" description="Expert food safety guides, tips, and educational content to help you keep your family safe." />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Food Safety Guides</h1>
          <p className="text-gray-600 mb-8">Expert guides to help you keep your family safe from foodborne illness.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Link key={guide.id} to={`/guides/${guide.slug}`} className="group">
                <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <img src={guide.image} alt={guide.title} className="w-full h-48 object-cover" loading="lazy" />
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs text-red-600 font-semibold uppercase tracking-wider mb-2">{guide.category}</span>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-2">{guide.title}</h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-1">{guide.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{guide.author}</span>
                      <span>{guide.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuidesPage;
