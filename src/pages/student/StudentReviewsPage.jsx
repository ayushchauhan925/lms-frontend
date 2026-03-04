import { useState, useEffect } from "react";
import {
  Star, Pencil, Trash2, X, Loader2, CheckCircle2,
  AlertTriangle, BookOpen, MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { getMyEnrollments } from "../../services/enrollment.service";
import {
  createReview, updateReview, deleteReview, getMyReviews,
} from "../../services/review.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

const RATING_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

// ─── StarRating ───────────────────────────────────────────────────────────────

const StarRating = ({ value, onChange, readonly = false, size = 20 }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform duration-100 ${
            !readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"
          }`}
        >
          <Star
            size={size}
            className={`transition-colors duration-150 ${
              (hovered || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// ─── ReviewFormModal ──────────────────────────────────────────────────────────

const ReviewFormModal = ({ enrollment, existingReview, onClose, onSaved }) => {
  const isEdit = !!existingReview;
  const course = enrollment.courseId;

  const [rating, setRating]   = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    if (!rating)         return toast.error("Please select a star rating.");
    if (!comment.trim()) return toast.error("Please write a comment.");

    try {
      setSaving(true);
      if (isEdit) {
        // res.data = { success, message, data: review }
        const res = await updateReview(existingReview._id, { rating, comment: comment.trim() });
        onSaved(res.data, "update");
        toast.success("Review updated!");
      } else {
        // res.data = { success, message, data: review }
        const res = await createReview(course._id, rating, comment.trim());
        onSaved(res.data, "create");
        toast.success("Review submitted!");
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            {isEdit ? "Edit Your Review" : "Write a Review"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Course preview strip */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            {course?.thumbnail?.url ? (
              <img
                src={course.thumbnail.url}
                alt={course.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-indigo-400" />
              </div>
            )}
            <p className="text-sm font-semibold text-slate-700 line-clamp-2">{course?.title}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Stars */}
          <div>
            <label className={labelClass}>Your Rating</label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} size={28} />
              {rating > 0 && (
                <span className="text-sm font-semibold text-amber-500">
                  {RATING_LABELS[rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className={labelClass}>
              Your Review
              <span className="float-right text-xs font-normal text-slate-400">
                {comment.length}/1000
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Share your experience — what did you learn, what could be better?"
              className={inputClass + " resize-none leading-relaxed"}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl text-sm transition shadow-md shadow-indigo-200"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : (
              <><CheckCircle2 size={14} />{isEdit ? "Update Review" : "Submit Review"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────

const DeleteConfirmModal = ({ review, onClose, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteReview(review._id);
      onDeleted(review._id);
      toast.success("Review deleted.");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Delete Review?</h3>
          <p className="text-sm text-slate-500 mt-1">
            Your review will be permanently removed. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CourseReviewCard ─────────────────────────────────────────────────────────

const CourseReviewCard = ({ enrollment, review, onWriteReview, onEditReview, onDeleteReview }) => {
  const course = enrollment.courseId;
  const hasReview = !!review;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* Course strip */}
      <div className="flex items-center gap-4 p-5 border-b border-slate-100">
        {course?.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <BookOpen size={22} className="text-indigo-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
            {course?.title || "Untitled Course"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Enrolled{" "}
            {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Review area */}
      <div className="p-5">
        {hasReview ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} readonly size={15} />
                <span className="text-xs font-semibold text-amber-500">
                  {RATING_LABELS[review.rating]}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(review.updatedAt || review.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {review.comment}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onEditReview(enrollment, review)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
              >
                <Pencil size={12} />
                Edit
              </button>
              <button
                onClick={() => onDeleteReview(review)}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-3 text-center">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={18} className="fill-slate-100 text-slate-200" />
              ))}
            </div>
            <p className="text-xs text-slate-400">You haven't reviewed this course yet</p>
            <button
              onClick={() => onWriteReview(enrollment)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-indigo-200"
            >
              <MessageSquare size={12} />
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── StudentReviewsPage ───────────────────────────────────────────────────────

const StudentReviewsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [reviewsMap, setReviewsMap]   = useState({}); // courseId -> review
  const [loading, setLoading]         = useState(true);

  const [reviewModal, setReviewModal]   = useState(null); // { enrollment, review|null }
  const [deleteModal, setDeleteModal]   = useState(null); // review

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [enrollRes, reviewRes] = await Promise.all([
          getMyEnrollments(),
          getMyReviews(),
        ]);

        setEnrollments(enrollRes.enrollments || []);

        // Build courseId -> review lookup map
        // getMyReviews returns { success, count, data: [...] }
        const map = {};
        (reviewRes.data || []).forEach((r) => {
          const cId = r.courseId?._id || r.courseId;
          map[String(cId)] = r;
        });
        setReviewsMap(map);
      } catch {
        toast.error("Failed to load your reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── CRUD callbacks ────────────────────────────────────────────────────────

  // `review` here is the `data` field from the API response
  const handleSaved = (review, type) => {
    const cId = String(review.courseId?._id || review.courseId);
    setReviewsMap((prev) => ({ ...prev, [cId]: review }));
  };

  const handleDeleted = (reviewId) => {
    setReviewsMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k]._id === reviewId) delete next[k];
      });
      return next;
    });
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const allReviews    = Object.values(reviewsMap);
  const reviewedCount = allReviews.length;
  const pendingCount  = enrollments.length - reviewedCount;
  const avgRating     = allReviews.length
    ? (allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1)
    : null;

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-7 w-48 bg-slate-100 rounded-full" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-52 bg-slate-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Reviews</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Share your feedback on courses you've enrolled in
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Courses Enrolled", value: enrollments.length },
            { label: "Reviews Written",  value: reviewedCount },
            {
              label: "Average Rating",
              value: avgRating
                ? <span className="flex items-center justify-center gap-1">{avgRating} <Star size={16} className="fill-amber-400 text-amber-400" /></span>
                : "—",
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-4 text-center">
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Empty state — no enrollments */}
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BookOpen size={20} className="text-indigo-300" />
            </div>
            <p className="font-bold text-slate-600">No enrolled courses</p>
            <p className="text-sm text-slate-400 max-w-xs">
              Enroll in a course first, then come back here to leave your review.
            </p>
          </div>
        ) : (
          <>
            {/* Pending reviews banner */}
            {pendingCount > 0 && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <MessageSquare size={16} className="text-amber-500 shrink-0" />
                <p className="text-sm text-amber-700 font-medium">
                  You have <span className="font-bold">{pendingCount}</span> course
                  {pendingCount !== 1 ? "s" : ""} waiting for your review.
                </p>
              </div>
            )}

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
              {enrollments.map((enrollment) => {
                const courseId = String(enrollment.courseId?._id || enrollment.courseId);
                const review   = reviewsMap[courseId] || null;
                return (
                  <CourseReviewCard
                    key={enrollment._id}
                    enrollment={enrollment}
                    review={review}
                    onWriteReview={(e)   => setReviewModal({ enrollment: e, review: null })}
                    onEditReview={(e, r) => setReviewModal({ enrollment: e, review: r })}
                    onDeleteReview={(r)  => setDeleteModal(r)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {reviewModal && (
        <ReviewFormModal
          enrollment={reviewModal.enrollment}
          existingReview={reviewModal.review}
          onClose={() => setReviewModal(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteModal && (
        <DeleteConfirmModal
          review={deleteModal}
          onClose={() => setDeleteModal(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
};

export default StudentReviewsPage;