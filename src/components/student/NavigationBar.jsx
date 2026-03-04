import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";

const NavigationBar = ({
  onPrev,
  onNext,
  onMarkComplete,
  hasPrev = false,
  hasNext = false,
  isCompleted = false,
  markingComplete = false,
}) => {
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 px-5 py-3 flex items-center justify-between gap-3">

      {/* Prev button */}
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition px-3 py-2 rounded-xl hover:bg-slate-700"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Mark Complete button */}
      {isCompleted ? (
        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <CheckCircle2 size={15} />
          Completed
        </div>
      ) : (
        <button
          onClick={onMarkComplete}
          disabled={markingComplete}
          className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition duration-200 shadow-sm shadow-indigo-900"
        >
          {markingComplete ? (
            <><Loader2 size={14} className="animate-spin" />Saving...</>
          ) : (
            <><CheckCircle2 size={14} />Mark Complete</>
          )}
        </button>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition px-3 py-2 rounded-xl hover:bg-slate-700"
      >
        Next
        <ChevronRight size={16} />
      </button>

    </div>
  );
};

export default NavigationBar;