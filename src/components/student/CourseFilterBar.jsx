import { Search, X } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ["All", "In Progress", "Completed", "Not Started"];

// ─── CourseFilterBar ──────────────────────────────────────────────────────────

/**
 * Props:
 *   filters      { search, status, category }
 *   onChange     fn(key, value)
 *   onReset      fn()
 *   hasActive    boolean
 *   categories   string[]  — derived from enrolled courses
 */
const CourseFilterBar = ({ filters, onChange, onReset, hasActive, categories = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">

      {/* Row 1 — Search + Reset */}
      <div className="flex gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search courses or instructors..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200"
          />
        </div>

        {/* Reset */}
        {hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl transition"
          >
            <X size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Row 2 — Status pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onChange("status", s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition duration-200 ${
              filters.status === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Row 3 — Category pills (only if categories exist) */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => onChange("category", cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition duration-200 ${
                filters.category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default CourseFilterBar;