import { DollarSign, ShoppingBag, Clock, RefreshCcw } from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, iconBg, iconColor, value, label }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 flex-1">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon size={22} className={iconColor} />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── PaymentStatsBar ──────────────────────────────────────────────────────────

/**
 * Props:
 *   payments   array — list of payment objects
 */
const PaymentStatsBar = ({ payments = [] }) => {
  const totalSpent = payments
    .filter((p) => p.paymentStatus === "success")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const successful = payments.filter((p) => p.paymentStatus === "success").length;
  const pending    = payments.filter((p) => p.paymentStatus === "pending").length;
  const refunded   = payments
    .filter((p) => p.paymentStatus === "refunded")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={DollarSign}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        value={`$${totalSpent}`}
        label="Total Spent"
      />
      <StatCard
        icon={ShoppingBag}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        value={successful}
        label="Successful Payments"
      />
      <StatCard
        icon={Clock}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        value={pending}
        label="Pending"
      />
      <StatCard
        icon={RefreshCcw}
        iconBg="bg-rose-100"
        iconColor="text-rose-500"
        value={`$${refunded}`}
        label="Total Refunded"
      />
    </div>
  );
};

export default PaymentStatsBar;