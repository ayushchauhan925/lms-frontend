import SignupForm from "../../components/common/SignupForm";
import Footer from "@/components/common/Footer";
import { GraduationCap } from "lucide-react";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* Left – Decorative Panel */}
        <div className="hidden lg:flex flex-col justify-center gap-10 bg-indigo-600 p-12 relative overflow-hidden">
          {/* Blobs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-40" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-800 rounded-full opacity-30" />

          {/* Top branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Learnify</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-snug">
              Start learning<br />for free today.
            </h2>
            <p className="text-indigo-200 mt-4 text-sm leading-relaxed max-w-xs">
              Join 50,000+ learners. Build real skills, earn certificates, and grow your career with Learnify.
            </p>
          </div>

          {/* Feature list */}
          <div className="relative z-10 flex flex-col gap-3">
            {[
              { icon: "✅", text: "500+ courses across 20+ categories" },
              { icon: "🏆", text: "Certificates recognized by top companies" },
              { icon: "📱", text: "Learn on any device, anytime" },
              { icon: "🔒", text: "Lifetime access to enrolled courses" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                <span className="text-lg">{icon}</span>
                <span className="text-white text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Form Panel */}
        <div className="flex items-center justify-center px-6 py-10 bg-white">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;