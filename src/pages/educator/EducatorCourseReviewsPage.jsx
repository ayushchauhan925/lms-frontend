import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star, ArrowLeft, BookOpen, BarChart2, MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { getCourseById } from "../../services/course.service";
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

const RATING_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

// ─── EducatorCourseReviewsPage ────────────────────────────────────────────────

const EducatorCourseReviewsPage = () => {
  const { courseId } = useParams();

  const [course, setCourse]   = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filterRating, setFilterRating] = useState(0); // 0 = all

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseRes, reviewRes] = await Promise.all([
          getCourseById(courseId),
          getEducatorCourseReviews(courseId),
        ]);
        setCourse(courseRes.course);
        const sorted = (reviewRes.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sorted);
      } catch {
        toast.error("Failed to load course reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const totalReviews = reviews.length;
  const avgRating    = totalReviews > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1)
    : null;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const filtered = filterRating === 0
    ? reviews
    : reviews.filter((r) => r.rating === filterRating);

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-5 w-32 bg-slate-100 rounded-full" />
        <div className="h-28 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-56 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-56 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link
          to="/educator/reviews"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-4 bg-slate-200" />
        <h1 className="text-2xl font-black text-slate-800">Course Reviews</h1>
      </div>

      {/* Course info strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
        {course?.thumbnail?.url ? (
          <img src={course.thumbnail.url} alt={course.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <BookOpen size={22} className="text-indigo-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-base truncate">{course?.title}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {avgRating ? (
              <>
                <Stars rating={Number(avgRating)} size={13} />
                <span className="text-sm font-black text-amber-500">{avgRating}</span>
                <span className="text-xs text-slate-400">
                  {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No reviews yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown + filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Rating breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-5">
            <BarChart2 size={15} className="text-indigo-500" /> Rating Breakdown
          </h2>
          {totalReviews === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No reviews yet</p>
          ) : (
            <>
              <div className="space-y-2.5">
                {breakdown.map(({ star, count }) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                    className={`w-full flex items-center gap-2 rounded-lg px-1 py-0.5 transition ${
                      filterRating === star ? "bg-amber-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs text-slate-500 w-3 shrink-0">{star}</span>
                    <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: totalReviews > 0 ? `${Math.round((count / totalReviews) * 100)}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-6 text-right shrink-0">{count}</span>
                  </button>
                ))}
              </div>
              {avgRating && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-800">{avgRating}</span>
                  <div>
                    <Stars rating={Number(avgRating)} size={14} />
                    <p className="text-xs text-slate-400 mt-0.5">{totalReviews} reviews</p>
                  </div>
                </div>
              )}
              {filterRating > 0 && (
                <button
                  onClick={() => setFilterRating(0)}
                  className="mt-3 text-xs text-indigo-500 font-semibold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </>
          )}
        </div>

        {/* Quick stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
          {[
            {
              label: "5★ Reviews",
              value: breakdown[0].count,
              sub: `${totalReviews > 0 ? Math.round((breakdown[0].count / totalReviews) * 100) : 0}% of total`,
              color: "bg-emerald-500",
            },
            {
              label: "Average Rating",
              value: avgRating ?? "—",
              sub: "Out of 5 stars",
              color: "bg-amber-500",
            },
            {
              label: "Total Reviews",
              value: totalReviews,
              sub: "All time",
              color: "bg-indigo-500",
            },
            {
              label: "Critical (≤2★)",
              value: breakdown[3].count + breakdown[4].count,
              sub: "Reviews to address",
              color: "bg-red-400",
            },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} mb-2`}>
                <Star size={14} className="text-white" />
              </div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MessageSquare size={15} className="text-indigo-500" />
            {filterRating > 0 ? `${filterRating}★ Reviews` : "All Reviews"}
          </h2>
          <span className="text-xs text-slate-400">{filtered.length} showing</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star size={20} className="text-amber-300" />
            </div>
            <p className="font-bold text-slate-600 text-sm">
              {filterRating > 0 ? `No ${filterRating}★ reviews` : "No reviews yet"}
            </p>
            <p className="text-xs text-slate-400">
              {filterRating > 0 ? "Try a different filter." : "Students haven't reviewed this course yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((review) => (
              <div key={review._id} className="px-6 py-5 hover:bg-slate-50 transition">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {(review.studentId?.name || "?")[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {review.studentId?.name || "Student"}
                        </span>
                        <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          {RATING_LABELS[review.rating]}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="mt-1">
                      <Stars rating={review.rating} size={13} />
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">
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

export default EducatorCourseReviewsPage;