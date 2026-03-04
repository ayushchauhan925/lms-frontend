import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star, ArrowRight, BookOpen, MessageSquare, TrendingUp, BarChart2,
} from "lucide-react";
import toast from "react-hot-toast";
import { getMyCourses } from "../../services/course.service";
import { getEducatorCourseReviews } from "../../services/review.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Stars = ({ rating, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s} size={size}
        className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
      />
    ))}
  </div>
);

const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-3 shrink-0">{star}</span>
      <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-6 text-right shrink-0">{count}</span>
    </div>
  );
};

// ─── EducatorReviewsPage ──────────────────────────────────────────────────────

const EducatorReviewsPage = () => {
  const [courses, setCourses]       = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const courseRes = await getMyCourses();
        const myCourses = courseRes.courses || [];
        setCourses(myCourses);

        // Fetch reviews for all courses in parallel
        const results = await Promise.allSettled(
          myCourses.map((c) =>
            getEducatorCourseReviews(c._id).then((res) =>
              (res.data || []).map((r) => ({
                ...r,
                _courseName:  c.title,
                _courseId:    String(c._id),
              }))
            )
          )
        );

        const flat = results
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => r.value)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAllReviews(flat);
      } catch {
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalReviews = allReviews.length;
  const avgRating    = totalReviews > 0
    ? (allReviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1)
    : null;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  const courseSummaries = courses.map((c) => {
    const reviews = allReviews.filter((r) => r._courseId === String(c._id));
    const avg = reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;
    return { ...c, _reviews: reviews, _avg: avg };
  });

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-7 w-44 bg-slate-100 rounded-full" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-64 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-72 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Reviews</h1>
        <p className="text-sm text-slate-400 mt-0.5">What students are saying about your courses</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Star,         color: "bg-amber-500",  label: "Overall Rating",    value: avgRating ? `${avgRating} / 5` : "—" },
          { icon: MessageSquare,color: "bg-indigo-500", label: "Total Reviews",     value: totalReviews },
          { icon: BookOpen,     color: "bg-violet-500", label: "Courses Reviewed",  value: courseSummaries.filter((c) => c._reviews.length > 0).length },
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rating breakdown + Course cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-5">
            <BarChart2 size={15} className="text-indigo-500" /> Rating Breakdown
          </h2>
          {totalReviews === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No reviews yet</p>
          ) : (
            <div className="space-y-2.5">
              {breakdown.map(({ star, count }) => (
                <RatingBar key={star} star={star} count={count} total={totalReviews} />
              ))}
            </div>
          )}
          {avgRating && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
              <span className="text-3xl font-black text-slate-800">{avgRating}</span>
              <div>
                <Stars rating={Number(avgRating)} size={14} />
                <p className="text-xs text-slate-400 mt-0.5">{totalReviews} total reviews</p>
              </div>
            </div>
          )}
        </div>

        {/* Per-course cards */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm">Reviews by Course</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {courseSummaries.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">No courses yet</div>
            ) : (
              courseSummaries.map((course) => (
                <Link
                  key={course._id}
                  to={`/educator/reviews/${course._id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition group"
                >
                  {course.thumbnail?.url ? (
                    <img src={course.thumbnail.url} alt={course.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <BookOpen size={18} className="text-indigo-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {course._avg ? (
                        <>
                          <Stars rating={Number(course._avg)} size={11} />
                          <span className="text-xs font-semibold text-amber-500">{course._avg}</span>
                          <span className="text-xs text-slate-400">
                            · {course._reviews.length} review{course._reviews.length !== 1 ? "s" : ""}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">No reviews yet</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-slate-300 group-hover:text-indigo-500 transition shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent reviews feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <TrendingUp size={15} className="text-indigo-500" /> Recent Reviews
          </h2>
          <span className="text-xs text-slate-400">{totalReviews} total</span>
        </div>

        {allReviews.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star size={20} className="text-amber-300" />
            </div>
            <p className="font-bold text-slate-600 text-sm">No reviews yet</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Once students review your courses, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {allReviews.slice(0, 10).map((review) => (
              <div key={review._id} className="px-6 py-4 hover:bg-slate-50 transition">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(review.studentId?.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">
                          {review.studentId?.name || "Student"}
                        </span>
                        <Stars rating={review.rating} size={11} />
                        <span className="text-xs text-slate-400">·</span>
                        <Link
                          to={`/educator/reviews/${review._courseId}`}
                          className="text-xs text-indigo-500 font-medium hover:underline truncate"
                        >
                          {review._courseName}
                        </Link>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorReviewsPage;