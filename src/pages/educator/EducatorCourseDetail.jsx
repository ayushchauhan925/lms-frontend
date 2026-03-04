import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Globe, BarChart2, DollarSign, Clock,
  Eye, Star, Tag, CheckCircle2, AlertCircle, Video, Pencil, Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { getCourseById }      from "../../services/course.service";
import { getLecturesByCourse } from "../../services/lecture.service";
import { getCourseReviews }   from "../../services/review.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const levelColors = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-600",
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={13}
        className={star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
      />
    ))}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children, count }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-indigo-600" />
      </div>
      <h2 className="font-bold text-slate-800">{title}</h2>
      {count !== undefined && (
        <span className="ml-1 text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
    {children}
  </div>
);

// ─── EducatorCourseDetail ─────────────────────────────────────────────────────
const EducatorCourseDetail = () => {
  const { id } = useParams();

  const [course, setCourse]     = useState(null);
  const [lectures, setLectures] = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseRes, lecturesRes, reviewsRes] = await Promise.all([
          getCourseById(id),
          getLecturesByCourse(id),
          getCourseReviews(id),
        ]);
        setCourse(courseRes.course);
        setLectures(Array.isArray(lecturesRes) ? lecturesRes : []);
        setReviews(reviewsRes.data || []);
      } catch {
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-5 w-36 bg-slate-100 rounded-full" />
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="h-14 bg-slate-50 border-b border-slate-100" />
          <div className="h-48 bg-slate-100" />
          <div className="p-6 space-y-3">
            <div className="h-6 w-2/3 bg-slate-100 rounded-full" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="h-6 w-20 bg-slate-100 rounded-full" />)}
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="text-3xl mb-3">😕</p>
        <p className="font-bold text-slate-700">Course not found</p>
        <Link
          to="/educator/courses"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
        >
          <ArrowLeft size={14} /> Back to My Courses
        </Link>
      </div>
    );
  }

  const totalDuration = lectures.reduce((acc, l) => acc + (l.duration || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <Link
          to="/educator/courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={14} /> Back to My Courses
        </Link>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2">
          <Link
            to={`/educator/enrollments?course=${id}`}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm transition duration-200 border border-slate-200 shadow-sm"
          >
            <Users size={13} /> See Enrollments
          </Link>
          <Link
            to={`/educator/courses/${id}/edit`}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
          >
            <Pencil size={13} /> Edit Course
          </Link>
        </div>
      </div>

      {/* ── Course Info ── */}
      <SectionCard title="Course Info" icon={BookOpen}>
        <div className="relative w-full h-48 bg-slate-50 border-b border-slate-100">
          {course.thumbnail?.url ? (
            <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
              <BookOpen size={40} className="text-indigo-200" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            {course.isPublished ? (
              <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <CheckCircle2 size={11} /> Published
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                <AlertCircle size={11} /> Draft
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h1 className="text-xl font-black text-slate-800 leading-snug">{course.title}</h1>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${levelColors[course.level] || "bg-slate-100 text-slate-600"}`}>
              {course.level}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <Globe size={11} /> {course.language}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <BarChart2 size={11} /> {course.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <DollarSign size={11} /> {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <Clock size={11} /> {formatDuration(totalDuration)} total
            </span>
            <span className="flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <Video size={11} /> {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
            </span>
          </div>

          {course.tags?.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag size={11} className="text-slate-400" />
              {course.tags.map((tag) => (
                <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{course.description}</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Lectures ── */}
      <SectionCard title="Lectures" icon={Video} count={lectures.length}>
        {lectures.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-400 text-sm">No lectures added yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {lectures.map((lecture, index) => (
              <li key={lecture._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-slate-500">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{lecture.title}</p>
                  {lecture.lectureDescription && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{lecture.lectureDescription}</p>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                  <Clock size={11} /> {formatDuration(lecture.duration)}
                </span>
                {lecture.isPreview && (
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                    <Eye size={10} /> Free Preview
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* ── Reviews ── */}
      <SectionCard title="Student Reviews" icon={Star} count={reviews.length}>
        {reviews.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-400 text-sm">No reviews yet.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center gap-6">
              <div className="text-center flex-shrink-0">
                <p className="text-4xl font-black text-slate-800">{course.averageRating?.toFixed(1) || "—"}</p>
                <StarRating rating={course.averageRating || 0} />
                <p className="text-xs text-slate-400 mt-1">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                  const pct   = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-3 flex-shrink-0">{star}</span>
                      <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-4 flex-shrink-0 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {reviews.map((review) => (
                <li key={review._id} className="px-6 py-5 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-indigo-600">
                          {review.studentId?.name?.[0]?.toUpperCase() || "S"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{review.studentId?.name || "Student"}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed pl-12">{review.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </SectionCard>

    </div>
  );
};

export default EducatorCourseDetail;