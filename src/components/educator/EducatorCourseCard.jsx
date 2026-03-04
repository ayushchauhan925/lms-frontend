import { Link } from "react-router-dom";
import {
  BookOpen,
  Globe,
  BarChart2,
  ArrowRight,
  Trash2,
  DollarSign,
  Users,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const levelColors = {
  beginner:     "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced:     "bg-rose-100 text-rose-600",
};

// ─── EducatorCourseCard ───────────────────────────────────────────────────────

/**
 * Props:
 *   course       object   — full course object from getMyCourses
 *   onDelete     fn(id)   — called when educator clicks Delete
 */
const EducatorCourseCard = ({ course, onDelete }) => {
  const {
    _id,
    title,
    thumbnail,
    category,
    level,
    language,
    price,
    isPublished,
  } = course;

  const isFree = price === 0;

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

        {/* Published / Draft badge */}
        <div className="absolute top-3 left-3">
          {isPublished ? (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              Published
            </span>
          ) : (
            <span className="bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              Draft
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

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Globe size={11} />
            {language}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <BarChart2 size={11} />
            <span className="capitalize">{level}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <DollarSign size={11} />
            {isFree ? "Free" : `$${price}`}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">

          {/* Delete button */}
          <button
            type="button"
            onClick={() => onDelete(_id)}
            className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
          >
            <Trash2 size={13} />
            Delete
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* See Details */}
          <Link
            to={`/educator/courses/${_id}`}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition duration-200 shadow-md shadow-indigo-200"
          >
            See Details
            <ArrowRight size={12} />
          </Link>

        </div>
      </div>
    </div>
  );
};

export default EducatorCourseCard;