import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls } from "@/data/recalls";
import { articles } from "@/data/articles";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Link } from "react-router-dom";

const Archive = () => {
  // Group recalls by month
  const recallsByMonth: Record<string, typeof recalls> = {};
  recalls.forEach((r) => {
    const month = r.dateIssued.slice(0, 7); // YYYY-MM
    if (!recallsByMonth[month]) recallsByMonth[month] = [];
    recallsByMonth[month].push(r);
  });

  const months = Object.keys(recallsByMonth).sort().reverse();

  const formatMonth = (ym: string) => {
    const [year, month] = ym.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="Food Recall Archive | RecallsFood.com"
        description="Browse all food recalls by month. Complete archive of FDA and USDA food safety recalls."
      />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Archive", url: "/archive" }]} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recall Archive</h1>
          <p className="text-gray-600 mb-8">Browse all food recalls by month.</p>

          {months.map((month) => (
            <div key={month} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {formatMonth(month)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recallsByMonth[month].map((recall) => (
                  <RecallCard key={recall.id} recall={recall} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Archive;
