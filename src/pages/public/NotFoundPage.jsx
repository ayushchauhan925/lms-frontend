import { GraduationCap, Home, BookOpen, HelpCircle, ArrowLeft } from "lucide-react";

const quickLinks = [
  { icon: Home,        label: "Go to Homepage",  href: "/"        },
  { icon: BookOpen,    label: "Browse Courses",   href: "/courses" },
  { icon: HelpCircle,  label: "Help Center",      href: "/help"    },
];

const NotFoundPage = () => {
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

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">

          {/* 404 Graphic */}
          <div className="relative inline-block mb-8">
            {/* Blobs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-indigo-100 rounded-full opacity-60 blur-2xl" />
            </div>
            {/* Number */}
            <div className="relative z-10">
              <p className="text-[120px] font-black text-indigo-600 leading-none select-none tracking-tight">
                4
                <span className="inline-block animate-bounce text-indigo-400">0</span>
                4
              </p>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            Oops! Page not found
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved. Don't worry — let's get you back on track.
          </p>

          {/* Primary CTA */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <a
              href="/"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition duration-200 shadow-md shadow-indigo-200"
            >
              <Home size={15} />
              Back to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 font-semibold text-sm px-6 py-2.5 rounded-xl transition duration-200"
            >
              <ArrowLeft size={15} />
              Go Back
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or try one of these</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm rounded-2xl p-4 transition duration-200 group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition">
                  <Icon size={17} className="text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-600 transition text-center">
                  {label}
                </span>
              </a>
            ))}
          </div>

          {/* Support note */}
          <p className="text-xs text-slate-400 mt-8">
            Think this is a mistake?{" "}
            <a href="/contact" className="text-indigo-600 font-medium hover:underline">
              Contact our support team
            </a>
          </p>

        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;