import { useState } from "react";
import {
  GraduationCap, Search, ChevronDown, ChevronUp,
  User, BookOpen, CreditCard, Shield, ArrowRight
} from "lucide-react";
import Footer from "@/components/common/Footer";

const faqData = [
  {
    category: "General",
    icon: GraduationCap,
    color: "bg-indigo-50 text-indigo-600",
    faqs: [
      {
        q: "What is Learnify?",
        a: "Learnify is an online learning platform that connects students with expert educators. We offer 500+ courses across tech, design, business, and more — helping you build career-ready skills at your own pace.",
      },
      {
        q: "Is Learnify free to use?",
        a: "Learnify offers both free and paid courses. You can create a free account, browse the catalog, and enroll in free courses immediately. Premium courses require a one-time purchase or a subscription plan.",
      },
      {
        q: "What devices can I use to access Learnify?",
        a: "Learnify works on any modern browser on desktop, tablet, and mobile. We also have a mobile app (iOS & Android) that supports offline viewing for enrolled courses.",
      },
      {
        q: "Is Learnify available in multiple languages?",
        a: "The platform interface is currently in English. However, many courses are available in other languages. You can filter courses by language in the catalog.",
      },
    ],
  },
  {
    category: "Account",
    icon: User,
    color: "bg-violet-50 text-violet-600",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign up for free' on the homepage or go to /signup. Fill in your name, email, and password, and choose your role (Student or Educator). You can also sign up using your Google account.",
      },
      {
        q: "How do I reset my password?",
        a: "On the login page, click 'Forgot password?' and enter your registered email. You'll receive a reset link within a few minutes. The link expires after 30 minutes for security.",
      },
      {
        q: "Can I change my role from Student to Educator?",
        a: "Yes. Go to Settings → Account → Role and request a role change. Our team will review your request within 2–3 business days.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings → Account → Danger Zone → Delete Account. This is permanent — all your progress, certificates, and data will be removed within 30 days.",
      },
    ],
  },
  {
    category: "Courses",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-600",
    faqs: [
      {
        q: "How do I enroll in a course?",
        a: "Find a course in the catalog, click on it, and hit 'Enroll Now'. Free courses are accessible instantly. For paid courses, you'll be taken through a quick checkout flow.",
      },
      {
        q: "Do courses have an expiry date?",
        a: "No — once enrolled, you have lifetime access to that course, including any future updates the educator makes.",
      },
      {
        q: "Can I resume a course where I left off?",
        a: "Yes. Learnify automatically saves your progress. Visit Dashboard → My Courses and click 'Continue Learning' to pick up right where you stopped.",
      },
      {
        q: "What happens if an educator removes a course?",
        a: "If you're already enrolled, you retain access. If a course is unpublished before you enroll, you'll receive a full refund automatically.",
      },
      {
        q: "How do I become an educator on Learnify?",
        a: "Sign up and select 'Educator' as your role, or switch roles in Settings. Once approved, you can create, publish, and manage your own courses through the Educator Dashboard.",
      },
    ],
  },
  {
    category: "Billing",
    icon: CreditCard,
    color: "bg-amber-50 text-amber-600",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We accept Visa, Mastercard, American Express, PayPal, and UPI (for users in India). All transactions are encrypted and processed securely.",
      },
      {
        q: "How do I get a refund?",
        a: "Refund requests must be submitted within 7 days of purchase and before completing 20% of the course. Email support@learnify.com with your order ID. Refunds are processed within 5–7 business days.",
      },
      {
        q: "Will I be charged automatically for subscriptions?",
        a: "Yes, subscriptions auto-renew monthly or annually. You can cancel anytime from Settings → Billing → Cancel Subscription before your next renewal date.",
      },
      {
        q: "Do you offer student or group discounts?",
        a: "Yes! We offer a 30% student discount with a valid .edu email address. For team or institutional plans, contact us at sales@learnify.com.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    icon: Shield,
    color: "bg-rose-50 text-rose-600",
    faqs: [
      {
        q: "Is my personal data safe on Learnify?",
        a: "Absolutely. We use industry-standard TLS encryption, hashed passwords, and regular security audits. We never sell your personal data to third parties. Read our Privacy Policy for full details.",
      },
      {
        q: "How does Learnify use my data?",
        a: "We use your data to provide and improve the platform, personalize your learning experience, and send relevant communications. You can control your data preferences in Settings → Privacy.",
      },
      {
        q: "Can I download my data?",
        a: "Yes. Go to Settings → Privacy → Download My Data to request a full export of your account data in JSON format. We'll send it to your registered email within 48 hours.",
      },
    ],
  },
];

const FaqItem = ({ q, a, isOpen, onToggle }) => (
  <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-indigo-200 shadow-sm" : "border-slate-200"}`}>
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-5 py-4 text-left transition ${isOpen ? "bg-indigo-50" : "bg-white hover:bg-slate-50"}`}
    >
      <span className={`text-sm font-medium pr-4 ${isOpen ? "text-indigo-700" : "text-slate-800"}`}>{q}</span>
      {isOpen
        ? <ChevronUp size={16} className="text-indigo-500 flex-shrink-0" />
        : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
      }
    </button>
    {isOpen && (
      <div className="px-5 pb-5 bg-white">
        <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{a}</p>
      </div>
    )}
  </div>
);

const FAQPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const allFaqs = faqData.flatMap((f) =>
    f.faqs.map((item) => ({ ...item, category: f.category }))
  );

  const filtered = allFaqs.filter(
    ({ q, a, category }) =>
      (activeCategory === "All" || category === activeCategory) &&
      (q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <a href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">Learnify</span>
        </a>
      </header>

      {/* Hero */}
      <div className="bg-indigo-600 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-30" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-800 rounded-full opacity-30" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-indigo-200 text-sm mb-7">
            Can't find what you're looking for? We've got you covered.
          </p>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder="Search questions… e.g. 'refund', 'certificate'"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-md"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >✕</button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: "21+", label: "Questions Answered" },
            { value: "5",   label: "Categories"         },
            { value: "24h", label: "Support Response"   },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="flex gap-2 flex-wrap mb-8">
            {["All", ...faqData.map((f) => f.category)].map((cat) => {
              const found = faqData.find((f) => f.category === cat);
              const Icon = found?.icon;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition duration-200 ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Results label */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">
            {search
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
              : activeCategory === "All"
              ? `All Questions (${filtered.length})`
              : `${activeCategory} (${filtered.length})`}
          </p>
          {activeCategory !== "All" && !search && (
            <button onClick={() => setActiveCategory("All")} className="text-xs text-indigo-600 hover:underline">
              View all
            </button>
          )}
        </div>

        {/* FAQ List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <FaqItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-slate-700 font-semibold">No results found</p>
            <p className="text-slate-400 text-sm mt-1">Try different keywords or browse all categories.</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-12 bg-indigo-600 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-lg">Still have questions?</h3>
              <p className="text-indigo-200 text-sm mt-1">
                Can't find your answer here? Our support team is happy to help.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a
                href="/help"
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition duration-200"
              >
                Help Center
              </a>
              <a
                href="/contact"
                className="flex items-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition duration-200"
              >
                Contact Us <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;