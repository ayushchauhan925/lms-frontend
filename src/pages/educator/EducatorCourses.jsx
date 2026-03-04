import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, X, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { getMyCourses, deleteCourse } from "../../services/course.service";
import EducatorCourseCard from "../../components/educator/EducatorCourseCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Business",
  "Mobile Development",
  "DevOps",
  "Cybersecurity",
];

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-100" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-20 bg-slate-100 rounded-full" />
      <div className="h-4 w-full bg-slate-100 rounded-full" />
      <div className="h-3 w-32 bg-slate-100 rounded-full" />
      <div className="flex justify-between pt-2">
        <div className="h-8 w-16 bg-slate-100 rounded-lg" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── FilterBar ────────────────────────────────────────────────────────────────

const FilterBar = ({ filters, onChange, onReset, hasActive }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">

    {/* Row 1 — Search + Status + Reset */}
    <div className="flex flex-col sm:flex-row gap-3">

      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder="Search your courses..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200"
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {["All", "Published", "Draft"].map((s) => (
          <button
            key={s}
            onClick={() => onChange("status", s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
              filters.status === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reset */}
      {hasActive && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl transition"
        >
          <X size={13} />
          Reset
        </button>
      )}
    </div>

    {/* Row 2 — Category pills */}
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange("category", cat)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition duration-200 ${
            filters.category === cat
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

  </div>
);

// ─── Initial filters ──────────────────────────────────────────────────────────

const initialFilters = {
  search:   "",
  status:   "All",
  category: "All",
};

// ─── EducatorCourses ──────────────────────────────────────────────────────────

const EducatorCourses = () => {
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filters, setFilters]       = useState(initialFilters);
  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getMyCourses();
        setCourses(data.courses || []);
      } catch (err) {
        toast.error("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // ── Filter logic ──────────────────────────────────────────────────────────

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        !filters.search ||
        course.title.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus =
        filters.status === "All" ||
        (filters.status === "Published" && course.isPublished) ||
        (filters.status === "Draft" && !course.isPublished);

      const matchCategory =
        filters.category === "All" || course.category === filters.category;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [courses, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => setFilters(initialFilters);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.category !== "All";

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? All its lectures will also be deleted. This cannot be undone."))
      return;

    try {
      setDeletingId(id);
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Course deleted.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Courses</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage all your created courses.
          </p>
        </div>
        <Link
          to="/educator/courses/create"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200 self-start sm:self-auto"
        >
          <Plus size={15} />
          Create Course
        </Link>
      </div>

      {/* ── Stat pills ───────────────────────────────────────────────── */}
      {!loading && courses.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm flex items-center gap-2">
            <BookOpen size={14} className="text-indigo-500" />
            <span className="text-sm font-bold text-slate-800">{courses.length}</span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-slate-800">
              {courses.filter((c) => c.isPublished).length}
            </span>
            <span className="text-xs text-slate-400">Published</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm font-bold text-slate-800">
              {courses.filter((c) => !c.isPublished).length}
            </span>
            <span className="text-xs text-slate-400">Drafts</span>
          </div>
        </div>
      )}

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        hasActive={hasActiveFilters}
      />

      {/* ── Results count ────────────────────────────────────────────── */}
      {!loading && (
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredCourses.length}
          </span>{" "}
          {filteredCourses.length === 1 ? "course" : "courses"}
          {hasActiveFilters && " for current filters"}
        </p>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        courses.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-3">📚</p>
            <p className="font-bold text-slate-700">No courses yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-5">
              Create your first course to get started.
            </p>
            <Link
              to="/educator/courses/create"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
            >
              <Plus size={15} />
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-bold text-slate-700">No courses found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your filters or search term.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course) => (
            <EducatorCourseCard
              key={course._id}
              course={course}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default EducatorCourses;