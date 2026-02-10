import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/recalls";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top alert bar */}
      <div className="bg-red-600 text-white text-center text-xs py-1.5 px-4 font-medium">
        ⚠️ 3 Active Class I Recalls — <Link to="/recalls/chicken-products-recalled-salmonella-risk" className="underline font-bold">View Latest Alert</Link>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">RecallsFood</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">Food Safety News & Alerts</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Home</Link>
            <Link to="/recalls" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">All Recalls</Link>
            <Link to="/guides" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Guides</Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">About</Link>
            <Link to="/search" className="text-gray-500 hover:text-red-600 transition-colors">
              <Search size={18} />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category nav bar */}
      <div className="bg-slate-50 border-t border-gray-100 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
            <span className="text-gray-300 mx-2">|</span>
            <Link to="/stores/walmart" className="text-xs font-medium text-gray-600 hover:text-red-600 px-2 py-1.5 transition-colors">Walmart</Link>
            <Link to="/stores/costco" className="text-xs font-medium text-gray-600 hover:text-red-600 px-2 py-1.5 transition-colors">Costco</Link>
            <Link to="/stores/target" className="text-xs font-medium text-gray-600 hover:text-red-600 px-2 py-1.5 transition-colors">Target</Link>
            <Link to="/stores/kroger" className="text-xs font-medium text-gray-600 hover:text-red-600 px-2 py-1.5 transition-colors">Kroger</Link>
            <Link to="/stores/whole-foods" className="text-xs font-medium text-gray-600 hover:text-red-600 px-2 py-1.5 transition-colors">Whole Foods</Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Home</Link>
            <Link to="/recalls" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">All Recalls</Link>
            <Link to="/guides" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Guides</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">About</Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Search</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Contact</Link>
            <hr className="border-gray-200" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-gray-600 py-1 pl-2"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
