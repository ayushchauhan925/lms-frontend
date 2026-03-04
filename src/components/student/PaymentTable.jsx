import { Download, BookOpen, CheckCircle2, Clock, RefreshCcw } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── Invoice HTML builder ─────────────────────────────────────────────────────

const buildInvoiceHTML = (payment, invoiceNum) => {
  const course      = payment.courseId;
  const issueDate   = formatDate(payment.paidAt || payment.createdAt);
  const instructor  = course?.educatorId?.name || "Learnify Instructor";
  const isFree      = payment.amount === 0;
  const amount      = isFree ? "Free" : fmtCurrency(payment.amount);

  return `
  <div style="width:210mm;min-height:297mm;padding:0;background:#fff;font-family:'Inter',sans-serif;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px 48px 32px;color:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px;">Learnify</div>
          <div style="font-size:11px;opacity:0.7;margin-top:4px;letter-spacing:0.1em;text-transform:uppercase;">Payment Receipt</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px;font-weight:800;letter-spacing:-1px;">RECEIPT</div>
          <div style="font-size:12px;opacity:0.75;margin-top:4px;">${invoiceNum}</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.2);">
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.6;margin-bottom:4px;">Issued To</div>
          <div style="font-size:14px;font-weight:700;">Student</div>
          <div style="font-size:11px;opacity:0.7;margin-top:2px;">Learnify Platform</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.6;margin-bottom:4px;">Date</div>
          <div style="font-size:13px;font-weight:600;">${issueDate}</div>
          <div style="margin-top:8px;">
            <span style="background:rgba(255,255,255,0.2);border-radius:999px;padding:3px 14px;font-size:11px;font-weight:700;">
              ${payment.paymentStatus === "success" ? "✓ PAID" : payment.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:40px 48px;">

      <!-- Transaction info boxes -->
      <div style="display:flex;gap:16px;margin-bottom:36px;">
        <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:10px;font-weight:600;">Transaction Info</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
            <span style="font-size:11px;color:#64748b;">Transaction ID</span>
            <span style="font-size:11px;font-weight:700;color:#1e293b;font-family:monospace;">${payment.transactionId}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
            <span style="font-size:11px;color:#64748b;">Payment Method</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;text-transform:capitalize;">${isFree ? "Free" : payment.paymentMethod}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:11px;color:#64748b;">Status</span>
            <span style="font-size:11px;font-weight:700;color:${payment.paymentStatus === "success" ? "#16a34a" : "#d97706"};">${payment.paymentStatus}</span>
          </div>
        </div>
        <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:10px;font-weight:600;">Course Info</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
            <span style="font-size:11px;color:#64748b;">Category</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;text-transform:capitalize;">${course?.category || "—"}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
            <span style="font-size:11px;color:#64748b;">Instructor</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;">${instructor}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:11px;color:#64748b;">Access</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;">Lifetime</span>
          </div>
        </div>
      </div>

      <!-- Line items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#1e293b;color:#fff;">
            <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;border-radius:8px 0 0 8px;">#</th>
            <th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Description</th>
            <th style="padding:12px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Qty</th>
            <th style="padding:12px 16px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;border-radius:0 8px 8px 0;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:16px;font-size:12px;color:#64748b;">01</td>
            <td style="padding:16px;">
              <div style="font-size:13px;font-weight:700;color:#1e293b;">${course?.title || "Course"}</div>
              <div style="font-size:11px;color:#64748b;margin-top:3px;">Online Course · Lifetime Access · by ${instructor}</div>
            </td>
            <td style="padding:16px;text-align:center;font-size:13px;color:#1e293b;">1</td>
            <td style="padding:16px;text-align:right;font-size:13px;font-weight:700;color:#1e293b;">${amount}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:36px;">
        <div style="width:240px;">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:12px;color:#64748b;">Subtotal</span>
            <span style="font-size:12px;font-weight:600;color:#1e293b;">${amount}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:12px;color:#64748b;">Tax (0%)</span>
            <span style="font-size:12px;font-weight:600;color:#1e293b;">—</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:12px 16px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:10px;margin-top:8px;">
            <span style="font-size:13px;font-weight:700;color:#fff;">Total Paid</span>
            <span style="font-size:15px;font-weight:800;color:#fff;">${amount}</span>
          </div>
        </div>
      </div>

      <!-- Confirmation notice -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:36px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">✅</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:#15803d;">Payment Confirmed</div>
          <div style="font-size:11px;color:#16a34a;margin-top:2px;">
            Your payment was successfully processed on ${issueDate}. You have lifetime access to this course.
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:13px;font-weight:800;color:#4f46e5;">Learnify</div>
          <div style="font-size:10px;color:#94a3b8;margin-top:2px;">learnify.com · support@learnify.com</div>
        </div>
        <div style="font-size:10px;color:#94a3b8;text-align:right;">
          <div>This is a computer-generated receipt.</div>
          <div>No signature required · ${invoiceNum}</div>
        </div>
      </div>

    </div>
  </div>`;
};

// ─── Print to PDF ─────────────────────────────────────────────────────────────

const downloadInvoice = (payment, invoiceNum) => {
  const html = buildInvoiceHTML(payment, invoiceNum);
  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <title>Receipt ${invoiceNum}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Inter',sans-serif;background:#fff;}
      @page{size:A4 portrait;margin:0;}
      @media print{html,body{width:210mm;min-height:297mm;}}
    </style>
  </head><body>${html}
    <script>window.onload=()=>{window.print();window.close();}<\/script>
  </body></html>`);
  w.document.close();
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
      <Icon size={11} /> {label}
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

const PaymentTable = ({ payments = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">

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
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-100">
                          {course?.thumbnail?.url ? (
                            <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-contain p-1" />
                          ) : (
                            <BookOpen size={16} className="text-indigo-300" />
                          )}
                        </div>
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
                      {isFree ? <span>🎁 Free</span> : payment.paymentMethod || "—"}
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
                        onClick={() => downloadInvoice(payment, invoiceNum)}
                        title="Download Receipt"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
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