import { useState, useRef, useEffect } from "react";
import { GraduationCap, Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const notifications = [
  { id: 1, emoji: "📚", text: "Your enrollment in React & Next.js is confirmed", time: "2m ago",  unread: true  },
  { id: 2, emoji: "🏆", text: "Certificate ready: Web Development Fundamentals",  time: "1h ago",  unread: true  },
  { id: 3, emoji: "⭐", text: "Don't forget to review your completed course",     time: "3h ago",  unread: false },
  { id: 4, emoji: "💳", text: "Payment of $49 received for UI/UX Design course",  time: "1d ago",  unread: false },
];

const StudentNavbar = ({ trigger }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch]           = useState("");
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef   = useRef();
  const profileRef = useRef();

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16">
      <div className="h-full px-4 flex items-center gap-4">

        {/* ── Trigger + Logo ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* SidebarTrigger passed from StudentLayout */}
          {trigger}

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-800 hidden sm:block">Learnify</span>
          </a>
        </div>

        {/* ── Search ── */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >✕</button>
            )}
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-1">

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-800">Notifications</span>
                  <button className="text-xs text-indigo-600 hover:underline font-medium">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition ${
                        n.unread ? "bg-indigo-50/50" : "bg-white"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{n.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 text-center">
                  <button className="text-xs text-indigo-600 font-medium hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || "Student"}</p>
                <p className="text-[10px] text-slate-400 leading-tight">Student</p>
              </div>
              <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Student"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email || "student@learnify.com"}</p>
                  </div>
                </div>
                <div className="py-1">
                  {[
                    { icon: User,     label: "My Profile", href: "/student/profile"  },
                    { icon: Settings, label: "Settings",   href: "/student/settings" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                    >
                      <Icon size={15} className="text-slate-400" />
                      {label}
                    </a>
                  ))}
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;