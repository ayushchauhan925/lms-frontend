import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import { getMyEnrollments }  from "../../services/enrollment.service";
import { getCourseProgress } from "../../services/progress.service";

import StatsBar        from "../../components/student/StatsBar";
import CourseFilterBar from "../../components/student/CourseFilterBar";
import CoursesGrid     from "../../components/student/CoursesGrid";

// ─── Initial filters ──────────────────────────────────────────────────────────

const initialFilters = {
  search:   "",
  status:   "All",
  category: "All",
};

// ─── StudentCourses ───────────────────────────────────────────────────────────

const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading]         = useState(true);
  const [filters, setFilters]         = useState(initialFilters);

  // ── Fetch enrollments + progress ─────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const enrollRes = await getMyEnrollments();
        const enrollments = enrollRes.enrollments || [];
        setEnrollments(enrollments);

        // Fetch progress for each enrolled course in parallel
        const progressEntries = await Promise.all(
          enrollments.map(async (e) => {
            const courseId = typeof e.courseId === "object" ? e.courseId._id : e.courseId;
            try {
              const prog = await getCourseProgress(courseId);
              return [courseId, prog];
            } catch {
              return [courseId, null];
            }
          })
        );

        setProgressMap(Object.fromEntries(progressEntries));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Derived categories from enrollments ──────────────────────────────────

  const categories = useMemo(() => {
    const cats = enrollments
      .map((e) => e.courseId?.category)
      .filter(Boolean);
    return [...new Set(cats)];
  }, [enrollments]);

  // ── Filter logic ─────────────────────────────────────────────────────────

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const course   = e.courseId;
      const courseId = typeof course === "object" ? course._id : course;
      const pct      = progressMap[courseId]?.progressPercentage ?? 0;

      const status =
        pct === 100 ? "Completed" :
        pct > 0     ? "In Progress" : "Not Started";

      const matchSearch =
        !filters.search ||
        course?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        course?.educatorId?.name?.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus =
        filters.status === "All" || status === filters.status;

      const matchCategory =
        filters.category === "All" || course?.category === filters.category;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [enrollments, progressMap, filters]);

  // ── Filter handlers ───────────────────────────────────────────────────────

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => setFilters(initialFilters);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.category !== "All";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">My Courses</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your learning progress across all enrolled courses.
        </p>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <StatsBar
        enrollments={enrollments}
        progressMap={progressMap}
      />

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <CourseFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        hasActive={hasActiveFilters}
        categories={categories}
      />

      {/* ── Results count ────────────────────────────────────────────── */}
      {!loading && (
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredEnrollments.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {enrollments.length}
          </span>{" "}
          courses
        </p>
      )}

      {/* ── Courses Grid ─────────────────────────────────────────────── */}
      <CoursesGrid
        enrollments={filteredEnrollments}
        progressMap={progressMap}
        loading={loading}
        hasFilters={hasActiveFilters}
      />

    </div>
  );
};

export default StudentCourses;