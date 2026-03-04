import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  BookOpen, Users, DollarSign, Star, TrendingUp,
  ArrowRight, Plus, Eye, Clock, Award, BarChart2,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const stats = [
  { icon: DollarSign, label: "Total Earnings",    value: "$4,280",  sub: "+$320 this month",  color: "bg-emerald-500" },
  { icon: Users,      label: "Total Students",    value: "1,284",   sub: "+48 this week",     color: "bg-indigo-500"  },
  { icon: BookOpen,   label: "Published Courses", value: "6",       sub: "2 in draft",        color: "bg-violet-500"  },
  { icon: Star,       label: "Avg. Rating",       value: "4.8",     sub: "From 320 reviews",  color: "bg-amber-500"   },
];

const courses = [
  {
    id: 1, emoji: "⚛️",
    title: "React & Next.js Complete Guide",
    students: 482, revenue: "$1,920", rating: 4.9,
    status: "published", lessons: 120, lastUpdated: "2 days ago",
  },
  {
    id: 2, emoji: "🎨",
    title: "UI/UX Design Fundamentals",
    students: 310, revenue: "$1,085", rating: 4.8,
    status: "published", lessons: 80, lastUpdated: "1 week ago",
  },
  {
    id: 3, emoji: "📊",
    title: "Data Science with Python",
    students: 275, revenue: "$1,100", rating: 4.9,
    status: "published", lessons: 150, lastUpdated: "3 days ago",
  },
  {
    id: 4, emoji: "🐳",
    title: "Docker & Kubernetes Mastery",
    students: 0, revenue: "$0", rating: null,
    status: "draft", lessons: 40, lastUpdated: "Today",
  },
];

const recentStudents = [
  { id: 1, name: "Priya Sharma",   course: "React & Next.js",    joinedAt: "2 hours ago",  avatar: "PS" },
  { id: 2, name: "James Okonkwo",  course: "UI/UX Design",       joinedAt: "5 hours ago",  avatar: "JO" },
  { id: 3, name: "Sofia Martinez", course: "Data Science",       joinedAt: "Yesterday",    avatar: "SM" },
  { id: 4, name: "Rahul Gupta",    course: "React & Next.js",    joinedAt: "Yesterday",    avatar: "RG" },
  { id: 5, name: "Emily Chen",     course: "UI/UX Design",       joinedAt: "2 days ago",   avatar: "EC" },
];

const recentReviews = [
  { id: 1, name: "Priya S.",   avatar: "PS", course: "React & Next.js", rating: 5, text: "Absolutely incredible course! Sarah explains everything so clearly.", time: "1h ago"   },
  { id: 2, name: "James O.",   avatar: "JO", course: "UI/UX Design",    rating: 5, text: "Best design course I've taken. Real world projects made all the difference.", time: "3h ago"   },
  { id: 3, name: "Sofia M.",   avatar: "SM", course: "Data Science",    rating: 4, text: "Very detailed and well structured. Would love more practice exercises.", time: "1d ago"   },
];

const recentEarnings = [
  { id: 1, course: "React & Next.js",  student: "Priya Sharma",   amount: "$59", date: "Mar 2, 2026",  emoji: "⚛️" },
  { id: 2, course: "UI/UX Design",     student: "James Okonkwo",  amount: "$49", date: "Mar 2, 2026",  emoji: "🎨" },
  { id: 3, course: "Data Science",     student: "Sofia Martinez", amount: "$79", date: "Mar 1, 2026",  emoji: "📊" },
  { id: 4, course: "React & Next.js",  student: "Rahul Gupta",    amount: "$59", date: "Mar 1, 2026",  emoji: "⚛️" },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-emerald-500 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
    status === "published"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700"
  }`}>
    {status === "published" ? "Published" : "Draft"}
  </span>
);

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star
        key={s}
        size={11}
        className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}
      />
    ))}
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const EducatorDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Educator";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Welcome Banner ── */}
      <div className="bg-indigo-600 rounded-2xl p-7 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-indigo-500 rounded-full opacity-40" />
        <div className="absolute -bottom-10 right-40 w-36 h-36 bg-indigo-800 rounded-full opacity-30" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-300" /> Your courses are growing!
            </p>
            <h1 className="text-2xl font-black text-white">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-indigo-200 text-sm mt-1.5">
              You have <span className="text-white font-bold">1,284 students</span> enrolled across your courses. Keep creating!
            </p>
          </div>
          <Link
            to="/educator/courses/create"
            className="flex items-center gap-2 bg-white text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition flex-shrink-0 shadow-md"
          >
            <Plus size={15} /> Create New Course
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── My Courses + Recent Students ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* My Courses – 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">My Courses</h2>
            <Link to="/educator/courses" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {courses.map((course) => (
              <div key={course.id} className="flex gap-4 px-6 py-4 hover:bg-slate-50 transition group">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">
                      {course.title}
                    </p>
                    <StatusBadge status={course.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Users size={11} />{course.students} students</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} lessons</span>
                    {course.rating && (
                      <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{course.rating}</span>
                    )}
                    <span className="text-emerald-600 font-semibold">{course.revenue}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Updated {course.lastUpdated}</p>
                </div>
                <Link
                  to={`/educator/courses/${course.id}`}
                  className="flex-shrink-0 self-center p-2 rounded-lg bg-slate-50 hover:bg-indigo-600 text-slate-400 hover:text-white transition"
                >
                  <Eye size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students – 1/3 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">New Students</h2>
            <Link to="/educator/students" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-6 py-2 divide-y divide-slate-50">
            {recentStudents.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-slate-400 truncate">{s.course}</p>
                </div>
                <p className="text-xs text-slate-400 flex-shrink-0">{s.joinedAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Earnings + Reviews ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Earnings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" /> Recent Earnings
            </h2>
            <Link to="/educator/earnings" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentEarnings.map((e) => (
              <div key={e.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition">
                <span className="text-xl">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{e.course}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{e.student} · {e.date}</p>
                </div>
                <span className="text-sm font-black text-emerald-600 flex-shrink-0">{e.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Star size={16} className="text-amber-400 fill-amber-400" /> Recent Reviews
            </h2>
            <Link to="/educator/reviews" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-6 py-2 divide-y divide-slate-50">
            {recentReviews.map((r) => (
              <div key={r.id} className="py-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} />
                      <span className="text-xs text-slate-400">{r.course}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Bottom ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BarChart2, label: "Completion Rate",    value: "73%",   sub: "Avg across all courses", color: "bg-indigo-50 text-indigo-600"  },
          { icon: Clock,     label: "Total Watch Time",   value: "9,420h", sub: "By all students",       color: "bg-violet-50 text-violet-600"  },
          { icon: Award,     label: "Certificates Issued",value: "648",   sub: "To date",                color: "bg-amber-50  text-amber-600"   },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA Banner ── */}
      <div className="bg-indigo-600 rounded-2xl p-7 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-500 rounded-full opacity-30" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white font-bold text-lg">Ready to create your next course?</h3>
            <p className="text-indigo-200 text-sm mt-1">Share your expertise and start earning from your knowledge today.</p>
          </div>
          <Link
            to="/educator/courses/create"
            className="flex items-center gap-2 bg-white text-indigo-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition flex-shrink-0 whitespace-nowrap shadow-md"
          >
            <Plus size={15} /> Create Course
          </Link>
        </div>
      </div>

    </div>
  );
};

export default EducatorDashboard;