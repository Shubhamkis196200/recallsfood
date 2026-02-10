import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RecallCard } from "@/components/RecallCard";
import { recalls } from "@/data/recalls";
import SEO from "@/components/SEO";

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

const RecallsToday = () => {
  const todayRecalls = recalls.filter((r) => isToday(r.dateIssued));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO title="Today's Food Recalls | RecallsFood" description="Food recalls issued today. Check the latest FDA and USDA recall alerts affecting your family." />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Food Recalls</h1>
          <p className="text-gray-600 mb-8">Food recall alerts issued today from the FDA and USDA.</p>
          {todayRecalls.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No new recalls issued today. Check back later or browse <a href="/recalls" className="text-red-600 underline">all recalls</a>.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayRecalls.map((recall) => (
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

export default RecallsToday;
