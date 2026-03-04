import { useEffect, useState, useMemo } from "react";
import { Users, BookOpen, Search, Filter, TrendingUp } from "lucide-react";
import { getEducatorEnrollments } from "../../services/enrollment.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const avatar = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const COLORS = ["bg-indigo-500","bg-violet-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-sky-500"];
const color  = (str = "") => COLORS[str.charCodeAt(0) % COLORS.length];

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, iconColor }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xl font-black text-slate-800">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const EducatorEnrollmentsPage = () => {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const res = await getEducatorEnrollments();
        setData(res);
      } catch {
        setError("Failed to load enrollments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Unique course options for filter
  const courseOptions = useMemo(() => {
    if (!data) return [];
    const titles = [...new Set(data.enrollments.map((e) => e.courseId?.title).filter(Boolean))];
    return ["All", ...titles];
  }, [data]);

  // Filtered enrollments
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.enrollments.filter((e) => {
      const name   = e.studentId?.name?.toLowerCase()  || "";
      const email  = e.studentId?.email?.toLowerCase() || "";
      const title  = e.courseId?.title || "";
      const q      = search.toLowerCase();
      const matchSearch = name.includes(q) || email.includes(q) || title.toLowerCase().includes(q);
      const matchCourse = courseFilter === "All" || title === courseFilter;
      return matchSearch && matchCourse;
    });
  }, [data, search, courseFilter]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading enrollments…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  const { totalEnrollments, enrollmentsByCourse } = data;
  const uniqueCourses = enrollmentsByCourse.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Enrollments</h1>
        <p className="text-slate-400 text-sm mt-1">See all students enrolled across your courses.</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users}      label="Total Enrollments" value={totalEnrollments} iconColor="bg-indigo-500" />
        <StatCard icon={BookOpen}   label="Courses with Sales" value={uniqueCourses}   iconColor="bg-violet-500" />
        <StatCard icon={TrendingUp} label="Showing Now"        value={filtered.length} iconColor="bg-emerald-500" />
      </div>

      {/* ── Enrollments by Course ── */}
      {enrollmentsByCourse.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" /> Enrollments by Course
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {enrollmentsByCourse.map((c) => {
              const pct = Math.round((c.count / totalEnrollments) * 100);
              return (
                <div key={c.courseId} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {c.thumbnail?.url
                      ? <img src={c.thumbnail.url} alt={c.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">📘</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">{c.title}</p>
                      <span className="text-sm font-black text-indigo-600 ml-4 flex-shrink-0">{c.count} students</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 capitalize">{c.category} · {pct}% of total</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── All Enrollments Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Table header + filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Users size={16} className="text-indigo-500" /> All Students
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or course…"
                className="pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition w-full sm:w-56"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>
              )}
            </div>
            {/* Course filter */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="pl-8 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition appearance-none w-full sm:w-48"
              >
                {courseOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {totalEnrollments} enrollments
          </p>
          {(search || courseFilter !== "All") && (
            <button onClick={() => { setSearch(""); setCourseFilter("All"); }} className="text-xs text-indigo-600 hover:underline font-medium">
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">{totalEnrollments === 0 ? "🎓" : "🔍"}</p>
            <p className="font-bold text-slate-700">{totalEnrollments === 0 ? "No enrollments yet" : "No results found"}</p>
            <p className="text-sm text-slate-400 mt-1">
              {totalEnrollments === 0 ? "Students will appear here once they enroll in your courses." : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Student</th>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Enrolled On</th>
                  <th className="px-6 py-3 text-left">Amount Paid</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-50 transition">
                    {/* Student */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${color(e.studentId?.name)}`}>
                          {avatar(e.studentId?.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{e.studentId?.name || "—"}</p>
                          <p className="text-xs text-slate-400">{e.studentId?.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    {/* Course */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {e.courseId?.thumbnail?.url
                            ? <img src={e.courseId.thumbnail.url} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-sm">📘</div>}
                        </div>
                        <p className="text-sm text-slate-700 font-medium max-w-[180px] truncate">{e.courseId?.title || "—"}</p>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                        {e.courseId?.category || "—"}
                      </span>
                    </td>
                    {/* Enrolled On */}
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {fmtDate(e.enrolledAt || e.createdAt)}
                    </td>
                    {/* Amount Paid */}
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                      {fmt(e.amountPaid)}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        e.status === "active"    ? "bg-emerald-50 text-emerald-700" :
                        e.status === "completed" ? "bg-indigo-50 text-indigo-700"  :
                                                   "bg-rose-50 text-rose-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          e.status === "active"    ? "bg-emerald-500" :
                          e.status === "completed" ? "bg-indigo-500"  :
                                                     "bg-rose-500"
                        }`} />
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default EducatorEnrollmentsPage;