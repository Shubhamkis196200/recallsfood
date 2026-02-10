import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Terms of Use"
        description="Review the Terms of Use for RecallsFood.com. Understand your rights and responsibilities when using our food safety and recall alert website."
        url="/terms"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: '/' },
        { name: 'Terms of Use', url: '/terms' },
      ]} />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs items={[{ label: "Terms of Use" }]} />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Use</h1>
          <p className="text-gray-500 mb-10">Last updated: February 2026</p>

          <div className="space-y-8 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing or using RecallsFood.com, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our website or services.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Disclaimer — Not Medical or Legal Advice</h2>
              <p className="text-gray-600">
                RecallsFood.com provides food safety information for educational and informational purposes only. We are <strong>not affiliated with</strong> the FDA, USDA, CDC, or any government agency. Our content does not constitute medical or legal advice. Always consult official government sources and healthcare professionals for authoritative guidance on food safety concerns.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Intellectual Property Rights</h2>
              <p className="text-gray-600 mb-3">
                Unless otherwise indicated, RecallsFood.com owns or licenses all intellectual property rights in our website and original content, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Editorial content, articles, and written materials</li>
                <li>Website design, layout, and user interface</li>
                <li>Logos, trademarks, and brand elements</li>
                <li>Software and technical infrastructure</li>
              </ul>
              <p className="text-gray-600 mt-3">
                Government recall data referenced on this site is public information. You may view, download, and print pages for personal, non-commercial use.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Acceptable Use</h2>
              <p className="text-gray-600 mb-3">You agree not to use our website:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>In any way that violates applicable laws or regulations</li>
                <li>To transmit any material that is defamatory, offensive, or obscene</li>
                <li>To impersonate any person or misrepresent your affiliation</li>
                <li>To interfere with or disrupt the website or servers</li>
                <li>To collect or harvest information about other users</li>
                <li>To create false or misleading food safety information</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
              <p className="text-gray-600">
                Our website and content are provided "as is" without warranties of any kind. RecallsFood.com shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website. We make reasonable efforts to ensure accuracy but cannot guarantee that all recall information is complete or current.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Modifications to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the website constitutes acceptance of the modified terms.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Use, please contact us at:{" "}
                <a href="mailto:contact@recallsfood.com" className="text-red-600 hover:underline">contact@recallsfood.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
