import { useState } from "react";
import {
  GraduationCap, Search, BookOpen, CreditCard, User,
  Settings, ChevronDown, ChevronUp, MessageCircle, ArrowRight
} from "lucide-react";
import Footer from "@/components/common/Footer";

const categories = [
  {
    icon: User,
    label: "Account & Profile",
    color: "bg-violet-50 text-violet-600",
    articles: 8,
  },
  {
    icon: BookOpen,
    label: "Courses & Learning",
    color: "bg-indigo-50 text-indigo-600",
    articles: 12,
  },
  {
    icon: CreditCard,
    label: "Billing & Payments",
    color: "bg-emerald-50 text-emerald-600",
    articles: 6,
  },
  {
    icon: GraduationCap,
    label: "Certificates",
    color: "bg-amber-50 text-amber-600",
    articles: 4,
  },
  {
    icon: MessageCircle,
    label: "Community & Support",
    color: "bg-rose-50 text-rose-600",
    articles: 5,
  },
  {
    icon: Settings,
    label: "Settings & Privacy",
    color: "bg-slate-100 text-slate-600",
    articles: 7,
  },
];

const faqs = [
  {
    category: "Account",
    items: [
      {
        q: "How do I reset my password?",
        a: "Go to the login page and click 'Forgot password?'. Enter your registered email and we'll send you a reset link. The link expires after 30 minutes.",
      },
      {
        q: "How do I change my email address?",
        a: "Go to Settings → Account → Email. Enter your new email and confirm the change via the verification email we send you.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings → Account → Danger Zone → Delete Account. Note that this action is permanent and all your progress and certificates will be lost.",
      },
    ],
  },
  {
    category: "Courses",
    items: [
      {
        q: "How do I enroll in a course?",
        a: "Browse the course catalog, click on a course, and click 'Enroll Now'. Free courses are instantly accessible. Paid courses require checkout first.",
      },
      {
        q: "Can I download course videos for offline viewing?",
        a: "Offline downloads are available on our mobile app for enrolled courses. Desktop viewing requires an internet connection.",
      },
      {
        q: "How do I track my course progress?",
        a: "Your progress is automatically tracked. Visit your Dashboard → My Courses to see completion percentages and resume where you left off.",
      },
    ],
  },
  {
    category: "Billing",
    items: [
      {
        q: "How do I get a refund?",
        a: "Refunds are available within 7 days of purchase, provided you've completed less than 20% of the course. Submit a request at support@learnify.com.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, and UPI for users in India.",
      },
      {
        q: "Will I be charged automatically for subscriptions?",
        a: "Yes, subscriptions auto-renew. You can cancel anytime from Settings → Billing → Cancel Subscription before your next billing date.",
      },
    ],
  },
  {
    category: "Certificates",
    items: [
      {
        q: "How do I get my certificate?",
        a: "Complete all lessons and pass the final assessment with a score of 70% or above. Your certificate will be automatically generated and available in your profile.",
      },
      {
        q: "Are Learnify certificates recognized by employers?",
        a: "Our certificates are recognized by 500+ partner companies. You can share them directly to LinkedIn or download a PDF version.",
      },
    ],
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 ${open ? "shadow-sm" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
      >
        <span className="text-sm font-medium text-slate-800 pr-4">{q}</span>
        {open
          ? <ChevronUp size={16} className="text-indigo-500 flex-shrink-0" />
          : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white">
          <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
        </div>
      )}
    </div>
  );
};

const HelpCenterPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const allFaqs = faqs.flatMap((f) => f.items.map((item) => ({ ...item, category: f.category })));

  const filtered = allFaqs.filter(
    ({ q, a, category }) =>
      (activeCategory === "All" || category === activeCategory) &&
      (q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h1 className="text-3xl font-bold text-white mb-2">How can we help you?</h1>
          <p className="text-indigo-200 text-sm mb-7">
            Search our knowledge base or browse by category below.
          </p>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers… e.g. 'reset password', 'refund'"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-md"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">

        {/* Browse by Category */}
        <section className="mb-12">
          <h2 className="text-base font-bold text-slate-800 mb-5">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, label, color, articles }) => (
              <button
                key={label}
                onClick={() => { setActiveCategory(label.split(" ")[0]); setSearch(""); }}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-indigo-200 transition duration-200 text-center group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition">{label}</p>
                <p className="text-xs text-slate-400">{articles} articles</p>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800">
              {search
                ? `Search results for "${search}"`
                : activeCategory === "All"
                ? "Frequently Asked Questions"
                : `${activeCategory} Questions`}
            </h2>
            {activeCategory !== "All" && (
              <button
                onClick={() => setActiveCategory("All")}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                View all
              </button>
            )}
          </div>

          {/* Category tabs */}
          {!search && (
            <div className="flex gap-2 flex-wrap mb-5">
              {["All", ...faqs.map((f) => f.category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition duration-200 ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((item, i) => <FaqItem key={i} {...item} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-slate-700 font-semibold text-sm">No results found</p>
              <p className="text-slate-400 text-xs mt-1">Try different keywords or browse by category.</p>
            </div>
          )}
        </section>

        {/* Still need help? */}
        <div className="mt-12 bg-indigo-600 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-lg">Still need help?</h3>
              <p className="text-indigo-200 text-sm mt-1">
                Our support team is ready to assist you. We reply within 24 hours.
              </p>
            </div>
            <a
              href="/contact"
              className="flex items-center gap-2 bg-white text-indigo-600 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition duration-200 whitespace-nowrap flex-shrink-0"
            >
              Contact Support <ArrowRight size={15} />
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HelpCenterPage;