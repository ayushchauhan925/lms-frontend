import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import CourseProgressCard from "./CourseProgressCard";
import SkeletonCard from "./SkeletonCard";

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ hasFilters }) => {
  const navigate = useNavigate();
  return (
    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
        <BookOpen size={24} className="text-indigo-400" />
      </div>
      {hasFilters ? (
        <>
          <p className="font-bold text-slate-700">No courses match your filters</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </>
      ) : (
        <>
          <p className="font-bold text-slate-700">You haven't enrolled in any courses yet</p>
          <p className="text-sm text-slate-400 mt-1">Explore courses and start learning today.</p>
          <button
            onClick={() => navigate("/student/explore")}
            className="mt-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200"
          >
            Explore Courses
          </button>
        </>
      )}
    </div>
  );
};

// ─── CoursesGrid ──────────────────────────────────────────────────────────────

/**
 * Props:
 *   enrollments   array    — filtered list of enrollment objects
 *   progressMap   object   — { [courseId]: progress }
 *   loading       boolean
 *   hasFilters    boolean  — whether any filter is active
 */
const CoursesGrid = ({ enrollments = [], progressMap = {}, loading = false, hasFilters = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {/* Loading skeletons */}
      {loading ? (
        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
      ) : enrollments.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        enrollments.map((enrollment) => {
          const courseId = typeof enrollment.courseId === "object"
            ? enrollment.courseId._id
            : enrollment.courseId;

          return (
            <CourseProgressCard
              key={enrollment._id}
              enrollment={enrollment}
              progress={progressMap[courseId] || null}
            />
          );
        })
      )}

    </div>
  );
};

export default CoursesGrid;