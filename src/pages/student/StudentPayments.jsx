import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import { getMyPayments } from "../../services/payment.service";

import PaymentStatsBar     from "../../components/student/PaymentStatsBar";
import PaymentFilterBar    from "../../components/student/PaymentFilterBar";
import PaymentTable        from "../../components/student/PaymentTable";
import PaymentSummaryBanner from "../../components/student/PaymentSummaryBanner";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
      ))}
    </div>
    <div className="h-16 bg-slate-100 rounded-2xl" />
    <div className="h-64 bg-slate-100 rounded-2xl" />
    <div className="h-32 bg-slate-100 rounded-2xl" />
  </div>
);

// ─── StudentPayments ──────────────────────────────────────────────────────────

const initialFilters = { search: "", status: "All" };

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState(initialFilters);

  // ── Fetch payments ────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getMyPayments();
        setPayments(res.payments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Filter logic ─────────────────────────────────────────────────────────

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const statusMap = { Paid: "success", Pending: "pending", Refunded: "refunded" };

      const matchStatus =
        filters.status === "All" || p.paymentStatus === statusMap[filters.status];

      const matchSearch =
        !filters.search ||
        p.courseId?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(filters.search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [payments, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Payments</h1>
        <p className="text-slate-400 text-sm mt-1">
          View and manage your payment history and invoices.
        </p>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <PaymentStatsBar payments={payments} />

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <PaymentFilterBar
        filters={filters}
        onChange={handleFilterChange}
      />

      {/* ── Results count ────────────────────────────────────────────── */}
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">{filteredPayments.length}</span>
        {" "}of{" "}
        <span className="font-semibold text-slate-700">{payments.length}</span>
        {" "}payments
      </p>

      {/* ── Payment Table ────────────────────────────────────────────── */}
      <PaymentTable payments={filteredPayments} />

      {/* ── Summary Banner ───────────────────────────────────────────── */}
      <PaymentSummaryBanner payments={payments} />

    </div>
  );
};

export default StudentPayments;