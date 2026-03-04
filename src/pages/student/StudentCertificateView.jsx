import { useLocation, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Download, Award, CheckCircle } from "lucide-react";
import QRCode from "react-qr-code";
import { useRef } from "react";

const StudentCertificateView = () => {
  const { user }   = useAuth();
  const { state }  = useLocation();
  const { courseId } = useParams();
  const printRef   = useRef(null);

  const course = state?.course;

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const verifyUrl = `${window.location.origin}/verify/${courseId}`;

  // ── Print to PDF ──────────────────────────────────────────────────────────
  const handleDownload = () => {
    const certHTML = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank", "width=1000,height=700");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${course?.title || "Certificate"} — Certificate</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');

            * { margin: 0; padding: 0; box-sizing: border-box; }

            html, body {
              width: 297mm;
              height: 210mm;
              background: #fff;
            }

            @page {
              size: A4 landscape;
              margin: 0;
            }

            @media print {
              html, body { width: 297mm; height: 210mm; }
            }

            body {
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Inter', sans-serif;
            }

            .cert {
              width: 297mm;
              height: 210mm;
              background: #ffffff;
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 32px 64px;
              overflow: hidden;
            }

            /* Outer decorative border */
            .cert::before {
              content: '';
              position: absolute;
              inset: 12px;
              border: 2px solid #4f46e5;
              border-radius: 4px;
              pointer-events: none;
              z-index: 0;
            }
            .cert::after {
              content: '';
              position: absolute;
              inset: 18px;
              border: 0.5px solid #c7d2fe;
              border-radius: 2px;
              pointer-events: none;
              z-index: 0;
            }

            /* Corner ornaments */
            .corner {
              position: absolute;
              width: 48px;
              height: 48px;
              z-index: 1;
            }
            .corner svg { width: 100%; height: 100%; }
            .tl { top: 8px;    left: 8px; }
            .tr { top: 8px;    right: 8px;    transform: scaleX(-1); }
            .bl { bottom: 8px; left: 8px;     transform: scaleY(-1); }
            .br { bottom: 8px; right: 8px;    transform: scale(-1); }

            /* Top accent */
            .top-bar {
              position: absolute;
              top: 0; left: 0; right: 0;
              height: 6px;
              background: linear-gradient(90deg, #6366f1, #8b5cf6, #4f46e5);
            }
            .bottom-bar {
              position: absolute;
              bottom: 0; left: 0; right: 0;
              height: 6px;
              background: linear-gradient(90deg, #4f46e5, #8b5cf6, #6366f1);
            }

            /* Content */
            .content {
              position: relative;
              z-index: 2;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              width: 100%;
            }

            .org-name {
              font-family: 'Playfair Display', serif;
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.3em;
              text-transform: uppercase;
              color: #6366f1;
              margin-bottom: 4px;
            }

            .cert-type {
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.25em;
              text-transform: uppercase;
              color: #94a3b8;
              margin-bottom: 12px;
            }

            .divider {
              width: 80px;
              height: 1.5px;
              background: linear-gradient(90deg, transparent, #6366f1, transparent);
              margin: 0 auto 14px;
            }

            .certifies-text {
              font-size: 11px;
              color: #94a3b8;
              margin-bottom: 6px;
              font-style: italic;
            }

            .student-name {
              font-family: 'Playfair Display', serif;
              font-size: 44px;
              font-weight: 900;
              color: #1e293b;
              letter-spacing: -1px;
              line-height: 1.1;
              margin-bottom: 10px;
            }

            .completed-text {
              font-size: 11px;
              color: #64748b;
              margin-bottom: 10px;
            }

            .course-title {
              font-family: 'Playfair Display', serif;
              font-size: 22px;
              font-weight: 700;
              color: #4338ca;
              margin-bottom: 4px;
              max-width: 480px;
            }

            .course-meta {
              font-size: 10px;
              color: #94a3b8;
              text-transform: capitalize;
              letter-spacing: 0.05em;
              margin-bottom: 18px;
            }

            .divider2 {
              width: 100%;
              max-width: 480px;
              height: 1px;
              background: #e2e8f0;
              margin-bottom: 18px;
            }

            /* Footer row */
            .footer-row {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              width: 100%;
              max-width: 560px;
            }

            .sig-block { text-align: center; }
            .sig-line {
              width: 120px;
              height: 1px;
              background: #334155;
              margin: 0 auto 4px;
            }
            .sig-label {
              font-size: 9px;
              color: #94a3b8;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            .sig-name {
              font-size: 11px;
              font-weight: 600;
              color: #334155;
            }

            .date-block { text-align: center; }
            .date-label {
              font-size: 9px;
              color: #94a3b8;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .date-value {
              font-size: 11px;
              font-weight: 600;
              color: #334155;
            }

            .badge {
              display: flex;
              align-items: center;
              gap: 5px;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 999px;
              padding: 4px 10px;
              font-size: 10px;
              font-weight: 600;
              color: #15803d;
            }
            .badge-dot {
              width: 6px; height: 6px;
              border-radius: 50%;
              background: #22c55e;
              display: inline-block;
            }

            .qr-block {
              position: absolute;
              bottom: 28px;
              right: 36px;
              z-index: 2;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 3px;
            }
            .qr-label {
              font-size: 7px;
              color: #94a3b8;
              letter-spacing: 0.1em;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          ${certHTML}
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ── No data guard ─────────────────────────────────────────────────────────
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-500 text-sm">Certificate data not found.</p>
        <Link to="/student/certificates" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Certificates
        </Link>
      </div>
    );
  }

  // Corner SVG ornament
  const CornerSVG = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 44 L4 4 L44 4" stroke="#6366f1" strokeWidth="2" fill="none"/>
      <path d="M8 40 L8 8 L40 8" stroke="#c7d2fe" strokeWidth="0.8" fill="none"/>
      <circle cx="4" cy="4" r="3" fill="#6366f1"/>
      <circle cx="14" cy="4" r="1.5" fill="#c7d2fe"/>
      <circle cx="4" cy="14" r="1.5" fill="#c7d2fe"/>
    </svg>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <Link to="/student/certificates" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium transition">
          <ArrowLeft size={15} /> Back to Certificates
        </Link>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
        >
          <Download size={15} /> Download PDF
        </button>
      </div>

      {/* ── Certificate preview ── */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
        {/* The ref captures only this div for printing */}
        <div ref={printRef}>
          <div className="cert" style={{
            width: "100%", minHeight: 480, background: "#fff",
            position: "relative", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "40px 80px", fontFamily: "'Inter', sans-serif",
          }}>
            {/* Bars */}
            <div className="top-bar" style={{ position:"absolute", top:0, left:0, right:0, height:6, background:"linear-gradient(90deg,#6366f1,#8b5cf6,#4f46e5)" }} />
            <div className="bottom-bar" style={{ position:"absolute", bottom:0, left:0, right:0, height:6, background:"linear-gradient(90deg,#4f46e5,#8b5cf6,#6366f1)" }} />

            {/* Decorative borders */}
            <div style={{ position:"absolute", inset:12, border:"2px solid #4f46e5", borderRadius:4, pointerEvents:"none" }} />
            <div style={{ position:"absolute", inset:18, border:"0.5px solid #c7d2fe", borderRadius:2, pointerEvents:"none" }} />

            {/* Corners */}
            {[["tl","top:8px;left:8px"],["tr","top:8px;right:8px;transform:scaleX(-1)"],["bl","bottom:8px;left:8px;transform:scaleY(-1)"],["br","bottom:8px;right:8px;transform:scale(-1)"]].map(([cls, sty]) => (
              <div key={cls} className={`corner ${cls}`} style={{ position:"absolute", width:48, height:48, zIndex:1, ...Object.fromEntries(sty.split(";").filter(Boolean).map(s => { const [k,...v]=s.split(":"); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.join(":").trim()]; })) }}>
                <CornerSVG />
              </div>
            ))}

            {/* Content */}
            <div className="content" style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", width:"100%" }}>

              <p className="org-name" style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:"#6366f1", marginBottom:4 }}>
                Learnify
              </p>
              <p className="cert-type" style={{ fontSize:10, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:"#94a3b8", marginBottom:12 }}>
                Certificate of Completion
              </p>
              <div className="divider" style={{ width:80, height:1.5, background:"linear-gradient(90deg,transparent,#6366f1,transparent)", marginBottom:14 }} />

              <p className="certifies-text" style={{ fontSize:11, color:"#94a3b8", marginBottom:6, fontStyle:"italic" }}>
                This is to certify that
              </p>
              <h1 className="student-name" style={{ fontFamily:"Georgia,serif", fontSize:48, fontWeight:900, color:"#1e293b", letterSpacing:"-1px", lineHeight:1.1, marginBottom:10 }}>
                {user?.name || "Student"}
              </h1>
              <p className="completed-text" style={{ fontSize:11, color:"#64748b", marginBottom:10 }}>
                has successfully completed the course
              </p>
              <h2 className="course-title" style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:"#4338ca", marginBottom:4, maxWidth:480 }}>
                {course.title}
              </h2>
              <p className="course-meta" style={{ fontSize:10, color:"#94a3b8", textTransform:"capitalize", letterSpacing:"0.05em", marginBottom:20 }}>
                {course.category}&nbsp;·&nbsp;{course.level}
              </p>

              <div className="divider2" style={{ width:"100%", maxWidth:480, height:1, background:"#e2e8f0", marginBottom:20 }} />

              {/* Footer row */}
              <div className="footer-row" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", width:"100%", maxWidth:560 }}>

                {/* Issued date */}
                <div className="date-block" style={{ textAlign:"center" }}>
                  <p className="date-label" style={{ fontSize:9, color:"#94a3b8", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>Date Issued</p>
                  <div className="sig-line" style={{ width:120, height:1, background:"#334155", margin:"0 auto 4px" }} />
                  <p className="date-value" style={{ fontSize:11, fontWeight:600, color:"#334155" }}>{completionDate}</p>
                </div>

                {/* Badge */}
                <div className="badge" style={{ display:"flex", alignItems:"center", gap:5, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:999, padding:"6px 14px", fontSize:10, fontWeight:600, color:"#15803d" }}>
                  <span className="badge-dot" style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
                  100% Completed
                </div>

                {/* Signature */}
                <div className="sig-block" style={{ textAlign:"center" }}>
                  <p className="sig-name" style={{ fontSize:13, fontWeight:700, color:"#334155", fontFamily:"Georgia,serif", fontStyle:"italic", marginBottom:4 }}>Learnify</p>
                  <div className="sig-line" style={{ width:120, height:1, background:"#334155", margin:"0 auto 4px" }} />
                  <p className="sig-label" style={{ fontSize:9, color:"#94a3b8", letterSpacing:"0.08em", textTransform:"uppercase" }}>Authorized Signature</p>
                </div>

              </div>
            </div>

            {/* QR Code */}
            <div className="qr-block" style={{ position:"absolute", bottom:28, right:36, zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <QRCode value={verifyUrl} size={64} fgColor="#1e293b" bgColor="#ffffff" />
              <p className="qr-label" style={{ fontSize:7, color:"#94a3b8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Scan to verify</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentCertificateView;