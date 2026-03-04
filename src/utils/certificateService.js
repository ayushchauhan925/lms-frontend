/**
 * certificateService.js
 * Utility for downloading student certificates.
 * TODO: Replace mock with actual PDF generation (e.g. jsPDF, html2canvas,
 *       or a backend PDF endpoint).
 */

/**
 * Download certificate for a completed course.
 * @param {Object} params
 * @param {string} params.certificateNumber - Unique certificate ID (e.g. CERT-ABC123)
 * @param {string} params.studentName       - Full name of the student
 * @param {string} params.courseTitle       - Title of the completed course
 * @param {string} params.completionDate    - Formatted date string
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const downloadCertificate = async ({
  certificateNumber,
  studentName,
  courseTitle,
  completionDate,
}) => {
  try {
    // Simulate async operation (API call / PDF generation delay)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // ── TODO: Replace with real implementation ─────────────────────────────
    // Option A – Backend PDF endpoint:
    //   const res = await api.get(
    //     `/certificates/download/${certificateNumber}`,
    //     { responseType: "blob" }
    //   );
    //   const url = window.URL.createObjectURL(new Blob([res.data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", `certificate-${certificateNumber}.pdf`);
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    //
    // Option B – Client-side with jsPDF:
    //   import jsPDF from "jspdf";
    //   const doc = new jsPDF();
    //   doc.text(`Certificate of Completion`, 10, 10);
    //   doc.text(`Awarded to: ${studentName}`, 10, 30);
    //   doc.text(`Course: ${courseTitle}`, 10, 50);
    //   doc.save(`${certificateNumber}.pdf`);
    // ──────────────────────────────────────────────────────────────────────

    console.log("Certificate download triggered:", {
      certificateNumber,
      studentName,
      courseTitle,
      completionDate,
    });

    return { success: true, message: "Download successful" };
  } catch (error) {
    console.error("Certificate download failed:", error);
    return {
      success: false,
      message: error?.message || "Download failed. Please try again.",
    };
  }
};