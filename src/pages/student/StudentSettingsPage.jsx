import { useState } from "react";
import {
  Bell, Lock, Shield, Globe, Moon, Sun, Smartphone,
  Mail, MessageSquare, Award, BookOpen, ChevronRight,
  Trash2, LogOut, Eye, EyeOff, Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SectionCard = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-indigo-600" />
      </div>
      <div>
        <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-indigo-600" : "bg-slate-200"}`}
    style={{ height: 22, width: 40 }}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-[18px]" : "translate-x-0"}`}
      style={{ width: 18, height: 18 }}
    />
  </button>
);

const ToggleRow = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <Toggle enabled={enabled} onChange={onChange} />
  </div>
);

const DangerRow = ({ icon: Icon, label, description, btnLabel, btnClass, onClick }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-rose-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
    </div>
    <button onClick={onClick} className={`text-xs font-semibold px-4 py-2 rounded-xl transition flex-shrink-0 ${btnClass}`}>
      {btnLabel}
    </button>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentSettingsPage = () => {
  const { logout } = useAuth();

  // ── Notification toggles ─────────────────────────────────────────────────
  const [notif, setNotif] = useState({
    emailEnrollment:  true,
    emailPayments:    true,
    emailCourseUpdate: false,
    pushNewLecture:   true,
    pushAnnouncements: false,
    certificate:      true,
  });

  // ── Appearance ───────────────────────────────────────────────────────────
  const [theme, setTheme]       = useState("light");
  const [language, setLanguage] = useState("en");

  // ── Privacy ──────────────────────────────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    showProgress:  true,
    showCourses:   false,
    twoFactor:     false,
  });

  // ── Password ─────────────────────────────────────────────────────────────
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]   = useState({ current: false, next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  const toggleN = (key) => setNotif((p) => ({ ...p, [key]: !p[key] }));
  const togglePr = (key) => setPrivacy((p) => ({ ...p, [key]: !p[key] }));

  const handlePasswordSave = () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm)
      return toast.error("Please fill in all password fields.");
    if (pwForm.next.length < 6)
      return toast.error("New password must be at least 6 characters.");
    if (pwForm.next !== pwForm.confirm)
      return toast.error("New passwords do not match.");
    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setPwForm({ current: "", next: "", confirm: "" });
      toast.success("Password change saved! (mock)");
    }, 1000);
  };

  const PwInput = ({ field, placeholder }) => (
    <div className="relative">
      <input
        type={showPw[field] ? "text" : "password"}
        value={pwForm[field]}
        onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition"
      />
      <button
        type="button"
        onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {showPw[field] ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences and privacy.</p>
      </div>

      {/* ── Notifications ── */}
      <SectionCard title="Notifications" description="Choose what you want to be notified about." icon={Bell}>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Mail size={11} /> Email
          </p>
          <div className="space-y-4 pl-1">
            <ToggleRow label="Enrollment confirmations"  description="Get an email when you enroll in a course."        enabled={notif.emailEnrollment}   onChange={() => toggleN("emailEnrollment")} />
            <ToggleRow label="Payment receipts"          description="Receive receipts for every successful payment."    enabled={notif.emailPayments}     onChange={() => toggleN("emailPayments")} />
            <ToggleRow label="Course updates"            description="Notify me when an enrolled course adds content."   enabled={notif.emailCourseUpdate} onChange={() => toggleN("emailCourseUpdate")} />
          </div>
        </div>
        <div className="border-t border-slate-100 pt-5 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Smartphone size={11} /> Push
          </p>
          <div className="space-y-4 pl-1">
            <ToggleRow label="New lectures"              description="Alert me when a new lecture is published."         enabled={notif.pushNewLecture}    onChange={() => toggleN("pushNewLecture")} />
            <ToggleRow label="Announcements"             description="Course-wide announcements from instructors."       enabled={notif.pushAnnouncements} onChange={() => toggleN("pushAnnouncements")} />
            <ToggleRow label="Certificate earned"        description="Celebrate when you complete a course."             enabled={notif.certificate}       onChange={() => toggleN("certificate")} />
          </div>
        </div>
        <div className="pt-2">
          <button onClick={() => toast.success("Notification preferences saved! (mock)")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-[0.98]">
            <Check size={13} /> Save Preferences
          </button>
        </div>
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard title="Appearance" description="Personalise how Learnify looks for you." icon={Moon}>
        {/* Theme */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "light", label: "Light",  icon: Sun  },
              { key: "dark",  label: "Dark",   icon: Moon },
              { key: "system",label: "System", icon: Smartphone },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setTheme(key); toast.success(`Theme set to ${label} (mock)`); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                  theme === key ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon size={18} className={theme === key ? "text-indigo-600" : "text-slate-400"} />
                <span className={`text-xs font-semibold ${theme === key ? "text-indigo-700" : "text-slate-500"}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Globe size={11} /> Language
          </p>
          <select
            value={language}
            onChange={(e) => { setLanguage(e.target.value); toast.success("Language updated (mock)"); }}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="ar">🇸🇦 Arabic</option>
          </select>
        </div>
      </SectionCard>

      {/* ── Privacy ── */}
      <SectionCard title="Privacy" description="Control your visibility and account security." icon={Shield}>
        <ToggleRow
          label="Show my learning progress"
          description="Allow others to see your course progress on your profile."
          enabled={privacy.showProgress}
          onChange={() => togglePr("showProgress")}
        />
        <ToggleRow
          label="Show enrolled courses"
          description="Display your course list publicly on your profile."
          enabled={privacy.showCourses}
          onChange={() => togglePr("showCourses")}
        />
        <ToggleRow
          label="Two-factor authentication"
          description="Add an extra layer of security to your account."
          enabled={privacy.twoFactor}
          onChange={() => { togglePr("twoFactor"); toast.success("2FA toggled (mock)"); }}
        />
        <div className="pt-2">
          <button onClick={() => toast.success("Privacy settings saved! (mock)")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-[0.98]">
            <Check size={13} /> Save Preferences
          </button>
        </div>
      </SectionCard>

      {/* ── Password ── */}
      <SectionCard title="Change Password" description="Update your login password." icon={Lock}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Current Password</label>
            <PwInput field="current" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">New Password</label>
            <PwInput field="next" placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Confirm New Password</label>
            <PwInput field="confirm" placeholder="Repeat new password" />
          </div>
        </div>
        <button
          onClick={handlePasswordSave}
          disabled={pwLoading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-[0.98]"
        >
          <Lock size={13} /> {pwLoading ? "Saving…" : "Update Password"}
        </button>
        <p className="text-xs text-slate-400">Password changes require a current valid password. Actual update logic can be wired to the backend later.</p>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-rose-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
            <Shield size={15} className="text-rose-500" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Danger Zone</h2>
            <p className="text-xs text-slate-400 mt-0.5">Irreversible actions — proceed with caution.</p>
          </div>
        </div>
        <div className="p-6 space-y-5 divide-y divide-slate-100">
          <DangerRow
            icon={LogOut}
            label="Sign out of all devices"
            description="Revoke all active sessions except this one."
            btnLabel="Sign Out All"
            btnClass="bg-slate-100 hover:bg-slate-200 text-slate-700"
            onClick={() => toast("Signed out of all devices (mock)", { icon: "🔒" })}
          />
          <div className="pt-5">
            <DangerRow
              icon={Trash2}
              label="Delete account"
              description="Permanently delete your account and all data. This cannot be undone."
              btnLabel="Delete Account"
              btnClass="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
              onClick={() => toast.error("Account deletion (mock — wire to backend)")}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentSettingsPage;