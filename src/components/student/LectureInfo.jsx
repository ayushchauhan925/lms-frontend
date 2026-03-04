import { Clock, Eye } from "lucide-react";

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const LectureInfo = ({ lecture, index }) => {
  if (!lecture) return null;

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3">

      {/* Lecture number + preview badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Lecture {index}
        </span>
        {lecture.isPreview && (
          <span className="flex items-center gap-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            <Eye size={10} />
            Free Preview
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-lg font-black text-white leading-snug">
        {lecture.title}
      </h2>

      {/* Duration */}
      {lecture.duration > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={12} />
          {formatDuration(lecture.duration)}
        </div>
      )}

      {/* Description */}
      {lecture.lectureDescription && (
        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line border-t border-slate-700 pt-3">
          {lecture.lectureDescription}
        </p>
      )}

    </div>
  );
};

export default LectureInfo;