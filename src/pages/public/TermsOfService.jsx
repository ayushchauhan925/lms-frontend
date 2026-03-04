import { GraduationCap } from "lucide-react";
import Footer from "@/components/common/Footer";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Learnify ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all users including students, educators, and visitors.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 13 years of age to use Learnify. If you are under 18, you must have your parent or guardian's consent. By using the platform, you confirm that all information you provide is accurate and complete.`,
  },
  {
    title: "3. User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at support@learnify.com if you suspect any unauthorized use of your account. Learnify reserves the right to terminate accounts that violate these terms.`,
  },
  {
    title: "4. Courses & Content",
    content: `Learnify grants you a limited, non-exclusive, non-transferable license to access and view course content for personal, non-commercial use. You may not download, reproduce, distribute, or resell any content from the platform without explicit written permission from Learnify or the respective content creator.`,
  },
  {
    title: "5. Educator Responsibilities",
    content: `Educators who publish courses on Learnify are solely responsible for the accuracy, quality, and legality of their content. By submitting content, educators grant Learnify a worldwide, royalty-free license to host, display, and distribute that content on the platform. Learnify reserves the right to remove any content that violates our community guidelines or these terms.`,
  },
  {
    title: "6. Payments & Refunds",
    content: `Some courses on Learnify are offered for a fee. All payments are processed securely through our payment partners. Refund requests must be submitted within 7 days of purchase, provided you have not completed more than 20% of the course. Learnify reserves the right to refuse refunds in cases of suspected abuse.`,
  },
  {
    title: "7. Intellectual Property",
    content: `All content on Learnify, including logos, trademarks, text, graphics, and software, is the property of Learnify or its licensors and is protected by applicable intellectual property laws. You may not use, copy, or distribute any of our intellectual property without prior written consent.`,
  },
  {
    title: "8. Prohibited Conduct",
    content: `You agree not to: (a) use the platform for any unlawful purpose; (b) harass, abuse, or harm other users; (c) upload or share content that is offensive, misleading, or infringes on third-party rights; (d) attempt to gain unauthorized access to any part of the platform; or (e) use automated tools to scrape, crawl, or extract data from Learnify.`,
  },
  {
    title: "9. Privacy Policy",
    content: `Your use of Learnify is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. By using the platform, you consent to the collection and use of your data as described in our Privacy Policy.`,
  },
  {
    title: "10. Disclaimers & Limitation of Liability",
    content: `Learnify is provided on an "as is" and "as available" basis without warranties of any kind. We do not guarantee that the platform will be error-free or uninterrupted. To the fullest extent permitted by law, Learnify shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.`,
  },
  {
    title: "11. Changes to Terms",
    content: `Learnify reserves the right to update these Terms of Service at any time. We will notify users of significant changes via email or a prominent notice on the platform. Continued use of Learnify after changes are posted constitutes your acceptance of the revised terms.`,
  },
  {
    title: "12. Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us at support@learnify.com or write to us at: Learnify Inc., 123 Learning Lane, San Francisco, CA 94105, USA.`,
  },
];

const TermsOfServicePage = () => {
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
          <h1 className="text-3xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-indigo-200 text-sm">
            Last updated: <span className="font-medium text-white">March 1, 2026</span>
          </p>
          <p className="text-indigo-200 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using Learnify. By accessing our platform, you agree to be bound by the following terms and conditions.
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
            By using Learnify, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <a
              href="/"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition duration-200"
            >
              Back to Learnify
            </a>
            <a
              href="/signup"
              className="px-5 py-2.5 border border-indigo-300 text-indigo-600 hover:bg-indigo-100 text-sm font-semibold rounded-xl transition duration-200"
            >
              Create Account
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;