import { useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, RotateCcw, Award } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const timeAgo = (dateStr) => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7)   return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
};

const statusConfig = {
  "Completed":   { label: "Completed",   cls: "bg-emerald-100 text-emerald-700" },
  "In Progress": { label: "In Progress", cls: "bg-indigo-100 text-indigo-700"   },
  "Not Started": { label: "Not Started", cls: "bg-slate-100 text-slate-500"     },
};

// ─── CourseProgressCard ───────────────────────────────────────────────────────

/**
 * Props:
 *   enrollment   object   — enrollment object with populated courseId
 *   progress     object   — progress object for this course (or null)
 */
const CourseProgressCard = ({ enrollment, progress }) => {
  const navigate = useNavigate();

  const course     = enrollment.courseId;
  const courseId   = typeof course === "object" ? course._id : course;
  const pct        = progress?.progressPercentage ?? 0;
  const completed  = progress?.completedLectureIds?.length ?? 0;
  const total      = progress?.totalLectures ?? 0;
  const lastAccess = progress?.updatedAt || enrollment.createdAt;

  const status = pct === 100 ? "Completed" : pct > 0 ? "In Progress" : "Not Started";
  const { label, cls } = statusConfig[status];

  const barColor =
    status === "Completed"   ? "bg-emerald-500" :
    status === "In Progress" ? "bg-indigo-500"  : "bg-slate-300";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200 overflow-hidden flex flex-col">

      {/* ── Thumbnail ────────────────────────────────────────────────── */}
      <div className="relative h-44 bg-indigo-50 flex items-center justify-center flex-shrink-0">
        {course?.thumbnail?.url ? (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <BookOpen size={36} className="text-indigo-300" />
        )}

        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
          {label}
        </span>

        {/* Certificate badge for completed */}
        {status === "Completed" && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <Award size={15} className="text-amber-500" />
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Category */}
        <span className="text-xs font-semibold text-indigo-600">
          {course?.category || "Course"}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
          {course?.title || "Untitled Course"}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-slate-400">
          by <span className="text-slate-600 font-medium">
            {course?.educatorId?.name || "Instructor"}
          </span>
        </p>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {completed}/{total} lessons
            </span>
            <span className={`font-bold ${
              pct === 100 ? "text-emerald-600" :
              pct > 0     ? "text-indigo-600"  : "text-slate-400"
            }`}>
              {Math.round(pct)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Action buttons ────────────────────────────────────────── */}
        {status === "Completed" ? (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/student/learn/${courseId}`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <RotateCcw size={13} />
              Revisit
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
            >
              <Award size={13} />
              Certificate
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate(`/student/learn/${courseId}`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white transition duration-200 shadow-sm shadow-indigo-200"
          >
            <PlayCircle size={14} />
            {status === "In Progress" ? "Continue Learning" : "Start Learning"}
          </button>
        )}

        {/* Last accessed */}
        <p className="text-xs text-slate-400 text-center">
          {status === "Not Started"
            ? `Enrolled ${timeAgo(enrollment.createdAt)}`
            : `Last accessed ${timeAgo(lastAccess)}`
          }
        </p>

      </div>
    </div>
  );
};

export default CourseProgressCard;