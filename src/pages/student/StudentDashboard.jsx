import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  BookOpen, Award, Clock, TrendingUp, Play,
  Star, CheckCircle, Calendar, ArrowRight, Flame,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const enrolledCourses = [
  {
    id: 1, emoji: "⚛️",
    title: "React & Next.js Complete Guide",
    instructor: "Sarah Johnson",
    progress: 68,
    totalLessons: 120, completedLessons: 82,
    category: "Development", lastAccessed: "2 hours ago",
  },
  {
    id: 2, emoji: "🎨",
    title: "UI/UX Design Fundamentals",
    instructor: "Mark Stevens",
    progress: 35,
    totalLessons: 80, completedLessons: 28,
    category: "Design", lastAccessed: "Yesterday",
  },
  {
    id: 3, emoji: "📊",
    title: "Data Science with Python",
    instructor: "Dr. Anika Patel",
    progress: 12,
    totalLessons: 150, completedLessons: 18,
    category: "Data", lastAccessed: "3 days ago",
  },
];

const recentActivity = [
  { id: 1, type: "lesson",      text: 'Completed "React Hooks Deep Dive"',         time: "2 hours ago",  emoji: "✅" },
  { id: 2, type: "certificate", text: 'Earned certificate in "JavaScript Basics"', time: "Yesterday",    emoji: "🏆" },
  { id: 3, type: "lesson",      text: 'Started "Next.js App Router"',              time: "Yesterday",    emoji: "▶️" },
  { id: 4, type: "review",      text: 'Left a review on "UI/UX Design"',           time: "2 days ago",   emoji: "⭐" },
  { id: 5, type: "enroll",      text: 'Enrolled in "Data Science with Python"',    time: "3 days ago",   emoji: "📚" },
];

const upcomingDeadlines = [
  { id: 1, title: "React Final Project Submission", course: "React & Next.js",    date: "Mar 5, 2026",  urgent: true  },
  { id: 2, title: "Design Portfolio Review",        course: "UI/UX Design",       date: "Mar 10, 2026", urgent: false },
  { id: 3, title: "Python Quiz – Module 2",         course: "Data Science",       date: "Mar 15, 2026", urgent: false },
];

const certificates = [
  { id: 1, title: "JavaScript Fundamentals", issueDate: "Feb 20, 2026", emoji: "🏆" },
  { id: 2, title: "HTML & CSS Mastery",      issueDate: "Jan 10, 2026", emoji: "🎖️" },
];

const recommendedCourses = [
  { id: 1, emoji: "🐳", title: "Docker & Kubernetes",       category: "DevOps",   rating: 4.8, price: "$59"  },
  { id: 2, emoji: "🔐", title: "Cybersecurity Essentials",  category: "Security", rating: 4.7, price: "Free" },
  { id: 3, emoji: "📱", title: "React Native Mobile Dev",   category: "Mobile",   rating: 4.9, price: "$49"  },
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
      {sub && <p className="text-xs text-indigo-500 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="w-full bg-slate-100 rounded-full h-1.5">
    <div
      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Student";

  const overallProgress = Math.round(
    enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Welcome Banner ── */}
      <div className="bg-indigo-600 rounded-2xl p-7 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-40" />
        <div className="absolute -bottom-10 right-32 w-32 h-32 bg-indigo-800 rounded-full opacity-30" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1 flex items-center gap-2">
              <Flame size={15} className="text-amber-300" /> Keep it up!
            </p>
            <h1 className="text-2xl font-black text-white">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-indigo-200 text-sm mt-1.5">
              You've completed <span className="text-white font-bold">{overallProgress}%</span> of your enrolled courses. Keep going!
            </p>
          </div>
          <Link
            to="/student/courses"
            className="flex items-center gap-2 bg-white text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition flex-shrink-0"
          >
            <Play size={14} /> Continue Learning
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}   label="Enrolled Courses"   value={enrolledCourses.length} sub="+1 this month"  color="bg-indigo-500" />
        <StatCard icon={TrendingUp} label="Avg. Progress"      value={`${overallProgress}%`}  sub="Across all courses" color="bg-violet-500" />
        <StatCard icon={Award}      label="Certificates"       value={certificates.length}     sub="2 in progress"  color="bg-amber-500"  />
        <StatCard icon={Clock}      label="Hours Learned"      value="47h"                     sub="This month"     color="bg-emerald-500"/>
      </div>

      {/* ── My Courses + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* My Courses – 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">My Courses</h2>
            <Link to="/student/courses" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex gap-4 px-6 py-4 hover:bg-slate-50 transition group">
                {/* Emoji thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">
                      {course.title}
                    </p>
                    <span className="text-xs font-bold text-indigo-600 flex-shrink-0">{course.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">by {course.instructor} · {course.lastAccessed}</p>
                  <ProgressBar value={course.progress} />
                  <p className="text-xs text-slate-400 mt-1.5">
                    {course.completedLessons} / {course.totalLessons} lessons completed
                  </p>
                </div>
                <Link
                  to="/student/courses"
                  className="flex-shrink-0 self-center p-2 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition"
                >
                  <Play size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity – 1/3 width */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Recent Activity</h2>
          </div>
          <div className="px-6 py-2 divide-y divide-slate-50">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3 py-3.5">
                <span className="text-lg flex-shrink-0 mt-0.5">{a.emoji}</span>
                <div>
                  <p className="text-xs text-slate-700 leading-relaxed">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Deadlines + Certificates + Recommended ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" /> Deadlines
            </h2>
          </div>
          <div className="px-6 py-2 divide-y divide-slate-50">
            {upcomingDeadlines.map((d) => (
              <div key={d.id} className="py-3.5 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${d.urgent ? "bg-rose-500" : "bg-slate-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-snug">{d.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.course}</p>
                </div>
                <span className={`text-xs font-semibold flex-shrink-0 ${d.urgent ? "text-rose-500" : "text-slate-400"}`}>
                  {d.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Certificates</h2>
            <Link to="/student/certificates" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-6 py-4 space-y-3">
            {certificates.map((c) => (
              <div key={c.id} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Issued {c.issueDate}</p>
                </div>
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              </div>
            ))}
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-400">Complete a course to earn your next certificate 🎯</p>
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Recommended for You</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {recommendedCourses.map((c) => (
              <div key={c.id} className="flex items-center gap-3 hover:bg-slate-50 rounded-xl p-2 -mx-2 transition group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">{c.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{c.category}</span>
                    <span className="text-xs text-amber-500 flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400" />{c.rating}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-bold flex-shrink-0 ${c.price === "Free" ? "text-emerald-600" : "text-slate-700"}`}>
                  {c.price}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 pb-5">
            <Link
              to="/student/courses"
              className="block w-full text-center text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-xl py-2.5 hover:bg-indigo-50 transition"
            >
              Explore All Courses
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;