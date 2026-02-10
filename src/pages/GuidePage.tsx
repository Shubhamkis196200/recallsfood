import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { guides } from "@/data/recalls";
import SEO from "@/components/SEO";

const GuidePage = () => {
  const { slug } = useParams();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <Link to="/guides" className="text-red-600 font-medium hover:text-red-700">← Browse All Guides</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title={`${guide.title} | RecallsFood`} description={guide.excerpt} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/guides" className="hover:text-red-600">Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 line-clamp-1">{guide.title}</span>
          </nav>

          <div className="max-w-3xl mx-auto">
            <span className="text-sm text-red-600 font-semibold uppercase tracking-wider">{guide.category}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-3 leading-tight">{guide.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{guide.subtitle}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>By {guide.author}</span>
              <span>•</span>
              <span>{new Date(guide.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span>•</span>
              <span>{guide.readTime}</span>
            </div>

            <img src={guide.image} alt={guide.title} className="w-full h-64 lg:h-80 object-cover rounded-lg mb-8" />

            <div className="prose prose-gray max-w-none mb-10">
              {guide.content.split("\n\n").map((block, i) => {
                if (block.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{block.replace("## ", "")}</h2>;
                }
                if (block.startsWith("### ")) {
                  return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-3">{block.replace("### ", "")}</h3>;
                }
                if (block.startsWith("- ") || block.startsWith("1. ")) {
                  const items = block.split("\n").filter(Boolean);
                  return (
                    <ul key={i} className="space-y-2 mb-4 ml-4">
                      {items.map((item, j) => (
                        <li key={j} className="text-gray-700 leading-relaxed list-disc">{item.replace(/^[-\d.]+\s*\*?\*?/, "").replace(/\*\*/g, "")}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-gray-700 leading-relaxed mb-4">{block}</p>;
              })}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {guide.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#{tag}</span>
              ))}
            </div>

            <NewsletterSignup />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuidePage;
