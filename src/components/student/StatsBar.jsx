import { BookOpen, PlayCircle, CheckCircle2, Clock } from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, iconBg, iconColor, count, label }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 flex-1">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon size={22} className={iconColor} />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800">{count}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── StatsBar ─────────────────────────────────────────────────────────────────

/**
 * Props:
 *   enrollments   array   — list of enrollment objects
 *   progressMap   object  — { [courseId]: { progressPercentage, ... } }
 */
const StatsBar = ({ enrollments = [], progressMap = {} }) => {
  const total      = enrollments.length;

  const completed  = enrollments.filter((e) => {
    const id = typeof e.courseId === "object" ? e.courseId._id : e.courseId;
    return progressMap[id]?.progressPercentage === 100;
  }).length;

  const inProgress = enrollments.filter((e) => {
    const id = typeof e.courseId === "object" ? e.courseId._id : e.courseId;
    const pct = progressMap[id]?.progressPercentage ?? 0;
    return pct > 0 && pct < 100;
  }).length;

  const notStarted = enrollments.filter((e) => {
    const id = typeof e.courseId === "object" ? e.courseId._id : e.courseId;
    const pct = progressMap[id]?.progressPercentage ?? 0;
    return pct === 0;
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={BookOpen}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        count={total}
        label="Total Enrolled"
      />
      <StatCard
        icon={PlayCircle}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        count={inProgress}
        label="In Progress"
      />
      <StatCard
        icon={CheckCircle2}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        count={completed}
        label="Completed"
      />
      <StatCard
        icon={Clock}
        iconBg="bg-slate-100"
        iconColor="text-slate-500"
        count={notStarted}
        label="Not Started"
      />
    </div>
  );
};

export default StatsBar;