import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlayerTopBar = ({ courseTitle, completedCount = 0, totalCount = 0 }) => {
  const navigate = useNavigate();
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center gap-4">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition flex-shrink-0"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-600 flex-shrink-0" />

      {/* Course title */}
      <h1 className="text-sm font-bold text-white truncate flex-1">
        {courseTitle}
      </h1>

      {/* Progress */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-slate-400 hidden sm:block">
          <span className="font-semibold text-white">{completedCount}</span>
          /{totalCount} completed
        </span>

        <div className="w-28 h-2 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          percentage === 100
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-indigo-500/20 text-indigo-400"
        }`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default PlayerTopBar;