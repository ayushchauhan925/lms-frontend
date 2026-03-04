import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen, Globe, BarChart2, Tag,
  ArrowLeft, User, Clock, Lock, Loader2, Star, MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { getCourseById } from "../../services/course.service";
import { getMyEnrollments } from "../../services/enrollment.service";
import { getCourseReviews } from "../../services/review.service";
import PaymentModal from "../../components/student/PaymentModal";

const levelColors = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-600",
};

const RATING_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Stars = ({ rating, size = 13 }) => (
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
    <div className="h-5 w-24 bg-slate-100 rounded-full" />
    <div className="h-64 bg-slate-100 rounded-2xl" />
    <div className="space-y-3">
      <div className="h-7 w-2/3 bg-slate-100 rounded-full" />
      <div className="h-4 w-1/3 bg-slate-100 rounded-full" />
      <div className="h-4 w-full bg-slate-100 rounded-full" />
      <div className="h-4 w-5/6 bg-slate-100 rounded-full" />
    </div>
  </div>
);

// ─── CourseDetailPage ─────────────────────────────────────────────────────────

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse]                         = useState(null);
  const [loading, setLoading]                       = useState(true);
  const [isEnrolled, setIsEnrolled]                 = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Reviews
  const [reviews, setReviews]           = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // ── Fetch course + enrollment ─────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollmentsRes] = await Promise.all([
          getCourseById(id),
          getMyEnrollments(),
        ]);

        setCourse(courseRes.course);

        const ids = new Set(
          (enrollmentsRes.enrollments || []).map((e) =>
            typeof e.courseId === "object" ? e.courseId._id : e.courseId
          )
        );
        setIsEnrolled(ids.has(id));
      } catch (err) {
        toast.error("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Fetch reviews ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await getCourseReviews(id);
        setReviews(res.data || []);
      } catch {
        // Reviews failing shouldn't break the page
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleEnrolled = () => {
    setIsEnrolled(true);
    setIsPaymentModalOpen(false);
  };

  if (loading) return <Skeleton />;

  if (!course) return (
    <div className="text-center py-20">
      <p className="text-slate-500 font-medium">Course not found.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline text-sm font-semibold">
        Go Back
      </button>
    </div>
  );

  // ── Review derived stats ──────────────────────────────────────────────────

  const totalReviews = reviews.length;
  const avgRating    = totalReviews > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1)
    : null;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const isFree = course.price === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left — Course Info ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Thumbnail */}
          <div className="w-full h-52 rounded-2xl overflow-hidden border border-slate-200 bg-indigo-50 flex items-center justify-center">
            {course.thumbnail?.url ? (
              <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-contain p-4" />
            ) : (
              <BookOpen size={48} className="text-indigo-300" />
            )}
          </div>

          {/* Category + Level */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {course.category}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${levelColors[course.level] || "bg-slate-100 text-slate-600"}`}>
              {course.level}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-black text-slate-800 leading-snug">{course.title}</h1>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Instructor</p>
              <p className="text-sm font-semibold text-slate-700">{course.educatorId?.name || "Instructor"}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Globe size={14} /> {course.language}</span>
            <span className="flex items-center gap-1.5 capitalize"><BarChart2 size={14} /> {course.level}</span>
            {avgRating && (
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-amber-500">{avgRating}</span>
                <span className="text-slate-400">({totalReviews} reviews)</span>
              </span>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-2">About this course</h2>
            <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{course.description}</p>
          </div>

          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={13} className="text-slate-400" />
              {course.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Right — Enroll Card ─────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div>
              {isFree ? (
                <span className="text-3xl font-black text-emerald-600">Free</span>
              ) : (
                <span className="text-3xl font-black text-slate-800">${course.price}</span>
              )}
            </div>

            {isEnrolled ? (
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/student/learn/${course._id}`)}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white transition duration-200 shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  ▶ Start Learning
                </button>
                <div className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 text-center">
                  ✓ Already Enrolled
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white transition duration-200 shadow-md shadow-indigo-200"
              >
                {isFree ? "Enroll for Free" : `Enroll for $${course.price}`}
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5">
              <Lock size={11} className="text-slate-400" />
              <p className="text-xs text-slate-400">Secure enrollment</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-500" />
            Student Reviews
            {totalReviews > 0 && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {totalReviews}
              </span>
            )}
          </h2>
        </div>

        {reviewsLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
          </div>
        ) : totalReviews === 0 ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star size={18} className="text-amber-300" />
            </div>
            <p className="font-bold text-slate-600 text-sm">No reviews yet</p>
            <p className="text-xs text-slate-400">Be the first to review this course after enrolling.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">

            {/* Rating summary */}
            <div className="flex flex-col sm:flex-row gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              {/* Big number */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <span className="text-5xl font-black text-slate-800">{avgRating}</span>
                <Stars rating={Number(avgRating)} size={16} />
                <p className="text-xs text-slate-400 mt-1">{totalReviews} reviews</p>
              </div>
              {/* Bars */}
              <div className="flex-1 space-y-2 justify-center flex flex-col">
                {breakdown.map(({ star, count }) => (
                  <RatingBar key={star} star={star} count={count} total={totalReviews} />
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="divide-y divide-slate-100">
              {displayedReviews.map((review) => (
                <div key={review._id} className="py-5 first:pt-0">
                  <div className="flex items-start gap-3">
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
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      </div>
                      <Stars rating={review.rating} size={12} />
                      <p className="text-sm text-slate-500 leading-relaxed mt-1.5">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more / less */}
            {totalReviews > 4 && (
              <button
                onClick={() => setShowAllReviews((v) => !v)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                {showAllReviews ? "Show less" : `Show all ${totalReviews} reviews`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        course={course}
        onEnrolled={handleEnrolled}
      />
    </div>
  );
};

export default CourseDetailPage;