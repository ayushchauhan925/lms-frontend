import { Link } from "react-router-dom";
import { BookOpen, Globe, BarChart2, ArrowRight } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const levelColors = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-600",
};

// ─── CourseCard ───────────────────────────────────────────────────────────────

/**
 * Props:
 *   course       object   — full course object from getAllPublishedCourses
 *   isEnrolled   boolean  — whether the logged-in student is already enrolled
 *   onEnroll     fn()     — called when student clicks Enroll (opens PaymentModal)
 */
const CourseCard = ({ course, isEnrolled = false, onEnroll }) => {
  const {
    _id,
    title,
    thumbnail,
    category,
    level,
    language,
    price,
    educatorId,
  } = course;

  const educatorName = educatorId?.name || "Instructor";
  const isFree       = price === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 flex flex-col overflow-hidden">

      {/* ── Thumbnail ────────────────────────────────────────────────── */}
      <div className="relative w-full h-44 bg-slate-100 flex-shrink-0">
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50">
            <BookOpen size={32} className="text-indigo-300" />
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 left-3">
          {isFree ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              Free
            </span>
          ) : (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              ${price}
            </span>
          )}
        </div>

        {/* Level badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${levelColors[level] || "bg-slate-100 text-slate-600"}`}>
            {level}
          </span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Category */}
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full self-start">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Educator */}
        <p className="text-xs text-slate-400">
          by <span className="text-slate-600 font-medium">{educatorName}</span>
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Globe size={11} />
            {language}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <BarChart2 size={11} />
            {level}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-1">

          {/* See More */}
          <Link
            to={`/student/courses/${_id}`}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2 transition"
          >
            See More
            <ArrowRight size={12} />
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Enroll button */}
          {isEnrolled ? (
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
            >
              ✓ Enrolled
            </button>
          ) : (
            <button
              onClick={onEnroll}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white transition duration-200 shadow-md shadow-indigo-200"
            >
              {isFree ? "Enroll Free" : `Enroll $${price}`}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default CourseCard;