import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(form);

      toast.success("Login successful");

      // Redirect only if student
      if (data.user.role === "student") {
  navigate("/student/dashboard");
} else if (data.user.role === "educator") {
  navigate("/educator/dashboard");
}

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = "relative";
  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4";

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">Learnify</span>
      </div>

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Sign in to continue your learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email address
          </label>
          <div className={inputWrap}>
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>

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

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 accent-indigo-600 rounded"
          />
          <label htmlFor="remember" className="text-sm text-slate-500">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">
            or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-4 h-4"
            alt="Google"
          />
          Sign in with Google
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 mt-7">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Sign up for free
        </a>
      </p>
    </div>
  );
};

export default LoginForm;