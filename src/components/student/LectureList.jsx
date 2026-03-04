import { CheckCircle2, PlayCircle, Circle } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ─── LectureList ──────────────────────────────────────────────────────────────

const LectureList = ({ lectures = [], currentLectureId, completedIds = new Set(), onSelect }) => {
  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700">

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 flex-shrink-0">
        <h2 className="text-sm font-bold text-white">Course Content</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {completedIds.size}/{lectures.length} lectures completed
        </p>
      </div>

      {/* Lecture items */}
      <div className="overflow-y-auto flex-1">
        {lectures.map((lec, idx) => {
          const isCurrent   = lec._id === currentLectureId;
          const isCompleted = completedIds.has(lec._id);

          return (
            <button
              key={lec._id}
              onClick={() => onSelect(lec)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-slate-700/50 transition duration-150 ${
                isCurrent
                  ? "bg-indigo-600/20 border-l-4 border-l-indigo-500"
                  : "hover:bg-slate-700/50"
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : isCurrent ? (
                  <PlayCircle size={18} className="text-indigo-400" />
                ) : (
                  <Circle size={18} className="text-slate-600" />
                )}
              </div>

              {/* Lecture info */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold leading-snug truncate ${
                  isCurrent
                    ? "text-indigo-300"
                    : isCompleted
                    ? "text-slate-400"
                    : "text-slate-200"
                }`}>
                  {idx + 1}. {lec.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    {formatDuration(lec.duration)}
                  </span>
                  {lec.isPreview && (
                    <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                      Preview
                    </span>
                  )}
                </div>
              </div>

            </button>
          );
        })}
      </div>

    </div>
  );
};

export default LectureList;