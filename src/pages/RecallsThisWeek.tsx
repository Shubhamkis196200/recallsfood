import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls } from "@/data/recalls";
import SEO from "@/components/SEO";

const isThisWeek = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  return d >= weekAgo && d <= now;
};

const RecallsThisWeek = () => {
  const weekRecalls = recalls.filter((r) => isThisWeek(r.dateIssued));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="This Week's Food Recalls | RecallsFood" description="Food recalls from the past 7 days. Stay up to date with the latest FDA and USDA recall alerts." />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">This Week's Food Recalls</h1>
          <p className="text-gray-600 mb-8">Food recall alerts from the past 7 days.</p>
          {weekRecalls.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No recalls this week. Browse <a href="/recalls" className="text-red-600 underline">all recalls</a> for the full archive.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weekRecalls.map((recall) => (
                <RecallCard key={recall.id} recall={recall} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecallsThisWeek;
