import { useState } from "react";

export const NewsletterSignup = ({ variant = "default" }: { variant?: "default" | "hero" | "footer" }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className={`text-center p-4 rounded-lg ${variant === "footer" ? "bg-white/10" : "bg-green-50 border border-green-200"}`}>
        <p className={`font-medium ${variant === "footer" ? "text-white" : "text-green-800"}`}>
          ✓ You're signed up! Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  const isHero = variant === "hero";
  const isFooter = variant === "footer";

  return (
    <div className={`${isFooter ? "" : "bg-slate-50 border border-gray-200 rounded-lg p-6"}`}>
      {!isFooter && (
        <>
          <h3 className={`font-bold mb-1 ${isHero ? "text-xl text-gray-900" : "text-lg text-gray-900"}`}>
            📧 Get Recall Alerts
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Stay informed. Get weekly recall summaries and breaking Class I alerts delivered to your inbox.
          </p>
        </>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className={`flex-1 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
            isFooter ? "bg-white/10 border-white/20 text-white placeholder:text-white/60" : "border-gray-300 bg-white text-gray-900"
          }`}
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};
