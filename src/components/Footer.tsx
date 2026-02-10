import { Link } from "react-router-dom";
import { NewsletterSignup } from "./NewsletterSignup";
import { categories } from "@/data/recalls";

export const Footer = () => {
  return (
    <footer className="bg-[#1E3A5F] text-white mt-16">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-bold mb-2">📧 Stay Safe — Subscribe to Recall Alerts</h3>
            <p className="text-sm text-white/70 mb-4">Weekly recall summaries + breaking Class I alerts. No spam, ever.</p>
            <NewsletterSignup variant="footer" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg">RecallsFood</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Your trusted source for food recall alerts, safety news, and consumer protection information.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-white/70 hover:text-white transition-colors">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stores */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Recalls by Store</h4>
            <ul className="space-y-2">
              {["Walmart", "Costco", "Target", "Kroger", "Whole Foods"].map((store) => (
                <li key={store}>
                  <Link to={`/stores/${store.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-white/70 hover:text-white transition-colors">
                    {store}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/guides" className="text-sm text-white/70 hover:text-white transition-colors">Safety Guides</Link></li>
              <li><Link to="/about" className="text-sm text-white/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} RecallsFood.com — All rights reserved. Not affiliated with the FDA or USDA.
          </p>
          <div className="flex gap-4 text-xs text-white/50">
            <a href="https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">FDA Recalls</a>
            <a href="https://www.fsis.usda.gov/recalls" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">USDA FSIS</a>
            <a href="https://www.foodsafety.gov" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">FoodSafety.gov</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
