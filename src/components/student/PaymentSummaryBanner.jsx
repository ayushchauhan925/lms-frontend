import { Download, BookOpen, CheckCircle2, Clock, RefreshCcw } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const config = {
    success:  { label: "Paid",     cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    pending:  { label: "Pending",  cls: "bg-amber-100 text-amber-600",     icon: Clock        },
    refunded: { label: "Refunded", cls: "bg-rose-100 text-rose-600",       icon: RefreshCcw   },
  };
  const { label, cls, icon: Icon } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <Icon size={11} />
      {label}
    </span>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <tr>
    <td colSpan={6} className="py-16 text-center">
      <p className="text-slate-400 font-medium">No payments found</p>
      <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filters.</p>
    </td>
  </tr>
);

// ─── PaymentTable ─────────────────────────────────────────────────────────────

/**
 * Props:
 *   payments   array — filtered list of payment objects
 */
const PaymentTable = ({ payments = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">

          {/* Header */}
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-4">Course</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-4">Date</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-4">Method</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-4">Amount</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-4">Status</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-4">Invoice</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100">
            {payments.length === 0 ? (
              <EmptyState />
            ) : (
              payments.map((payment, idx) => {
                const course     = payment.courseId;
                const isFree     = payment.amount === 0;
                const invoiceNum = `INV-${new Date(payment.createdAt).getFullYear()}-${String(idx + 1).padStart(3, "0")}`;

                return (
                  <tr key={payment._id} className="hover:bg-slate-50 transition duration-150">

                    {/* Course */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-100">
                          {course?.thumbnail?.url ? (
                            <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-contain p-1" />
                          ) : (
                            <BookOpen size={16} className="text-indigo-300" />
                          )}
                        </div>
                        {/* Title + invoice + instructor */}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">
                            {course?.title || "Unknown Course"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {invoiceNum} · {course?.educatorId?.name || "Instructor"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatDate(payment.paidAt || payment.createdAt)}
                    </td>

                    {/* Method */}
                    <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap capitalize">
                      {isFree ? (
                        <span className="flex items-center gap-1.5">🎁 Free</span>
                      ) : (
                        payment.paymentMethod || "—"
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {isFree ? (
                        <span className="text-sm font-bold text-emerald-600">Free</span>
                      ) : (
                        <span className="text-sm font-bold text-slate-800">${payment.amount}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={payment.paymentStatus} />
                    </td>

                    {/* Invoice download */}
                    <td className="px-4 py-4">
                      <button
                        disabled
                        title="Invoice download coming soon"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Download size={15} />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PaymentTable;