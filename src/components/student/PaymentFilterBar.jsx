import { Search } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ["All", "Paid", "Pending", "Refunded"];

// ─── PaymentFilterBar ─────────────────────────────────────────────────────────

/**
 * Props:
 *   filters    { search, status }
 *   onChange   fn(key, value)
 */
const PaymentFilterBar = ({ filters, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center">

        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search by course or transaction ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200"
          />
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-shrink-0">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onChange("status", s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
                filters.status === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PaymentFilterBar;