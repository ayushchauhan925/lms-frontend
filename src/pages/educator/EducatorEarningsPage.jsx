import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, BookOpen, Download, TrendingUp, User, Calendar } from "lucide-react";
import { getEducatorEarnings } from "../../services/payment.service";
import { useAuth } from "../../context/AuthContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ── Print helper ──────────────────────────────────────────────────────────────
const printHTML = (html, title) => {
  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Inter',sans-serif;background:#fff;color:#1e293b;}
      @page{size:A4 portrait;margin:0;}
      @media print{html,body{width:210mm;min-height:297mm;}}
    </style>
  </head><body>${html}
    <script>window.onload=()=>{window.print();window.close();}<\/script>
  </body></html>`);
  w.document.close();
};

// ── Invoice HTML builder ──────────────────────────────────────────────────────
const buildInvoiceHTML = (payment, educatorName) => {
  const invoiceNo  = `INV-${payment.transactionId}`;
  const issueDate  = fmtDate(payment.paidAt || payment.createdAt);
  const course     = payment.courseId;
  const student    = payment.studentId;
  const subtotal   = payment.amount;
  const tax        = 0; // extend later
  const total      = subtotal + tax;

  return `
  <div style="width:210mm;min-height:297mm;padding:0;background:#fff;position:relative;">

    <!-- Header band -->
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px 48px 32px;color:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px;">Learnify</div>
          <div style="font-size:11px;opacity:0.75;margin-top:4px;letter-spacing:0.08em;text-transform:uppercase;">Online Learning Platform</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px;font-weight:800;letter-spacing:-1px;">INVOICE</div>
          <div style="font-size:12px;opacity:0.8;margin-top:4px;">${invoiceNo}</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.65;margin-bottom:4px;">Issued By</div>
          <div style="font-size:13px;font-weight:600;">${educatorName}</div>
          <div style="font-size:11px;opacity:0.75;margin-top:2px;">Educator · Learnify</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.65;margin-bottom:4px;">Issue Date</div>
          <div style="font-size:13px;font-weight:600;">${issueDate}</div>
          <div style="margin-top:8px;">
            <span style="background:rgba(255,255,255,0.2);border-radius:999px;padding:3px 12px;font-size:11px;font-weight:600;">✓ PAID</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:40px 48px;">

      <!-- Bill to / Transaction -->
      <div style="display:flex;justify-content:space-between;gap:24px;margin-bottom:36px;">
        <div style="flex:1;background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:10px;font-weight:600;">Bill To</div>
          <div style="font-size:14px;font-weight:700;color:#1e293b;">${student?.name || '—'}</div>
          <div style="font-size:12px;color:#64748b;margin-top:3px;">${student?.email || '—'}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px;text-transform:capitalize;">Student · Learnify</div>
        </div>
        <div style="flex:1;background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:10px;font-weight:600;">Transaction Details</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:11px;color:#64748b;">Transaction ID</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;font-family:monospace;">${payment.transactionId}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span style="font-size:11px;color:#64748b;">Payment Method</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;text-transform:capitalize;">${payment.paymentMethod}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:11px;color:#64748b;">Status</span>
            <span style="font-size:11px;font-weight:700;color:#16a34a;text-transform:capitalize;">${payment.paymentStatus}</span>
          </div>
        </div>
      </div>

      <!-- Line items table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#1e293b;color:#fff;">
            <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;border-radius:8px 0 0 8px;">#</th>
            <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Description</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Category</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Qty</th>
            <th style="padding:12px 16px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;border-radius:0 8px 8px 0;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:16px;font-size:12px;color:#64748b;">01</td>
            <td style="padding:16px;">
              <div style="font-size:13px;font-weight:600;color:#1e293b;">${course?.title || '—'}</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">Online Course · Lifetime Access</div>
            </td>
            <td style="padding:16px;text-align:center;">
              <span style="background:#ede9fe;color:#7c3aed;border-radius:999px;padding:3px 10px;font-size:10px;font-weight:600;text-transform:capitalize;">${course?.category || '—'}</span>
            </td>
            <td style="padding:16px;text-align:center;font-size:13px;color:#1e293b;">1</td>
            <td style="padding:16px;text-align:right;font-size:13px;font-weight:700;color:#1e293b;">${fmt(payment.amount)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:40px;">
        <div style="width:260px;">
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:12px;color:#64748b;">Subtotal</span>
            <span style="font-size:12px;font-weight:600;color:#1e293b;">${fmt(subtotal)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:12px;color:#64748b;">Tax (0%)</span>
            <span style="font-size:12px;font-weight:600;color:#1e293b;">${fmt(tax)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:12px 16px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:10px;margin-top:8px;">
            <span style="font-size:13px;font-weight:700;color:#fff;">Total</span>
            <span style="font-size:15px;font-weight:800;color:#fff;">${fmt(total)}</span>
          </div>
        </div>
      </div>

      <!-- Note -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:36px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:18px;">✅</span>
        <div>
          <div style="font-size:12px;font-weight:600;color:#15803d;">Payment Confirmed</div>
          <div style="font-size:11px;color:#16a34a;margin-top:2px;">This invoice was automatically generated upon successful payment on ${issueDate}.</div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:12px;font-weight:700;color:#4f46e5;">Learnify</div>
          <div style="font-size:10px;color:#94a3b8;margin-top:2px;">learnify.com · support@learnify.com</div>
        </div>
        <div style="font-size:10px;color:#94a3b8;text-align:right;">
          <div>This is a computer-generated invoice.</div>
          <div>No signature required.</div>
        </div>
      </div>

    </div>
  </div>`;
};

// ── Earnings Report HTML builder ──────────────────────────────────────────────
const buildReportHTML = (data, educatorName) => {
  const { totalEarnings, totalSales, payments, earningsByCourse } = data;
  const avgOrder  = totalSales > 0 ? totalEarnings / totalSales : 0;
  const reportDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const courseRows = earningsByCourse.map((c, i) => `
    <tr style="border-bottom:1px solid #f1f5f9;${i % 2 === 0 ? '' : 'background:#f8fafc;'}">
      <td style="padding:12px 16px;font-size:12px;color:#64748b;">${i + 1}</td>
      <td style="padding:12px 16px;">
        <div style="font-size:13px;font-weight:600;color:#1e293b;">${c.title}</div>
        <div style="font-size:11px;color:#94a3b8;text-transform:capitalize;">${c.category}</div>
      </td>
      <td style="padding:12px 16px;text-align:center;font-size:13px;font-weight:600;color:#1e293b;">${c.sales}</td>
      <td style="padding:12px 16px;text-align:center;font-size:12px;color:#64748b;">${fmt(c.price)}</td>
      <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:#16a34a;">${fmt(c.earnings)}</td>
    </tr>
  `).join("");

  const txnRows = payments.slice(0, 20).map((p, i) => `
    <tr style="border-bottom:1px solid #f1f5f9;${i % 2 === 0 ? '' : 'background:#f8fafc;'}">
      <td style="padding:10px 16px;font-size:11px;font-family:monospace;color:#64748b;">${p.transactionId}</td>
      <td style="padding:10px 16px;font-size:12px;color:#1e293b;">${p.studentId?.name || '—'}</td>
      <td style="padding:10px 16px;font-size:12px;color:#1e293b;">${p.courseId?.title || '—'}</td>
      <td style="padding:10px 16px;text-align:center;font-size:11px;color:#64748b;">${fmtDate(p.paidAt || p.createdAt)}</td>
      <td style="padding:10px 16px;text-align:right;font-size:12px;font-weight:700;color:#16a34a;">${fmt(p.amount)}</td>
    </tr>
  `).join("");

  return `
  <div style="width:210mm;min-height:297mm;padding:0;background:#fff;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:40px 48px 32px;color:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px;">Learnify</div>
          <div style="font-size:11px;opacity:0.6;margin-top:4px;letter-spacing:0.08em;text-transform:uppercase;">Online Learning Platform</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:22px;font-weight:800;letter-spacing:-0.5px;">EARNINGS REPORT</div>
          <div style="font-size:11px;opacity:0.7;margin-top:4px;">Generated on ${reportDate}</div>
        </div>
      </div>
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.15);">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.6;margin-bottom:4px;">Prepared For</div>
        <div style="font-size:16px;font-weight:700;">${educatorName}</div>
        <div style="font-size:11px;opacity:0.65;margin-top:2px;">Educator · Learnify Platform</div>
      </div>
    </div>

    <div style="padding:40px 48px;">

      <!-- Summary stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:36px;">
        ${[
          { label: "Total Earnings", value: fmt(totalEarnings), color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Total Sales",    value: totalSales,          color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" },
          { label: "Avg. Order",     value: fmt(avgOrder),       color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
        ].map(s => `
          <div style="background:${s.bg};border:1px solid ${s.border};border-radius:12px;padding:18px 20px;">
            <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:6px;font-weight:600;">${s.label}</div>
            <div style="font-size:22px;font-weight:800;color:${s.color};">${s.value}</div>
          </div>
        `).join("")}
      </div>

      <!-- Earnings by course -->
      <div style="margin-bottom:36px;">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
          📊 Earnings by Course
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#1e293b;color:#fff;">
              <th style="padding:11px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;border-radius:8px 0 0 8px;">#</th>
              <th style="padding:11px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Course</th>
              <th style="padding:11px 16px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Sales</th>
              <th style="padding:11px 16px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Price</th>
              <th style="padding:11px 16px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;border-radius:0 8px 8px 0;">Earned</th>
            </tr>
          </thead>
          <tbody>${courseRows}</tbody>
          <tfoot>
            <tr style="background:#f8fafc;border-top:2px solid #e2e8f0;">
              <td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:700;color:#1e293b;">Total</td>
              <td style="padding:12px 16px;text-align:center;font-size:12px;font-weight:700;color:#1e293b;">${totalSales}</td>
              <td></td>
              <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:800;color:#16a34a;">${fmt(totalEarnings)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Recent transactions -->
      <div style="margin-bottom:36px;">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:12px;">
          🧾 Recent Transactions ${payments.length > 20 ? `(showing 20 of ${payments.length})` : ''}
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#334155;color:#fff;">
              <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;border-radius:8px 0 0 8px;">Txn ID</th>
              <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Student</th>
              <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Course</th>
              <th style="padding:10px 16px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Date</th>
              <th style="padding:10px 16px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;border-radius:0 8px 8px 0;">Amount</th>
            </tr>
          </thead>
          <tbody>${txnRows}</tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:12px;font-weight:700;color:#4f46e5;">Learnify</div>
          <div style="font-size:10px;color:#94a3b8;margin-top:2px;">learnify.com · support@learnify.com</div>
        </div>
        <div style="font-size:10px;color:#94a3b8;text-align:right;">
          <div>Confidential — For educator use only.</div>
          <div>Computer generated report · ${reportDate}</div>
        </div>
      </div>

    </div>
  </div>`;
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xl font-black text-slate-800">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const EducatorEarningsPage = () => {
  const { user }              = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEducatorEarnings();
        setData(res);
      } catch {
        setError("Failed to load earnings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading earnings…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  const { totalEarnings, totalSales, payments, earningsByCourse } = data;
  const avgOrder = totalSales > 0 ? totalEarnings / totalSales : 0;
  const educatorName = user?.name || "Educator";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Earnings</h1>
          <p className="text-slate-400 text-sm mt-1">Track your revenue and student purchases.</p>
        </div>
        <button
          onClick={() => printHTML(buildReportHTML(data, educatorName), "Earnings Report — Learnify")}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
        >
          <Download size={15} /> Download Report
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={DollarSign}  label="Total Earnings"   value={fmt(totalEarnings)} color="bg-emerald-500" />
        <StatCard icon={ShoppingBag} label="Total Sales"      value={totalSales}          color="bg-indigo-500" />
        <StatCard icon={TrendingUp}  label="Avg. Order Value" value={fmt(avgOrder)}       color="bg-violet-500" />
      </div>

      {/* ── Earnings by Course ── */}
      {earningsByCourse.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" /> Earnings by Course
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {earningsByCourse.map((c) => (
              <div key={c.courseId} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {c.thumbnail?.url
                    ? <img src={c.thumbnail.url} alt={c.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">📘</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 capitalize">{c.category}</p>
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-sm font-bold text-slate-700">{c.sales}</p>
                  <p className="text-xs text-slate-400">Sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">{fmt(c.earnings)}</p>
                  <p className="text-xs text-slate-400">Earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Payments ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag size={16} className="text-indigo-500" /> Recent Purchases
          </h2>
          <span className="text-xs text-slate-400">{payments.length} total</span>
        </div>

        {payments.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3">💸</p>
            <p className="font-bold text-slate-700">No purchases yet</p>
            <p className="text-sm text-slate-400 mt-1">Sales will appear here once students buy your courses.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <span>Student</span><span>Course</span><span>Amount</span><span>Method</span><span>Date</span><span>Invoice</span>
            </div>
            <div className="divide-y divide-slate-100">
              {payments.map((p) => (
                <div key={p._id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{p.studentId?.name || "—"}</p>
                      <p className="text-xs text-slate-400 truncate">{p.studentId?.email || "—"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{p.courseId?.title || "—"}</p>
                  <p className="text-sm font-bold text-emerald-600">{fmt(p.amount)}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize w-fit">
                    {p.paymentMethod}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar size={11} /> {fmtDate(p.paidAt || p.createdAt)}
                  </div>
                  <button
                    onClick={() => printHTML(buildInvoiceHTML(p, educatorName), `Invoice ${p.transactionId}`)}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 hover:border-indigo-400 px-2.5 py-1.5 rounded-lg transition w-fit"
                  >
                    <Download size={12} /> Invoice
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default EducatorEarningsPage;