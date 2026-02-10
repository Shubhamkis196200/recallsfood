import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { Bell, Mail, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="Food Recall Alerts Newsletter | RecallsFood.com"
        description="Get free weekly food recall alerts delivered to your inbox. Never miss a critical food safety recall that could affect your family."
      />
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Newsletter", url: "/newsletter" }]} />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Bell className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Stay Safe with Recall Alerts
            </h1>
            <p className="text-lg text-gray-600">
              Get free weekly food recall alerts delivered to your inbox. Be the first to know when products in your kitchen are recalled.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-800 mb-2">You're Signed Up!</h2>
              <p className="text-gray-600">
                Check your inbox for a confirmation email. You'll start receiving recall alerts with our next weekly digest.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
              >
                Subscribe to Recall Alerts
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Free forever. No spam. Unsubscribe anytime.
              </p>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4">
              <Mail className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">Weekly Digest</h3>
              <p className="text-sm text-gray-600">Every Monday, get a summary of all food recalls from the past week.</p>
            </div>
            <div className="text-center p-4">
              <Bell className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">Breaking Alerts</h3>
              <p className="text-sm text-gray-600">Instant notifications for Class I recalls that pose serious health risks.</p>
            </div>
            <div className="text-center p-4">
              <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-1">Safety Tips</h3>
              <p className="text-sm text-gray-600">Practical food safety advice from our team of experts.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Newsletter;
