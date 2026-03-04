import LoginForm from "../../components/common/LoginForm";
import Footer from "@/components/common/Footer";
import { GraduationCap } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">

        {/* Left – Decorative Panel */}
        <div className="hidden lg:flex flex-col justify-between bg-indigo-600 p-12 relative overflow-hidden">
          {/* Blobs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500 rounded-full opacity-40" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-800 rounded-full opacity-30" />

          {/* Top branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-14">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Learnify</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-snug">
              Learn at your<br />own pace.
            </h2>
            <p className="text-indigo-200 mt-4 text-sm leading-relaxed max-w-xs">
              Access 500+ courses, track your progress, and earn certificates recognized by top companies.
            </p>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Courses" },
              { value: "50k+", label: "Students" },
              { value: "4.9★", label: "Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-indigo-200 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Form Panel */}
        <div className="flex items-center justify-center px-6 py-12 bg-white">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;