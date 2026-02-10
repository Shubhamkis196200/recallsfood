import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";

const BlogIndex = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="Food Safety Blog | RecallsFood.com"
        description="Expert articles on food recalls, safety tips, outbreak analysis, and consumer guides. Stay informed about food safety."
      />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }]} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Safety Blog</h1>
          <p className="text-gray-600 mb-8">
            Expert analysis, recall roundups, and food safety tips to keep your family safe.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
