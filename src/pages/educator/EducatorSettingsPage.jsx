import { useState } from "react";
import {
  Bell, Lock, Shield, Globe, Moon, Sun, Smartphone,
  Mail, DollarSign, Star, Users, Eye, EyeOff,
  Check, Trash2, LogOut, BookOpen, MessageSquare,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ─── Reusable UI ──────────────────────────────────────────────────────────────

const SectionCard = ({ title, description, icon: Icon, danger = false, children }) => (
  <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border ${danger ? "border-rose-200" : "border-slate-200"}`}>
    <div className={`px-6 py-4 border-b flex items-center gap-3 ${danger ? "border-rose-100" : "border-slate-100"}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${danger ? "bg-rose-50" : "bg-indigo-50"}`}>
        <Icon size={15} className={danger ? "text-rose-500" : "text-indigo-600"} />
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
    className={`relative rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? "bg-indigo-600" : "bg-slate-200"}`}
    style={{ width: 40, height: 22 }}
  >
    <span
      className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-[18px]" : "translate-x-0"}`}
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

const SaveBtn = ({ onClick, label = "Save Preferences", loading = false }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-[0.98]"
  >
    <Check size={13} /> {loading ? "Saving…" : label}
  </button>
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

const EducatorSettingsPage = () => {
  const { logout } = useAuth();

  // ── Notification toggles ─────────────────────────────────────────────────
  const [notif, setNotif] = useState({
    emailNewEnrollment:  true,
    emailPaymentReceived: true,
    emailNewReview:      true,
    emailCourseApproval: false,
    pushNewEnrollment:   true,
    pushNewReview:       false,
    pushPayout:          true,
    pushAnnouncement:    false,
  });

  // ── Appearance ───────────────────────────────────────────────────────────
  const [theme, setTheme]       = useState("light");
  const [language, setLanguage] = useState("en");

  // ── Course defaults ──────────────────────────────────────────────────────
  const [courseDefaults, setCourseDefaults] = useState({
    autoPublish:       false,
    allowReviews:      true,
    allowDiscussions:  true,
    showStudentCount:  true,
  });

  // ── Payout ──────────────────────────────────────────────────────────────
  const [payout, setPayout] = useState({
    method:    "bank",
    threshold: "500",
    currency:  "INR",
  });

  // ── Privacy ──────────────────────────────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    showEarnings:  false,
    showStudents:  true,
    twoFactor:     false,
    publicProfile: true,
  });

  // ── Password ─────────────────────────────────────────────────────────────
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]   = useState({ current: false, next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  const toggleN  = (key) => setNotif((p) => ({ ...p, [key]: !p[key] }));
  const toggleCD = (key) => setCourseDefaults((p) => ({ ...p, [key]: !p[key] }));
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
      toast.success("Password updated! (mock)");
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
        <p className="text-slate-400 text-sm mt-1">Manage your educator account preferences.</p>
      </div>

      {/* ── Notifications ── */}
      <SectionCard title="Notifications" description="Stay informed about your courses and earnings." icon={Bell}>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Mail size={11} /> Email
          </p>
          <div className="space-y-4 pl-1">
            <ToggleRow label="New enrollment"       description="Email me when a student enrolls in my course."      enabled={notif.emailNewEnrollment}   onChange={() => toggleN("emailNewEnrollment")} />
            <ToggleRow label="Payment received"     description="Confirm every successful payment for my courses."   enabled={notif.emailPaymentReceived} onChange={() => toggleN("emailPaymentReceived")} />
            <ToggleRow label="New review posted"    description="Alert me when a student leaves a review."           enabled={notif.emailNewReview}       onChange={() => toggleN("emailNewReview")} />
            <ToggleRow label="Course approval"      description="Notify me about course publish status changes."     enabled={notif.emailCourseApproval}  onChange={() => toggleN("emailCourseApproval")} />
          </div>
        </div>
        <div className="border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Smartphone size={11} /> Push
          </p>
          <div className="space-y-4 pl-1">
            <ToggleRow label="New enrollment"       description="Push alert for every new student."                  enabled={notif.pushNewEnrollment}    onChange={() => toggleN("pushNewEnrollment")} />
            <ToggleRow label="New review"           description="Instant push when a review is submitted."           enabled={notif.pushNewReview}        onChange={() => toggleN("pushNewReview")} />
            <ToggleRow label="Payout processed"     description="Notify me when a payout is sent."                  enabled={notif.pushPayout}           onChange={() => toggleN("pushPayout")} />
            <ToggleRow label="Platform announcements" description="Important updates from Learnify."                enabled={notif.pushAnnouncement}     onChange={() => toggleN("pushAnnouncement")} />
          </div>
        </div>
        <SaveBtn onClick={() => toast.success("Notification preferences saved! (mock)")} />
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard title="Appearance" description="Personalise how Learnify looks for you." icon={Moon}>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "light",  label: "Light",  Icon: Sun         },
              { key: "dark",   label: "Dark",   Icon: Moon        },
              { key: "system", label: "System", Icon: Smartphone  },
            ].map(({ key, label, Icon }) => (
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

      {/* ── Course Defaults ── */}
      <SectionCard title="Course Defaults" description="Default behaviour applied to all new courses you create." icon={BookOpen}>
        <ToggleRow
          label="Auto-publish new courses"
          description="Publish courses immediately after creation without manual approval."
          enabled={courseDefaults.autoPublish}
          onChange={() => toggleCD("autoPublish")}
        />
        <ToggleRow
          label="Allow student reviews"
          description="Let enrolled students leave ratings and written reviews."
          enabled={courseDefaults.allowReviews}
          onChange={() => toggleCD("allowReviews")}
        />
        <ToggleRow
          label="Allow Q&A / discussions"
          description="Enable the discussion section on your course pages."
          enabled={courseDefaults.allowDiscussions}
          onChange={() => toggleCD("allowDiscussions")}
        />
        <ToggleRow
          label="Show student count publicly"
          description="Display total enrolled students on the course listing page."
          enabled={courseDefaults.showStudentCount}
          onChange={() => toggleCD("showStudentCount")}
        />
        <SaveBtn onClick={() => toast.success("Course defaults saved! (mock)")} />
      </SectionCard>

      {/* ── Payout Preferences ── */}
      <SectionCard title="Payout Preferences" description="Configure how and when you receive your earnings." icon={DollarSign}>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Payout Method</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "bank",   label: "Bank Transfer" },
              { key: "upi",    label: "UPI"           },
              { key: "paypal", label: "PayPal"        },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPayout((p) => ({ ...p, method: key }))}
                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition ${
                  payout.method === key ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Minimum Payout</p>
            <select
              value={payout.threshold}
              onChange={(e) => setPayout((p) => ({ ...p, threshold: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="500">₹500</option>
              <option value="1000">₹1,000</option>
              <option value="2500">₹2,500</option>
              <option value="5000">₹5,000</option>
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Currency</p>
            <select
              value={payout.currency}
              onChange={(e) => setPayout((p) => ({ ...p, currency: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="INR">🇮🇳 INR — Indian Rupee</option>
              <option value="USD">🇺🇸 USD — US Dollar</option>
              <option value="EUR">🇪🇺 EUR — Euro</option>
            </select>
          </div>
        </div>
        <SaveBtn onClick={() => toast.success("Payout preferences saved! (mock)")} label="Save Payout Settings" />
      </SectionCard>

      {/* ── Privacy ── */}
      <SectionCard title="Privacy & Security" description="Control your visibility and account security." icon={Shield}>
        <ToggleRow
          label="Show earnings on public profile"
          description="Display total earnings on your educator profile page."
          enabled={privacy.showEarnings}
          onChange={() => togglePr("showEarnings")}
        />
        <ToggleRow
          label="Show student count on profile"
          description="Display how many students you've taught publicly."
          enabled={privacy.showStudents}
          onChange={() => togglePr("showStudents")}
        />
        <ToggleRow
          label="Public educator profile"
          description="Make your profile discoverable to students browsing courses."
          enabled={privacy.publicProfile}
          onChange={() => togglePr("publicProfile")}
        />
        <ToggleRow
          label="Two-factor authentication"
          description="Add an extra layer of security to your account."
          enabled={privacy.twoFactor}
          onChange={() => { togglePr("twoFactor"); toast.success("2FA toggled (mock)"); }}
        />
        <SaveBtn onClick={() => toast.success("Privacy settings saved! (mock)")} />
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
        <p className="text-xs text-slate-400">Actual password update can be wired to the backend later.</p>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard title="Danger Zone" description="Irreversible actions — proceed with caution." icon={Shield} danger>
        <div className="space-y-5 divide-y divide-slate-100">
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
              label="Delete educator account"
              description="Permanently deletes your account, all courses, and student data. Cannot be undone."
              btnLabel="Delete Account"
              btnClass="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
              onClick={() => toast.error("Account deletion (mock — wire to backend)")}
            />
          </div>
        </div>
      </SectionCard>

    </div>
  );
};
 
export default EducatorSettingsPage;