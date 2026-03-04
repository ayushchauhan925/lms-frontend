import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, BookOpen } from "lucide-react";

const SignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    profileDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await signup(form);

      toast.success("Account created successfully");

      // 🔥 Role-based redirect
      if (data.user.role === "student") {
        navigate("/student/dashboard");
      } else if (data.user.role === "educator") {
        navigate("/educator/dashboard");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

  return (
    <div className="w-full">
      {/* Everything below is EXACTLY your same UI */}
      {/* No styling changes made */}

      <div className="flex items-center gap-2 mb-7">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">Learnify</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Create your account 🚀
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Join thousands of learners on Learnify
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className={iconClass} />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            I want to join as
          </label>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "student", label: "Student", icon: "🎓", desc: "I want to learn" },
              { value: "educator", label: "Educator", icon: "📖", desc: "I want to teach" },
            ].map(({ value, label, icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-sm font-medium transition duration-200 ${
                  form.role === value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
                <span
                  className={`text-xs font-normal ${
                    form.role === value
                      ? "text-indigo-400"
                      : "text-slate-400"
                  }`}
                >
                  {desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bio
            <span className="text-slate-400 font-normal ml-1">
              (optional)
            </span>
          </label>

          <div className="relative">
            <BookOpen className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <textarea
              placeholder="Tell us a little about yourself..."
              value={form.profileDescription}
              rows={3}
              onChange={(e) =>
                setForm({
                  ...form,
                  profileDescription: e.target.value,
                })
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;