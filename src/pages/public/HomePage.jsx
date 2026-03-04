import { GraduationCap, BookOpen, Users, Star, ArrowRight, CheckCircle, Play, TrendingUp, Award, Clock } from "lucide-react";
import Footer from "@/components/common/Footer";

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <GraduationCap size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-slate-800">Learnify</span>
      </a>
      <nav className="hidden md:flex items-center gap-7">
        {["Courses", "Educators", "Pricing", "About"].map((item) => (
          <a key={item} href="#" className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition">
            {item}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <a href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition px-3 py-2">
          Sign in
        </a>
        <a href="/signup" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition shadow-sm shadow-indigo-200">
          Get Started Free
        </a>
      </div>
    </div>
  </header>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { icon: Users,    value: "50,000+", label: "Active Students"   },
  { icon: BookOpen, value: "500+",    label: "Courses Available" },
  { icon: Star,     value: "4.9/5",   label: "Average Rating"    },
  { icon: Award,    value: "200+",    label: "Expert Educators"  },
];

const features = [
  { icon: "🎯", title: "Structured Learning Paths",  desc: "Follow curated roadmaps designed by industry experts to take you from beginner to job-ready." },
  { icon: "📱", title: "Learn on Any Device",         desc: "Access all your courses on desktop, tablet, or mobile — even offline with our mobile app."   },
  { icon: "🏆", title: "Earn Certificates",           desc: "Get recognized certificates upon course completion, accepted by 500+ top companies worldwide." },
  { icon: "🔄", title: "Lifetime Access",             desc: "Pay once and access your course forever, including all future updates from the educator."      },
  { icon: "💬", title: "Community Discussions",       desc: "Ask questions, share ideas, and learn together with a global community of learners."           },
  { icon: "⚡", title: "Learn at Your Own Pace",      desc: "No deadlines, no pressure. Study whenever you want, as fast or slow as you need."             },
];

const courses = [
  { title: "Full-Stack Web Development",    category: "Development",  rating: 4.9, students: "12.4k", duration: "48h", price: "Free",  badge: "Bestseller",  emoji: "💻" },
  { title: "UI/UX Design Fundamentals",     category: "Design",       rating: 4.8, students: "8.1k",  duration: "32h", price: "$49",   badge: "Top Rated",   emoji: "🎨" },
  { title: "Data Science with Python",      category: "Data",         rating: 4.9, students: "15.2k", duration: "60h", price: "$79",   badge: "Trending",    emoji: "📊" },
  { title: "Digital Marketing Mastery",     category: "Marketing",    rating: 4.7, students: "6.3k",  duration: "24h", price: "$39",   badge: "New",         emoji: "📣" },
  { title: "React & Next.js Complete Guide",category: "Development",  rating: 4.9, students: "9.8k",  duration: "40h", price: "$59",   badge: "Bestseller",  emoji: "⚛️" },
  { title: "Business & Entrepreneurship",   category: "Business",     rating: 4.6, students: "4.5k",  duration: "20h", price: "Free",  badge: "Popular",     emoji: "📈" },
];

const testimonials = [
  { name: "Priya Sharma",    role: "Frontend Developer @ Google",     avatar: "PS", text: "Learnify completely changed my career trajectory. The React course was incredibly detailed and practical. I landed my dream job within 3 months of completing it!", rating: 5 },
  { name: "James Okonkwo",   role: "UX Designer @ Airbnb",            avatar: "JO", text: "The design courses here are world-class. The instructors are actual industry professionals and the projects were real portfolio pieces. 100% worth it.",          rating: 5 },
  { name: "Sofia Martínez",  role: "Data Analyst @ Microsoft",        avatar: "SM", text: "I went from zero coding knowledge to a full-time data analyst role in 6 months using Learnify. The structured path made all the difference.",                    rating: 5 },
];

const badgeColor = {
  Bestseller: "bg-amber-100 text-amber-700",
  "Top Rated": "bg-emerald-100 text-emerald-700",
  Trending:   "bg-rose-100   text-rose-700",
  New:        "bg-indigo-100 text-indigo-700",
  Popular:    "bg-violet-100 text-violet-700",
};

// ── Page ──────────────────────────────────────────────────────────────────────
const HomePage = () => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Navbar />

    {/* ── Hero ── */}
    <section className="bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-70" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-50 rounded-full translate-y-1/2 -translate-x-1/3 opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <TrendingUp size={13} /> Trusted by 50,000+ learners worldwide
          </span>
          <h1 className="text-5xl font-black text-slate-900 leading-tight mb-5">
            Learn the skills<br />
            <span className="text-indigo-600">that get you hired.</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
            Learnify offers expert-led courses in tech, design, business, and more. Build real-world skills, earn recognized certificates, and land your dream job.
          </p>
          <div className="flex items-center gap-3 mb-8">
            <a href="/signup" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-indigo-200 text-sm">
              Start Learning Free <ArrowRight size={16} />
            </a>
            <a href="#courses" className="flex items-center gap-2 border border-slate-200 bg-white hover:border-indigo-300 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition text-sm">
              <Play size={14} className="text-indigo-500" /> Browse Courses
            </a>
          </div>
          <div className="flex items-center gap-5">
            {["No credit card required", "500+ free courses", "Cancel anytime"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle size={13} className="text-emerald-500" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right – floating card UI */}
        <div className="relative hidden lg:block">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl">⚛️</div>
              <div>
                <p className="font-bold text-slate-800 text-sm">React & Next.js Complete Guide</p>
                <p className="text-xs text-slate-400">by Sarah Johnson</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-700">Your Progress</p>
                <p className="text-xs font-bold text-indigo-600">68%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {[
                { label: "Introduction to React", done: true  },
                { label: "State & Props",          done: true  },
                { label: "React Hooks",            done: true  },
                { label: "Next.js Routing",        done: false },
                { label: "API Integration",        done: false },
              ].map(({ label, done }) => (
                <div key={label} className={`flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg ${done ? "text-slate-400 line-through" : "text-slate-700 font-medium bg-indigo-50"}`}>
                  <CheckCircle size={13} className={done ? "text-emerald-400" : "text-indigo-400"} />
                  {label}
                </div>
              ))}
            </div>
            <button className="w-full bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              <Play size={13} /> Continue Learning
            </button>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-white border border-slate-100 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Certificate Earned!</p>
              <p className="text-xs text-slate-400">Web Development</p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white border border-slate-100 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <p className="text-xs font-bold text-slate-800">4.9 / 5 Rating</p>
              <p className="text-xs text-slate-400">From 12,400 students</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats ── */}
    <section className="bg-indigo-600 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
              <Icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-indigo-200 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Courses ── */}
    <section id="courses" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Course Catalog</span>
          <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">Learn from the best</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Explore our most popular courses, crafted by industry professionals and loved by thousands of students.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(({ title, category, rating, students, duration, price, badge, emoji }) => (
            <div key={title} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-200 group">
              {/* Thumbnail */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 h-40 flex items-center justify-center text-6xl relative">
                {emoji}
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor[badge] || "bg-slate-100 text-slate-600"}`}>
                  {badge}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-indigo-600 mb-1">{category}</p>
                <h3 className="font-bold text-slate-800 text-sm mb-3 group-hover:text-indigo-600 transition">{title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{rating}</span>
                  <span className="flex items-center gap-1"><Users size={11} />{students}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-base font-black ${price === "Free" ? "text-emerald-600" : "text-slate-800"}`}>{price}</span>
                  <a href="/signup" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                    Enroll Now <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="/courses" className="inline-flex items-center gap-2 border border-slate-200 bg-white hover:border-indigo-300 hover:text-indigo-600 text-slate-700 font-semibold text-sm px-7 py-3 rounded-xl transition">
            View All Courses <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>

    {/* ── Features ── */}
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Why Learnify</span>
          <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">Everything you need to succeed</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">We've built Learnify from the ground up to give learners the best possible experience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl p-6 transition duration-200 group">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-indigo-700 transition">{title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Testimonials ── */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">Loved by learners worldwide</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Don't just take our word for it — here's what our students have to say.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, avatar, text, rating }) => (
            <div key={name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA Banner ── */}
    <section className="bg-indigo-600 relative overflow-hidden py-20">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-500 rounded-full opacity-40" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-800 rounded-full opacity-30" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Ready to start learning?</h2>
        <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
          Join 50,000+ students already learning on Learnify. No credit card required — get started for free today.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/signup" className="flex items-center gap-2 bg-white text-indigo-600 font-bold px-7 py-3.5 rounded-xl hover:bg-indigo-50 active:scale-[0.98] transition text-sm shadow-lg">
            Create Free Account <ArrowRight size={15} />
          </a>
          <a href="/courses" className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition text-sm">
            Browse Courses
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default HomePage;