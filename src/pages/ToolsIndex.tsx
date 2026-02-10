import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { tools, toolCategories, getToolsByCategory } from "@/data/tools";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useState } from "react";
import { Search } from "lucide-react";

const ToolsIndex = () => {
  const [search, setSearch] = useState("");
  const filtered = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="50 Free Food Safety Tools | RecallsFood.com"
        description="Free online food safety tools: expiration calculators, cooking temperature charts, unit converters, nutrition calculators, and more. No signup required."
      />
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Food Safety Tools</h1>
            <p className="text-lg text-red-100 max-w-2xl mx-auto mb-8">
              50 free tools to help you stay safe in the kitchen. Calculate expiration dates, check cooking temperatures, track nutrition, and more.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300" size={20} />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

          {filtered ? (
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4">{filtered.length} tools found</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ) : (
            toolCategories.map(cat => {
              const catTools = getToolsByCategory(cat.name);
              return (
                <section key={cat.name} className="mt-12 first:mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.name}
                  </h2>
                  <p className="text-gray-500 mb-6">{catTools.length} tools</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catTools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const ToolCard = ({ tool }: { tool: typeof tools[0] }) => (
  <Link
    to={`/tools/${tool.slug}`}
    className="group block p-5 rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-lg transition-all duration-200 bg-white"
  >
    <div className="flex items-start gap-3">
      <span className={`text-3xl flex-shrink-0 w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </span>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{tool.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
      </div>
    </div>
  </Link>
);

export default ToolsIndex;
