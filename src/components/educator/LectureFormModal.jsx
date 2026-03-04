import { useState, useRef, useEffect } from "react";
import {
  X,
  Video,
  FileText,
  Hash,
  Eye,
  Loader2,
  Upload,
  CheckCircle2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import { createLecture, updateLecture } from "../../services/lecture.service";
import { uploadToCloudinary } from "../../utils/cloudinary";

// ─── Constants ────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

const initialForm = {
  title: "",
  lectureDescription: "",
  isPreview: false,
};

const initialVideo = { url: "", publicId: "", duration: null };

// ─── Video Upload Box ─────────────────────────────────────────────────────────

const VideoUploadBox = ({ uploaded, uploading, progress, onFile, onClear }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  // ── Uploaded ──────────────────────────────────────────────────────────────
  if (uploaded?.url) {
    return (
      <div className="relative rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
        <video
          src={uploaded.url}
          controls
          className="w-full h-40 object-cover bg-black"
        />

        {/* Success badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">Uploaded</span>
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-rose-50 transition"
        >
          <X size={13} className="text-slate-500 hover:text-rose-500" />
        </button>

        {/* Duration */}
        {uploaded.duration && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {Math.floor(uploaded.duration / 60)}m {uploaded.duration % 60}s
          </div>
        )}
      </div>
    );
  }

  // ── Uploading ─────────────────────────────────────────────────────────────
  if (uploading) {
    return (
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="text-indigo-600 animate-spin" />
            <span className="text-sm font-medium text-indigo-700">Uploading video...</span>
          </div>
          <span className="text-sm font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-indigo-100 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className={`
        cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition duration-200
        ${dragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"
        }
      `}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Upload size={18} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            Drop video here or{" "}
            <span className="text-indigo-600 underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">MP4 recommended. Max 500MB.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ─── LectureFormModal ─────────────────────────────────────────────────────────

/**
 * Props:
 *   isOpen          boolean
 *   onClose         fn()
 *   courseId        string
 *   nextOrder       number        — pre-filled order for new lecture
 *   editLecture     object|null   — if set, modal is in edit mode
 *   onLectureAdded  fn(lecture)   — called after successful create
 *   onLectureUpdated fn(lecture)  — called after successful update
 */
const LectureFormModal = ({
  isOpen,
  onClose,
  courseId,
  nextOrder,
  editLecture = null,
  onLectureAdded,
  onLectureUpdated,
}) => {
  const isEditMode = Boolean(editLecture);

  const [form, setForm] = useState(initialForm);
  const [video, setVideo] = useState(initialVideo);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // ── Hydrate form in edit mode ─────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editLecture) {
        setForm({
          title: editLecture.title || "",
          lectureDescription: editLecture.lectureDescription || "",
          isPreview: editLecture.isPreview || false,
        });
        setVideo({
          url: editLecture.videoUrl || "",
          publicId: editLecture.videoPublicId || "",
          duration: editLecture.duration || null,
        });
      } else {
        setForm(initialForm);
        setVideo(initialVideo);
      }
    }
  }, [isOpen, isEditMode, editLecture]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVideoFile = async (file) => {
    if (!file.type.startsWith("video/")) {
      return toast.error("Please select a video file.");
    }
    try {
      setVideoUploading(true);
      setVideoProgress(0);
      const result = await uploadToCloudinary(file, "video", setVideoProgress);
      setVideo(result);
      toast.success("Video uploaded!");
    } catch {
      toast.error("Video upload failed. Please try again.");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Lecture title is required.");
    if (!video.url)         return toast.error("Please upload a lecture video.");

    try {
      setSubmitting(true);

      if (isEditMode) {
        // ── Edit ────────────────────────────────────────────────────────────
        const payload = {
          title:              form.title.trim(),
          lectureDescription: form.lectureDescription.trim(),
          isPreview:          form.isPreview,
          videoUrl:           video.url,
          videoPublicId:      video.publicId,
          ...(video.duration && { duration: video.duration }),
        };

        const data = await updateLecture(editLecture._id, payload);
        toast.success("Lecture updated!");
        onLectureUpdated(data.lecture);

      } else {
        // ── Create ──────────────────────────────────────────────────────────
        const payload = {
          courseId,
          title:              form.title.trim(),
          lectureDescription: form.lectureDescription.trim(),
          isPreview:          form.isPreview,
          order:              nextOrder,
          videoUrl:           video.url,
          videoPublicId:      video.publicId,
          duration:           video.duration || 0,
        };

        const data = await createLecture(payload);
        toast.success("Lecture added!");
        onLectureAdded(data.lecture);
      }

      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Video size={15} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm">
                {isEditMode ? "Edit Lecture" : "Add New Lecture"}
              </h2>
              {!isEditMode && (
                <p className="text-xs text-slate-400">Lecture #{nextOrder}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Title */}
          <div>
            <label className={labelClass}>
              Lecture Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to React Hooks"
                maxLength={150}
                className={inputClass + " pl-9"}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-right">
              {form.title.length}/150
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <div className="relative">
              <Hash size={15} className="absolute left-3 top-3.5 text-slate-400" />
              <textarea
                name="lectureDescription"
                value={form.lectureDescription}
                onChange={handleChange}
                placeholder="Briefly describe what this lecture covers..."
                maxLength={1000}
                rows={3}
                className={inputClass + " pl-9 resize-none"}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-right">
              {form.lectureDescription.length}/1000
            </p>
          </div>

          {/* Video Upload */}
          <div>
            <label className={labelClass}>
              Lecture Video <span className="text-rose-500">*</span>
            </label>
            <VideoUploadBox
              uploaded={video}
              uploading={videoUploading}
              progress={videoProgress}
              onFile={handleVideoFile}
              onClear={() => setVideo(initialVideo)}
            />
          </div>

          {/* Free Preview Toggle */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Eye size={13} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Free Preview</p>
                <p className="text-xs text-slate-400">
                  Allow non-enrolled students to watch this lecture
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPreview"
                checked={form.isPreview}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || videoUploading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {isEditMode ? "Saving..." : "Adding..."}
                </>
              ) : (
                <>
                  <Save size={14} />
                  {isEditMode ? "Save Changes" : "Add Lecture"}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LectureFormModal;