import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="About Us"
        description="Learn about RecallsFood.com — your trusted source for food recall alerts, FDA safety news, and consumer protection information."
        url="/about"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ]} />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs items={[{ label: "About" }]} />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">About RecallsFood.com</h1>

          <div className="space-y-10 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                RecallsFood.com exists for one reason: to make food safety information accessible, understandable, and actionable for everyday consumers. We bridge the gap between government recall databases and the people who need to know if their food is safe.
              </p>
              <p className="text-gray-600 mt-4">
                With over 300 food recalls in 2025 alone — from Listeria in frozen vegetables to Salmonella in chicken products — staying informed has never been more important. We monitor FDA and USDA announcements daily and translate them into clear, actionable alerts.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-600 mb-2">🚨 Recall Alerts</h3>
                  <p className="text-gray-600 text-base">
                    Same-day coverage of FDA and USDA food recalls with plain-English explanations, affected product lists, and clear instructions on what to do.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-orange-500 mb-2">🦠 Outbreak Tracking</h3>
                  <p className="text-gray-600 text-base">
                    Ongoing monitoring of foodborne illness outbreaks including Listeria, Salmonella, E. coli, and Norovirus investigations.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-teal-600 mb-2">📋 Safety Guides</h3>
                  <p className="text-gray-600 text-base">
                    Comprehensive guides on food storage, safe cooking temperatures, understanding recall classes, and protecting vulnerable family members.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-2">🏪 Store Recalls</h3>
                  <p className="text-gray-600 text-base">
                    Recalls organized by retailer — Walmart, Costco, Target, Kroger, and more — so you can quickly check products from your store.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Sources</h2>
              <p className="text-gray-600">
                All recall information published on RecallsFood.com is sourced from official government agencies:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
                <li><strong>FDA</strong> — U.S. Food and Drug Administration recall announcements</li>
                <li><strong>USDA FSIS</strong> — Food Safety and Inspection Service (meat, poultry, egg products)</li>
                <li><strong>CDC</strong> — Centers for Disease Control and Prevention outbreak investigations</li>
                <li><strong>FoodSafety.gov</strong> — U.S. government food safety portal</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-600">
                RecallsFood.com is an independent consumer information service. We are <strong>not affiliated with</strong> the FDA, USDA, CDC, or any government agency. We aggregate and interpret publicly available recall data to help consumers stay safe. Always refer to official government sources for the most authoritative recall information.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                Have a tip about a recall? Questions about food safety? We welcome your feedback and inquiries. Visit our{" "}
                <a href="/contact" className="text-red-600 hover:underline">contact page</a> to get in touch.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
