import { useState, useEffect } from "react";
import {
  X, CreditCard, Smartphone, Lock, CheckCircle2,
  Loader2, ShieldCheck, BookOpen, Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { createPayment } from "../../services/payment.service";
import { enrollInCourse } from "../../services/enrollment.service";

// ─── Constants ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCardNumber = (value) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── Invoice builder ──────────────────────────────────────────────────────────

const buildInvoiceHTML = ({ course, transactionId, paymentMethod, amount, date }) => {
  const invoiceNo  = `INV-${transactionId}`;
  const isFree     = amount === 0;
  const amountStr  = isFree ? "Free" : fmtCurrency(amount);
  const instructor = course?.educatorId?.name || "Learnify Instructor";

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
          <div style="font-size:12px;opacity:0.75;margin-top:4px;">${invoiceNo}</div>
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
          <div style="font-size:13px;font-weight:600;">${date}</div>
          <div style="margin-top:8px;">
            <span style="background:rgba(255,255,255,0.2);border-radius:999px;padding:3px 14px;font-size:11px;font-weight:700;">✓ PAID</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:40px 48px;">

      <!-- Info boxes -->
      <div style="display:flex;gap:16px;margin-bottom:36px;">
        <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;margin-bottom:10px;font-weight:600;">Transaction Info</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
            <span style="font-size:11px;color:#64748b;">Transaction ID</span>
            <span style="font-size:11px;font-weight:700;color:#1e293b;font-family:monospace;">${transactionId}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:7px;">
            <span style="font-size:11px;color:#64748b;">Payment Method</span>
            <span style="font-size:11px;font-weight:600;color:#1e293b;text-transform:capitalize;">${isFree ? "Free" : paymentMethod}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:11px;color:#64748b;">Status</span>
            <span style="font-size:11px;font-weight:700;color:#16a34a;">success</span>
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
            <td style="padding:16px;text-align:right;font-size:13px;font-weight:700;color:#1e293b;">${amountStr}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:36px;">
        <div style="width:240px;">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:12px;color:#64748b;">Subtotal</span>
            <span style="font-size:12px;font-weight:600;color:#1e293b;">${amountStr}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f1f5f9;">
            <span style="font-size:12px;color:#64748b;">Tax (0%)</span>
            <span style="font-size:12px;font-weight:600;color:#1e293b;">—</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:12px 16px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:10px;margin-top:8px;">
            <span style="font-size:13px;font-weight:700;color:#fff;">Total Paid</span>
            <span style="font-size:15px;font-weight:800;color:#fff;">${amountStr}</span>
          </div>
        </div>
      </div>

      <!-- Confirmation -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:36px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">✅</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:#15803d;">Payment Confirmed</div>
          <div style="font-size:11px;color:#16a34a;margin-top:2px;">
            Your payment was successfully processed on ${date}. You have lifetime access to this course.
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
          <div>No signature required · ${invoiceNo}</div>
        </div>
      </div>

    </div>
  </div>`;
};

const downloadInvoice = ({ course, transactionId, paymentMethod, amount, date }) => {
  const html = buildInvoiceHTML({ course, transactionId, paymentMethod, amount, date });
  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <title>Receipt ${transactionId}</title>
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

// ─── Success Screen ───────────────────────────────────────────────────────────

const SuccessScreen = ({ course, paymentMeta, onClose }) => (
  <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
      <CheckCircle2 size={32} className="text-emerald-500" />
    </div>
    <h3 className="text-lg font-black text-slate-800 mb-1">Enrollment Successful!</h3>
    <p className="text-sm text-slate-500 mb-1">You are now enrolled in</p>
    <p className="text-sm font-bold text-indigo-600 mb-2 line-clamp-2 px-4">{course.title}</p>
    <p className="text-xs text-slate-400 mb-6">Head over to My Courses to start learning.</p>

    <div className="flex items-center gap-3 w-full">
      {/* Download invoice */}
      <button
        onClick={() => downloadInvoice({ course, ...paymentMeta })}
        className="flex-1 flex items-center justify-center gap-2 border border-indigo-200 hover:border-indigo-400 text-indigo-600 hover:bg-indigo-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition duration-200 active:scale-[0.98]"
      >
        <Download size={14} /> Download Receipt
      </button>

      {/* Done */}
      <button
        onClick={onClose}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
      >
        Done
      </button>
    </div>
  </div>
);

// ─── Card Form ────────────────────────────────────────────────────────────────

const CardForm = ({ onSubmit, loading, price }) => {
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({
      ...prev,
      [name]:
        name === "number" ? formatCardNumber(value)
        : name === "expiry" ? formatExpiry(value)
        : name === "cvv" ? value.replace(/\D/g, "").slice(0, 3)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!card.name.trim())                          return toast.error("Enter cardholder name.");
    if (card.number.replace(/\s/g, "").length < 16) return toast.error("Enter a valid 16-digit card number.");
    if (card.expiry.length < 5)                     return toast.error("Enter a valid expiry date.");
    if (card.cvv.length < 3)                        return toast.error("Enter a valid CVV.");
    onSubmit("card");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Cardholder Name</label>
        <input type="text" name="name" value={card.name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Card Number</label>
        <div className="relative">
          <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" name="number" value={card.number} onChange={handleChange} placeholder="1234 5678 9012 3456" className={inputClass + " pl-9 tracking-widest"} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Expiry Date</label>
          <input type="text" name="expiry" value={card.expiry} onChange={handleChange} placeholder="MM/YY" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>CVV</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="password" name="cvv" value={card.cvv} onChange={handleChange} placeholder="•••" className={inputClass + " pl-9"} />
          </div>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200 mt-2">
        {loading ? <><Loader2 size={15} className="animate-spin" />Processing...</> : <><Lock size={14} />Pay {price === 0 ? "Free" : `$${price}`}</>}
      </button>
    </form>
  );
};

// ─── UPI Form ─────────────────────────────────────────────────────────────────

const UPIForm = ({ onSubmit, loading, price }) => {
  const [upiId, setUpiId] = useState("");
  const isValidUPI = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidUPI) return toast.error("Enter a valid UPI ID (e.g. name@upi).");
    onSubmit("upi");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-indigo-50 rounded-xl p-4 flex flex-col items-center gap-2 border border-indigo-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Smartphone size={18} className="text-white" />
        </div>
        <p className="text-xs text-slate-500 text-center">Enter your UPI ID to complete the payment</p>
      </div>
      <div>
        <label className={labelClass}>UPI ID</label>
        <div className="relative">
          <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" className={inputClass + " pl-9"} />
        </div>
        <p className="text-xs text-slate-400 mt-1">Supported: @okaxis, @okicici, @ybl, @paytm, and more</p>
      </div>
      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200 mt-2">
        {loading ? <><Loader2 size={15} className="animate-spin" />Processing...</> : <><Lock size={14} />Pay {price === 0 ? "Free" : `$${price}`}</>}
      </button>
    </form>
  );
};

// ─── PaymentModal ─────────────────────────────────────────────────────────────

const PaymentModal = ({ isOpen, onClose, course, onEnrolled }) => {
  const [tab, setTab]               = useState("card");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [paymentMeta, setPaymentMeta] = useState(null); // store txn data for invoice

  useEffect(() => {
    if (isOpen) { setTab("card"); setSuccess(false); setLoading(false); setPaymentMeta(null); }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && !loading) onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !course) return null;

  // ── Payment + Enrollment flow ─────────────────────────────────────────────

  const handlePay = async (method) => {
    try {
      setLoading(true);
      let txnId = `TXN_FREE_${Date.now()}`;

      if (course.price > 0) {
        const payRes = await createPayment(course._id);
        txnId = payRes?.payment?.transactionId || `TXN_${Date.now()}`;
      }

      await enrollInCourse(course._id);

      // Store meta for invoice
      setPaymentMeta({
        transactionId: txnId,
        paymentMethod: method,
        amount:        course.price,
        date:          fmtDate(new Date()),
      });

      setSuccess(true);
      if (onEnrolled) onEnrolled(course._id);

    } catch (err) {
      const message = err?.response?.data?.message || "Payment failed. Please try again.";

      if (message === "Course already purchased") {
        try {
          await enrollInCourse(course._id);
          setPaymentMeta({ transactionId: `TXN_${Date.now()}`, paymentMethod: method, amount: course.price, date: fmtDate(new Date()) });
          setSuccess(true);
          if (onEnrolled) onEnrolled(course._id);
        } catch (enrollErr) {
          const enrollMsg = enrollErr?.response?.data?.message;
          if (enrollMsg === "Already enrolled") {
            setPaymentMeta({ transactionId: `TXN_${Date.now()}`, paymentMethod: method, amount: course.price, date: fmtDate(new Date()) });
            setSuccess(true);
            if (onEnrolled) onEnrolled(course._id);
          } else {
            toast.error(enrollMsg || "Enrollment failed. Please try again.");
          }
        }
      } else if (message === "Already enrolled") {
        setPaymentMeta({ transactionId: `TXN_${Date.now()}`, paymentMethod: method, amount: course.price, date: fmtDate(new Date()) });
        setSuccess(true);
        if (onEnrolled) onEnrolled(course._id);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md">

        {!success && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ShieldCheck size={15} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Secure Checkout</h2>
                <p className="text-xs text-slate-400">Learnify Payment Gateway</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={loading} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-40">
              <X size={16} />
            </button>
          </div>
        )}

        {success ? (
          <SuccessScreen course={course} paymentMeta={paymentMeta} onClose={onClose} />
        ) : (
          <div className="p-6 space-y-5">

            {/* Course summary */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
              {course.thumbnail?.url ? (
                <img src={course.thumbnail.url} alt={course.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-indigo-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{course.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">by {course.educatorId?.name || "Instructor"}</p>
              </div>
              <div className="flex-shrink-0">
                {course.price === 0 ? (
                  <span className="bg-emerald-100 text-emerald-700 text-sm font-black px-3 py-1 rounded-full">Free</span>
                ) : (
                  <span className="bg-indigo-100 text-indigo-700 text-sm font-black px-3 py-1 rounded-full">${course.price}</span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
              <button type="button" onClick={() => setTab("card")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition duration-200 ${tab === "card" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <CreditCard size={13} /> Card
              </button>
              <button type="button" onClick={() => setTab("upi")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition duration-200 ${tab === "upi" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <Smartphone size={13} /> UPI
              </button>
            </div>

            {tab === "card"
              ? <CardForm onSubmit={handlePay} loading={loading} price={course.price} />
              : <UPIForm  onSubmit={handlePay} loading={loading} price={course.price} />
            }

            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Lock size={11} className="text-slate-400" />
              <p className="text-xs text-slate-400">256-bit SSL encrypted. Your data is safe.</p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;