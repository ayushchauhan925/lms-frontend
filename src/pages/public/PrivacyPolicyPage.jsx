import { GraduationCap } from "lucide-react";
import Footer from "@/components/common/Footer";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, enroll in courses, or contact support. This includes your name, email address, password, profile description, and role (student or educator). We also collect usage data such as pages visited, courses accessed, time spent on the platform, and device/browser information.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to: (a) create and manage your account; (b) provide access to courses and platform features; (c) send transactional emails such as enrollment confirmations and certificates; (d) send newsletters if you have subscribed; (e) improve our platform through analytics; and (f) respond to your support requests.`,
  },
  {
    title: "3. Cookies & Tracking Technologies",
    content: `Learnify uses cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze platform usage. You can control cookie settings through your browser. Disabling cookies may affect certain features of the platform. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device).`,
  },
  {
    title: "4. How We Share Your Information",
    content: `We do not sell your personal information to third parties. We may share your data with: (a) service providers who assist us in operating the platform (e.g., payment processors, email services); (b) educators whose courses you enroll in, limited to your name and progress; (c) law enforcement or government authorities when required by law. All third-party providers are contractually bound to protect your data.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide our services. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or business purposes such as tax records or dispute resolution.`,
  },
  {
    title: "6. Data Security",
    content: `We implement industry-standard security measures including encryption in transit (TLS/SSL), hashed passwords, and regular security audits to protect your personal data. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password and to notify us immediately at security@learnify.com if you suspect any unauthorized access.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your location, you may have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate data; (c) request deletion of your data; (d) object to or restrict processing of your data; (e) request a copy of your data in a portable format. To exercise any of these rights, please contact us at privacy@learnify.com.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Learnify is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal data, we will take steps to delete that information immediately. If you believe your child has submitted information to us, please contact us at privacy@learnify.com.`,
  },
  {
    title: "9. Third-Party Links",
    content: `Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review the privacy policies of any third-party sites you visit. This Privacy Policy applies solely to information collected by Learnify.`,
  },
  {
    title: "10. International Data Transfers",
    content: `Learnify is based in the United States. If you are accessing our platform from outside the US, your data may be transferred to and processed in the US or other countries. By using Learnify, you consent to the transfer of your data to countries that may have different data protection laws than your country of residence.`,
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and notify you via email or a prominent notice on the platform. We encourage you to review this policy periodically. Your continued use of Learnify after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    title: "12. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Data Privacy team at privacy@learnify.com or write to us at: Learnify Inc., 123 Learning Lane, San Francisco, CA 94105, USA. We will respond to all requests within 30 days.`,
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <a href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">Learnify</span>
        </a>
      </header>

      {/* Hero */}
      <div className="bg-indigo-600 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-30" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-800 rounded-full opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-indigo-200 text-sm">
            Last updated: <span className="font-medium text-white">March 1, 2026</span>
          </p>
          <p className="text-indigo-200 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Your privacy matters to us. This policy explains what data we collect, how we use it, and the choices you have over your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">

        {/* Quick Nav */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-4">
            Table of Contents
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {sections.map((s) => (
              <li key={s.title}>
                <a
                  href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div
              key={s.title}
              id={s.title.replace(/\s+/g, "-").toLowerCase()}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm scroll-mt-6"
            >
              <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
                {s.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Agreement Box */}
        <div className="mt-10 bg-indigo-50 border border-indigo-200 rounded-2xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            By using Learnify, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <a
              href="/"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition duration-200"
            >
              Back to Learnify
            </a>
            <a
              href="/terms"
              className="px-5 py-2.5 border border-indigo-300 text-indigo-600 hover:bg-indigo-100 text-sm font-semibold rounded-xl transition duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;