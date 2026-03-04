import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { getAllCourses } from "../../services/course.service";
import { getMyEnrollments } from "../../services/enrollment.service";
import CourseCard from "../../components/student/CourseCard";
import PaymentModal from "../../components/student/PaymentModal";

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

const LEVELS = ["All", "beginner", "intermediate", "advanced"];

// ─── FilterBar ────────────────────────────────────────────────────────────────

const FilterBar = ({ filters, onChange, onReset, hasActive }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">

    {/* Row 1 — Search + Price + Reset */}
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
          placeholder="Search courses..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200"
        />
      </div>

      {/* Price filter */}
      <div className="flex gap-2">
        {["All", "Free", "Paid"].map((p) => (
          <button
            key={p}
            onClick={() => onChange("price", p)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
              filters.price === p
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Reset — only shown when filters are active */}
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

    {/* Row 3 — Level pills */}
    <div className="flex gap-2 flex-wrap">
      {LEVELS.map((lvl) => (
        <button
          key={lvl}
          onClick={() => onChange("level", lvl)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition duration-200 capitalize ${
            filters.level === lvl
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {lvl}
        </button>
      ))}
    </div>

  </div>
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-100" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-20 bg-slate-100 rounded-full" />
      <div className="h-4 w-full bg-slate-100 rounded-full" />
      <div className="h-3 w-32 bg-slate-100 rounded-full" />
      <div className="h-3 w-24 bg-slate-100 rounded-full" />
      <div className="flex gap-2 pt-2">
        <div className="h-8 flex-1 bg-slate-100 rounded-xl" />
        <div className="h-8 flex-1 bg-slate-100 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Initial filters ──────────────────────────────────────────────────────────

const initialFilters = {
  search:   "",
  category: "All",
  level:    "All",
  price:    "All",
};

// ─── ExploreCourses ───────────────────────────────────────────────────────────

const ExploreCourses = () => {
  const [courses, setCourses]                       = useState([]);
  const [enrolledIds, setEnrolledIds]               = useState(new Set());
  const [loading, setLoading]                       = useState(true);
  const [filters, setFilters]                       = useState(initialFilters);
  const [selectedCourse, setSelectedCourse]         = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // ── Fetch on mount ────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, enrollmentsRes] = await Promise.all([
          getAllCourses(),
          getMyEnrollments(),
        ]);

        setCourses(coursesRes.courses || []);

        // Build a Set of enrolled courseIds for O(1) lookup
        const ids = new Set(
          (enrollmentsRes.enrollments || []).map((e) =>
            typeof e.courseId === "object" ? e.courseId._id : e.courseId
          )
        );
        setEnrolledIds(ids);
      } catch (err) {
        console.error("Failed to fetch courses or enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Filter logic (client-side) ────────────────────────────────────────────

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch =
        !filters.search ||
        course.title.toLowerCase().includes(filters.search.toLowerCase());

      const matchCategory =
        filters.category === "All" || course.category === filters.category;

      const matchLevel =
        filters.level === "All" || course.level === filters.level;

      const matchPrice =
        filters.price === "All" ||
        (filters.price === "Free" && course.price === 0) ||
        (filters.price === "Paid" && course.price > 0);

      return matchSearch && matchCategory && matchLevel && matchPrice;
    });
  }, [courses, filters]);

  // ── Filter handlers ───────────────────────────────────────────────────────

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => setFilters(initialFilters);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "All" ||
    filters.level !== "All" ||
    filters.price !== "All";

  // ── Enroll handlers ───────────────────────────────────────────────────────

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsPaymentModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedCourse(null);
  };

  const handleEnrolled = (courseId) => {
    setEnrolledIds((prev) => new Set([...prev, courseId]));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Explore Courses</h1>
        <p className="text-slate-400 text-sm mt-1">
          Browse all available courses and start learning today.
        </p>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        hasActive={hasActiveFilters}
      />

      {/* ── Results count ────────────────────────────────────────────── */}
      {!loading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredCourses.length}
            </span>{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
            {hasActiveFilters && " for current filters"}
          </p>
        </div>
      )}

      {/* ── Courses Grid ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isEnrolled={enrolledIds.has(course._id)}
              onEnroll={() => handleEnrollClick(course)}
            />
          ))}
        </div>
      )}

      {/* ── Payment Modal ────────────────────────────────────────────── */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleModalClose}
        course={selectedCourse}
        onEnrolled={handleEnrolled}
      />

    </div>
  );
};

export default ExploreCourses;