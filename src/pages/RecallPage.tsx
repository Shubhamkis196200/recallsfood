import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeverityBadge } from "@/components/SeverityBadge";
import { PathogenTag } from "@/components/PathogenTag";
import { RecallCard } from "@/components/RecallCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { recalls } from "@/data/recalls";
import SEO from "@/components/SEO";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const RecallPage = () => {
  const { slug } = useParams();
  const recall = recalls.find((r) => r.slug === slug);

  if (!recall) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recall Not Found</h1>
          <p className="text-gray-600 mb-6">The recall you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-red-600 font-medium hover:text-red-700">← Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedRecalls = recalls.filter((r) => r.id !== recall.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title={`${recall.title} | RecallsFood`}
        description={recall.excerpt}
      />
      <ArticleJsonLd
        title={recall.title}
        description={recall.excerpt}
        url={`/recalls/${recall.slug}`}
        image={recall.image}
        publishedTime={recall.dateIssued}
        authorName="RecallsFood Team"
        section="Food Recalls"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Recalls", url: "/recalls" },
          { name: recall.brand, url: `/recalls/${recall.slug}` },
        ]}
      />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/recalls" className="hover:text-red-600">Recalls</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{recall.brand}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Alert Box */}
              <div className={`border-2 rounded-lg p-5 mb-8 ${
                recall.severity === "critical" ? "border-red-500 bg-red-50" :
                recall.severity === "warning" ? "border-orange-400 bg-orange-50" :
                "border-yellow-400 bg-yellow-50"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚠️</span>
                  <span className="font-bold text-gray-900 uppercase text-sm tracking-wider">Recall Alert</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold text-gray-700">Product:</span> <span className="text-gray-900">{recall.product}</span></div>
                  <div><span className="font-semibold text-gray-700">Brand:</span> <span className="text-gray-900">{recall.brand}</span></div>
                  <div><span className="font-semibold text-gray-700">Reason:</span> <PathogenTag pathogen={recall.pathogen} /></div>
                  <div><span className="font-semibold text-gray-700">Risk Level:</span> <span className="text-gray-900">Class {recall.recallClass}</span></div>
                  <div><span className="font-semibold text-gray-700">Date Issued:</span> <span className="text-gray-900">{new Date(recall.dateIssued).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
                  <div><span className="font-semibold text-gray-700">States:</span> <span className="text-gray-900">{recall.statesAffected}</span></div>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <SeverityBadge severity={recall.severity} />
                <PathogenTag pathogen={recall.pathogen} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{recall.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{recall.subtitle}</p>

              <img
                src={recall.image}
                alt={recall.title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg mb-8"
              />

              {/* Content */}
              <div className="prose prose-gray max-w-none mb-10">
                {recall.content.split("\n\n").map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">{p}</p>
                ))}
              </div>

              {/* Affected Products Table */}
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Affected Products</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Product</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Size</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">UPC</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Lot</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Best By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recall.affectedProducts.map((product, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-gray-600">{product.size}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{product.upc}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{product.lot}</td>
                          <td className="px-4 py-3 text-gray-600">{product.bestBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Where Sold */}
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Where It Was Sold</h2>
                <div className="flex flex-wrap gap-2">
                  {recall.stores.map((store) => (
                    <Link
                      key={store}
                      to={`/stores/${store.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {store}
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Affected area: {recall.statesAffected}</p>
              </section>

              {/* What To Do */}
              <section className="mb-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🛡️ What To Do If You Have This Product</h2>
                <ol className="space-y-3">
                  {recall.whatToDo.map((step, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Health Risks */}
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Health Risks</h2>
                <p className="text-gray-700 leading-relaxed">{recall.healthRisks}</p>
              </section>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              <NewsletterSignup />

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Related Recalls</h3>
                <div className="space-y-4">
                  {relatedRecalls.map((r) => (
                    <Link key={r.id} to={`/recalls/${r.slug}`} className="block group">
                      <div className="flex gap-3">
                        <img src={r.image} alt={r.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">{r.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{r.dateIssued}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecallPage;
