import { useState } from "react";
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Clock,
  GripVertical,
  BookOpen,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { deleteLecture } from "../../services/lecture.service";

// ─── Helper ───────────────────────────────────────────────────────────────────

const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

// ─── LectureList ──────────────────────────────────────────────────────────────

/**
 * Props:
 *   lectures          array    — list of lecture objects from parent state
 *   onAddLecture      fn()     — opens LectureFormModal in create mode
 *   onEditLecture     fn(lec)  — opens LectureFormModal in edit mode
 *   onLectureDeleted  fn(id)   — removes lecture from parent state by _id
 */
const LectureList = ({
  lectures,
  onAddLecture,
  onEditLecture,
  onLectureDeleted,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (lecture) => {
    if (!window.confirm(`Delete "${lecture.title}"? This cannot be undone.`))
      return;

    try {
      setDeletingId(lecture._id);
      await deleteLecture(lecture._id);
      toast.success("Lecture deleted.");
      onLectureDeleted(lecture._id);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lecture.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Shared header ─────────────────────────────────────────────────────────

  const Header = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Video size={14} className="text-indigo-600" />
        </div>
        <h2 className="font-bold text-slate-800">Lectures</h2>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            lectures.length > 0
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {lectures.length}
        </span>
      </div>
      <button
        onClick={onAddLecture}
        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
      >
        <Plus size={15} />
        Add Lecture
      </button>
    </div>
  );

  // ── Empty state ───────────────────────────────────────────────────────────

  if (lectures.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Header />
        <div className="py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-indigo-400" />
          </div>
          <p className="font-bold text-slate-700">No lectures yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-5">
            Add your first lecture to get started.
          </p>
          <button
            onClick={onAddLecture}
            className="inline-flex items-center gap-1.5 border border-indigo-200 hover:border-indigo-400 text-indigo-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 bg-indigo-50 hover:bg-indigo-100"
          >
            <Plus size={15} />
            Add First Lecture
          </button>
        </div>
      </div>
    );
  }

  // ── List ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <Header />

      <ul className="divide-y divide-slate-100">
        {lectures.map((lecture, index) => (
          <li
            key={lecture._id}
            className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition duration-150 group"
          >
            {/* Drag handle — visual only */}
            <GripVertical
              size={16}
              className="text-slate-300 group-hover:text-slate-400 flex-shrink-0 transition"
            />

            {/* Order number */}
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-slate-500">
                {index + 1}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {lecture.title}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} />
                  {formatDuration(lecture.duration)}
                </span>
                {lecture.isPreview && (
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Eye size={10} />
                    Free Preview
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEditLecture(lecture)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                title="Edit lecture"
              >
                <Edit2 size={14} />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDelete(lecture)}
                disabled={deletingId === lecture._id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                title="Delete lecture"
              >
                {deletingId === lecture._id ? (
                  <Loader2 size={14} className="animate-spin text-rose-400" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LectureList;