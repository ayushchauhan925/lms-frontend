import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Search, CheckCircle, BookOpen, Filter } from "lucide-react";
import { getMyProgress } from "../../services/progress.service";

const categories = ["All", "Development", "Design", "Data Science", "Marketing", "Business"];

// ── Certificate Card ──────────────────────────────────────────────────────────
const CertificateCard = ({ item }) => {
  const course = item.courseId; // populated object

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-amber-50 to-indigo-50 flex items-center justify-center overflow-hidden">
        {course?.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl">🏆</span>
        )}
        <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <CheckCircle size={11} /> Completed
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <span className="text-xs font-semibold text-indigo-600">{course?.category || "—"}</span>
        <h3 className="font-bold text-slate-800 text-sm mt-1 mb-1 group-hover:text-indigo-600 transition line-clamp-2">
          {course?.title || "Course"}
        </h3>
        <p className="text-xs text-slate-400 mb-3 capitalize">{course?.level || "—"}</p>

        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <BookOpen size={11} />
          <span>100% completed</span>
        </div>

        <Link
          to={`/student/certificate/${course?._id}`}
          state={{ course }}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold py-2.5 rounded-xl transition duration-200"
        >
          <Award size={13} /> View Certificate
        </Link>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const StudentCertificates = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [category, setCategory]         = useState("All");

  // ── Fetch all progress, filter completed ────────────────────────────────
  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        setLoading(true);
        const data = await getMyProgress();
        // Only keep courses where progressPercentage === 100
        const completed = (data.progressList || []).filter(
          (p) => p.progressPercentage === 100
        );
        setProgressList(completed);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, []);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = progressList.filter((item) => {
    const course = item.courseId;
    const matchSearch   = course?.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || course?.category === category;
    return matchSearch && matchCategory;
  });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading certificates…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">My Certificates</h1>
        <p className="text-slate-400 text-sm mt-1">
          View and download certificates for your completed courses.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Award,       label: "Certificates Earned", value: progressList.length, color: "bg-amber-500"   },
          { icon: CheckCircle, label: "Courses Completed",   value: progressList.length, color: "bg-emerald-500" },
          { icon: BookOpen,    label: "In Progress",
            value: "—", color: "bg-indigo-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course name…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >✕</button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results label ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {progressList.length} certificates
        </p>
        {(search || category !== "All") && (
          <button
            onClick={() => { setSearch(""); setCategory("All"); }}
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <CertificateCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
          {progressList.length === 0 ? (
            <>
              <p className="text-3xl mb-3">📚</p>
              <p className="font-bold text-slate-700">No completed courses yet</p>
              <p className="text-sm text-slate-400 mt-1">Complete a course to earn your first certificate.</p>
              <Link
                to="/student/explore"
                className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-600 font-medium hover:underline"
              >
                Explore Courses →
              </Link>
            </>
          ) : (
            <>
              <p className="text-3xl mb-3">🔍</p>
              <p className="font-bold text-slate-700">No certificates found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default StudentCertificates;