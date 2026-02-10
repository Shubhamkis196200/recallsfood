import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Contact Us"
        description="Contact RecallsFood.com for food safety tips, recall reporting, editorial inquiries, or partnership opportunities."
        url="/contact"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: '/' },
        { name: 'Contact', url: '/contact' },
      ]} />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs items={[{ label: "Contact" }]} />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Contact Us</h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Email</div>
                      <a href="mailto:contact@recallsfood.com" className="hover:text-red-600 transition-colors">
                        contact@recallsfood.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Report a Food Safety Issue
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If you believe you have a food safety concern or want to report a potential recall, please contact the appropriate government agency:
                </p>
                <ul className="text-sm text-gray-600 mt-3 space-y-2">
                  <li>
                    <strong>FDA:</strong>{" "}
                    <a href="https://www.safetyreporting.hhs.gov" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                      SafetyReporting.hhs.gov
                    </a>{" "}
                    or call 1-800-FDA-1088
                  </li>
                  <li>
                    <strong>USDA Meat/Poultry:</strong>{" "}
                    Call 1-888-674-6854
                  </li>
                </ul>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Editorial & Partnerships</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  For editorial inquiries, press releases, or partnership opportunities related to food safety, please use the contact form or email us directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Send a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject *</label>
                  <Input id="subject" placeholder="What is this regarding?" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                  <Textarea id="message" placeholder="Your message..." rows={6} required />
                </div>
                <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700 transition-colors font-medium">
                  Send Message
                </Button>
                <p className="text-xs text-gray-500">
                  * This is a demonstration form. Messages are not currently being processed.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
