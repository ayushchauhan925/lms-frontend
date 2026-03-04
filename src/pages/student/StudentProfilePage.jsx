import { useState, useEffect, useRef } from "react";
import { User, Mail, ShieldCheck, Pencil, Save, X, Camera, BookOpen, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../../services/user.service";

// ── Avatar initials fallback ──────────────────────────────────────────────────
const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// ── Field Row (read-only display) ─────────────────────────────────────────────
const FieldRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-slate-700 font-medium break-words">{value || "—"}</p>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const StudentProfilePage = () => {
  const { user: authUser, login } = useAuth();

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: "", profileDescription: "", avatarUrl: "" });

  // ── Fetch profile ────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setForm({
          name:               data.name               || "",
          profileDescription: data.profileDescription || "",
          avatarUrl:          data.avatarUrl          || "",
        });
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Handle save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name cannot be empty.");
    setSaving(true);
    try {
      const res = await updateUserProfile({
        name:               form.name.trim(),
        profileDescription: form.profileDescription.trim(),
        avatarUrl:          form.avatarUrl.trim(),
      });

      // Update local profile state
      setProfile((prev) => ({ ...prev, ...res.user }));

      // Sync AuthContext so navbar updates immediately
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...stored, ...res.user };
      localStorage.setItem("user", JSON.stringify(updated));
      // Re-trigger auth state by updating stored user
      window.dispatchEvent(new Event("storage"));

      setEditing(false);
      setAvatarError(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ── Cancel edit ──────────────────────────────────────────────────────────
  const handleCancel = () => {
    setForm({
      name:               profile.name               || "",
      profileDescription: profile.profileDescription || "",
      avatarUrl:          profile.avatarUrl          || "",
    });
    setAvatarError(false);
    setEditing(false);
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-6 w-40 bg-slate-100 rounded-full" />
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-slate-100" />
        <div className="h-5 w-36 bg-slate-100 rounded-full" />
        <div className="h-4 w-24 bg-slate-100 rounded-full" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl" />)}
      </div>
    </div>
  );

  const showAvatar = !avatarError && (editing ? form.avatarUrl : profile?.avatarUrl);
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">View and update your personal information.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition duration-200"
          >
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* ── Avatar card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-4">

        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-100 ring-4 ring-white">
            {showAvatar ? (
              <img
                src={editing ? form.avatarUrl : profile?.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="text-2xl font-black text-white">
                {getInitials(editing ? form.name : profile?.name)}
              </span>
            )}
          </div>
          {editing && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow border-2 border-white">
              <Camera size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* Name + role */}
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800">{profile?.name}</h2>
          <span className="inline-flex items-center gap-1.5 mt-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck size={11} /> Student
          </span>
        </div>

        {/* Meta pills */}
        <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-4 w-full justify-center">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} /> Member since {memberSince}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen size={11} /> {authUser?.role || "student"}
          </span>
        </div>

      </div>

      {/* ── Profile details / edit form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">
            {editing ? "Edit Information" : "Personal Information"}
          </h3>
          {editing && (
            <span className="text-xs text-slate-400">Fields marked * are required</span>
          )}
        </div>

        <div className="p-6">
          {editing ? (
            /* ── Edit form ── */
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl">
                  <Mail size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-500">{profile?.email}</span>
                  <span className="ml-auto text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Read-only</span>
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={form.avatarUrl}
                  onChange={(e) => { setForm((p) => ({ ...p, avatarUrl: e.target.value })); setAvatarError(false); }}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition"
                />
                <p className="text-xs text-slate-400 mt-1">Paste a public image URL to set your profile photo.</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Bio
                </label>
                <textarea
                  value={form.profileDescription}
                  onChange={(e) => setForm((p) => ({ ...p, profileDescription: e.target.value }))}
                  placeholder="Tell us a little about yourself…"
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">{form.profileDescription.length} / 300 characters</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 active:scale-[0.98] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
                >
                  <Save size={14} />
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="divide-y divide-slate-100">
              <FieldRow icon={User}       label="Full Name"    value={profile?.name} />
              <FieldRow icon={Mail}       label="Email"        value={profile?.email} />
              <FieldRow icon={ShieldCheck} label="Role"        value="Student" />
              <FieldRow icon={BookOpen}   label="Bio"          value={profile?.profileDescription || "No bio added yet."} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StudentProfilePage;