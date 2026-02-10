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
        description="Read the Global Luxe Times privacy policy. Learn how we collect, use, and protect your personal information on our luxury fashion editorial platform."
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

          <h1 className="font-serif text-5xl md:text-7xl mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground font-body mb-12">Last updated: November 2025</p>

          <div className="space-y-8 font-body leading-relaxed">
            <section>
              <h2 className="font-serif text-3xl mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                Global Luxe Times ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website luxuryshopping.world and use our services.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We may collect information about you in a variety of ways. The information we may collect includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Personal Data: Name, email address, and contact information you voluntarily provide</li>
                <li>Derivative Data: Information our servers automatically collect when you access the site</li>
                <li>Financial Data: Payment information when you make purchases (processed securely through third-party payment processors)</li>
                <li>Third-Party Data: Information from social media platforms if you connect through them</li>
              </ul>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Use of Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We may use information collected about you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Create and manage your account</li>
                <li>Process your transactions and send related information</li>
                <li>Send you editorial newsletters and promotional materials</li>
                <li>Respond to your comments, questions, and provide customer service</li>
                <li>Monitor and analyze usage and trends to improve your experience</li>
                <li>Prevent fraudulent transactions and protect against criminal activity</li>
              </ul>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Disclosure of Your Information</h2>
              <p className="text-muted-foreground">
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                <li>By Law or to Protect Rights: If required by law or to protect our rights</li>
                <li>Third-Party Service Providers: With vendors who perform services for us</li>
                <li>Business Transfers: In connection with a merger, sale, or acquisition</li>
                <li>Affiliates: We may share information with our corporate affiliates</li>
              </ul>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amounts of data that are sent to your browser and stored on your device. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Security of Your Information</h2>
              <p className="text-muted-foreground">
                We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
              </p>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Your Privacy Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access to the personal information we hold about you</li>
                <li>Correction of inaccurate or incomplete information</li>
                <li>Deletion of your personal information</li>
                <li>Objection to processing of your personal information</li>
                <li>Restriction of processing your personal information</li>
              </ul>
            </section>

            <div className="editorial-divider"></div>

            <section>
              <h2 className="font-serif text-3xl mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions or comments about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:contact@luxuryshopping.world" className="text-gold hover:underline">
                  contact@luxuryshopping.world
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
