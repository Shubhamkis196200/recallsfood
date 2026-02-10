import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Privacy Policy"
        description="Read the RecallsFood.com privacy policy. Learn how we collect, use, and protect your personal information on our food safety news platform."
        url="/privacy"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: '/' },
        { name: 'Privacy Policy', url: '/privacy' },
      ]} />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-12">Last updated: February 2026</p>

          <div className="space-y-8 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600">
                RecallsFood.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website recallsfood.com and use our services.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We may collect information about you in a variety of ways. The information we may collect includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Personal Data: Name, email address, and contact information you voluntarily provide (e.g., newsletter signup)</li>
                <li>Derivative Data: Information our servers automatically collect when you access the site (IP address, browser type, pages visited)</li>
                <li>Third-Party Data: Information from social media platforms if you connect through them</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Your Information</h2>
              <p className="text-gray-600 mb-4">
                We may use information collected about you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Send you food recall alert newsletters and safety updates</li>
                <li>Respond to your comments, questions, and provide support</li>
                <li>Monitor and analyze usage and trends to improve your experience</li>
                <li>Deliver targeted advertising and promotional materials</li>
                <li>Prevent fraudulent activity and protect against abuse</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclosure of Your Information</h2>
              <p className="text-gray-600">
                We may share information we have collected about you in certain situations:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-4">
                <li>By Law or to Protect Rights: If required by law or to protect our rights</li>
                <li>Third-Party Service Providers: With vendors who perform services for us (e.g., email delivery, analytics)</li>
                <li>Business Transfers: In connection with a merger, sale, or acquisition</li>
                <li>Advertising Partners: Aggregated, non-personally-identifiable data with advertising partners</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amounts of data that are sent to your browser and stored on your device. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security of Your Information</h2>
              <p className="text-gray-600">
                We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
              </p>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Access to the personal information we hold about you</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Objection to processing of your personal information</li>
                <li>Restriction of processing your personal information</li>
              </ul>
            </section>

            <hr className="border-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions or comments about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:contact@recallsfood.com" className="text-red-600 hover:underline">
                  contact@recallsfood.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
