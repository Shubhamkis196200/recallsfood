import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { RecallCard } from "@/components/RecallCard";
import { useFeaturedPosts, useTrendingPosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";
import WebsiteJsonLd from "@/components/WebsiteJsonLd";
import { SearchBar } from "@/components/SearchBar";
import { recalls, guides, categories } from "@/data/recalls";
import { AlertTriangle, Shield, Search, Bell } from "lucide-react";

const Index = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedPosts();
  const { data: trending, isLoading: loadingTrending } = useTrendingPosts();
  const { data: dbCategories } = useCategories();

  const latestRecalls = recalls.slice(0, 3);
  const featuredGuides = guides.filter((g) => g.featured).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <WebsiteJsonLd />
      <Header />

      <main>
        {/* Hero Section — Food Recall Alert */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 text-white">
          <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-4">
                <AlertTriangle size={16} />
                <span>FOOD RECALL ALERTS</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Stay Safe.<br />Stay Informed.
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                Your trusted source for food recall alerts from the FDA and USDA. 
                Check if your food has been recalled and learn what to do to protect your family.
              </p>
              <div className="max-w-xl">
                <SearchBar placeholder="Search by product, brand, or store..." />
              </div>
            </div>
          </div>
        </section>

        {/* Category Quick Nav */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="flex-shrink-0 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-full border border-gray-200 hover:border-red-200 transition-colors"
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Recall Alerts */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Recall Alerts</h2>
            </div>
            <Link to="/recalls" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              View All Recalls →
            </Link>
          </div>
          <div className="space-y-4">
            {latestRecalls.map((recall) => (
              <RecallCard key={recall.id} recall={recall} />
            ))}
          </div>
        </section>

        {/* CMS Featured Articles (from database) */}
        {!loadingFeatured && featured && featured.length > 0 && (
          <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Stories</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Food Safety Guides */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-teal-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Food Safety Guides</h2>
            </div>
            <Link to="/guides" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              All Guides →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.slice(0, 3).map((guide) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img src={guide.image} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">{guide.category}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-2">{guide.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{guide.excerpt}</p>
                  <div className="mt-3 text-xs text-gray-500">{guide.readTime} · {guide.author}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-red-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <Bell className="mx-auto mb-4" size={32} />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Get Recall Alerts Delivered to Your Inbox</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Weekly recall summaries + breaking Class I alerts. Be the first to know when a product in your kitchen is recalled.
            </p>
            <Link
              to="/newsletter"
              className="inline-block bg-white text-red-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe Free →
            </Link>
          </div>
        </section>

        {/* Quick Info Cards */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <AlertTriangle className="mx-auto mb-3 text-red-600" size={32} />
              <h3 className="font-bold text-lg mb-2">Real-Time Alerts</h3>
              <p className="text-sm text-gray-600">We monitor FDA and USDA recall announcements and publish alerts the same day.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Search className="mx-auto mb-3 text-orange-500" size={32} />
              <h3 className="font-bold text-lg mb-2">Easy to Search</h3>
              <p className="text-sm text-gray-600">Find recalls by product name, brand, store, or food category in seconds.</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Shield className="mx-auto mb-3 text-teal-600" size={32} />
              <h3 className="font-bold text-lg mb-2">Expert Guides</h3>
              <p className="text-sm text-gray-600">Plain-English guides on food safety, pathogens, and what to do if you ate recalled food.</p>
            </div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse by Category</h2>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="group bg-white border border-gray-200 p-6 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                >
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
