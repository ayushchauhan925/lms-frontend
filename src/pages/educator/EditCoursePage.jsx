import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Upload, X, Image, Video, Loader2, Save,
  CheckCircle2, Plus, Pencil, Trash2, GripVertical,
  Eye, ChevronDown, ChevronUp, AlertTriangle, Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { getCourseById, updateCourse } from "../../services/course.service";
import {
  getLecturesByCourse, createLecture, updateLecture, deleteLecture,
} from "../../services/lecture.service";
import { uploadToCloudinary } from "../../utils/cloudinary";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Web Development", "Data Science", "Design", "Marketing", "Business",
  "Mobile Development", "DevOps", "Cybersecurity", "Programming", "Other",
];

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French",
  "German", "Portuguese", "Arabic", "Chinese",
];

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

const formatDuration = (secs) => {
  if (!secs) return "0:00";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ─── UploadBox (image + video, used by course form) ───────────────────────────

const UploadBox = ({ type, value, onChange, onClear }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [dragging, setDragging]   = useState(false);

  const accept = type === "image" ? "image/*" : "video/*";
  const Icon   = type === "image" ? Image : Video;

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setProgress(0);
      const result = await uploadToCloudinary(file, type, setProgress);
      onChange(result);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (value?.url) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
        {type === "image" ? (
          <img src={value.url} alt="thumbnail" className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-slate-800">
            <video src={value.url} className="max-h-40 max-w-full" controls={false} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Video size={28} className="text-white opacity-60" />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition"
        >
          <X size={13} />
        </button>
        <div className="absolute bottom-2 left-2">
          <span className="bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {type === "video" && value.duration
              ? `${Math.floor(value.duration / 60)}m ${value.duration % 60}s`
              : "Uploaded"}
          </span>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6 flex flex-col items-center gap-3">
        <Loader2 size={22} className="text-indigo-500 animate-spin" />
        <div className="w-full bg-indigo-100 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-indigo-600 font-medium">{progress}%</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 cursor-pointer transition duration-200 ${
        dragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
        <Icon size={18} className="text-indigo-400" />
      </div>
      <p className="text-sm font-semibold text-slate-600">
        Click or drag to upload {type === "image" ? "thumbnail" : "video"}
      </p>
      <p className="text-xs text-slate-400">
        {type === "image" ? "PNG, JPG, WEBP" : "MP4, MOV, WEBM"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

// ─── VideoUploadBox (used inside lecture modal) ───────────────────────────────

const VideoUploadBox = ({ value, onChange, onClear }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [dragging, setDragging]   = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setProgress(0);
      const result = await uploadToCloudinary(file, "video", setProgress);
      onChange(result);
    } catch {
      toast.error("Video upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (value?.url) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
        <div className="w-full h-36 flex items-center justify-center">
          <Video size={28} className="text-white/40" />
          <div className="absolute bottom-2 left-2">
            <span className="bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock size={10} />
              {value.duration
                ? `${Math.floor(value.duration / 60)}m ${value.duration % 60}s`
                : "Uploaded"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-5 flex flex-col items-center gap-3">
        <Loader2 size={20} className="text-indigo-500 animate-spin" />
        <div className="w-full bg-indigo-100 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-indigo-600 font-medium">Uploading {progress}%</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-5 flex flex-col items-center gap-2 cursor-pointer transition duration-200 ${
        dragging
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
        <Video size={16} className="text-indigo-400" />
      </div>
      <p className="text-sm font-semibold text-slate-600">Click or drag to upload video</p>
      <p className="text-xs text-slate-400">MP4, MOV, WEBM</p>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

// ─── LectureFormModal ─────────────────────────────────────────────────────────

const LectureFormModal = ({ courseId, lecture, nextOrder, onClose, onSaved }) => {
  const isEdit = !!lecture;

  const [form, setForm] = useState({
    title: lecture?.title || "",
    lectureDescription: lecture?.lectureDescription || "",
    isPreview: lecture?.isPreview ?? false,
  });

  const [video, setVideo] = useState(
    lecture?.videoUrl
      ? { url: lecture.videoUrl, publicId: lecture.videoPublicId, duration: lecture.duration }
      : null
  );

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Lecture title is required.");
    if (!video?.url)        return toast.error("Please upload a video.");

    const payload = {
      title: form.title.trim(),
      lectureDescription: form.lectureDescription.trim(),
      isPreview: form.isPreview,
      videoUrl: video.url,
      videoPublicId: video.publicId,
      duration: video.duration || 0,
    };

    try {
      setSaving(true);
      if (isEdit) {
        const res = await updateLecture(lecture._id, payload);
        onSaved(res.lecture, "update");
        toast.success("Lecture updated!");
      } else {
        const res = await createLecture({ ...payload, courseId, order: nextOrder });
        onSaved(res.lecture, "create");
        toast.success("Lecture added!");
      }
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save lecture.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            {isEdit ? "Edit Lecture" : "Add New Lecture"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className={labelClass}>
              Lecture Title
              <span className="float-right text-xs font-normal text-slate-400">
                {form.title.length}/150
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={150}
              placeholder="e.g. Introduction to React Hooks"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Description
              <span className="ml-1 text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <textarea
              name="lectureDescription"
              value={form.lectureDescription}
              onChange={handleChange}
              maxLength={1000}
              rows={3}
              placeholder="What will students learn in this lecture?"
              className={inputClass + " resize-none leading-relaxed"}
            />
          </div>

          <div>
            <label className={labelClass}>Lecture Video</label>
            <VideoUploadBox
              value={video}
              onChange={(val) => setVideo(val)}
              onClear={() => setVideo(null)}
            />
          </div>

          {/* Free Preview toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm((prev) => ({ ...prev, isPreview: !prev.isPreview }))}
              className={`relative rounded-full transition-colors duration-200 shrink-0 ${
                form.isPreview ? "bg-indigo-600" : "bg-slate-200"
              }`}
              style={{ width: "40px", height: "22px" }}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.isPreview ? "translate-x-[18px]" : "translate-x-0"
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Free Preview</p>
              <p className="text-xs text-slate-400">Non-enrolled students can watch this lecture</p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl text-sm transition shadow-md shadow-indigo-200"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : (
              <><CheckCircle2 size={14} />{isEdit ? "Save Changes" : "Add Lecture"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DeleteConfirmModal ───────────────────────────────────────────────────────

const DeleteConfirmModal = ({ lecture, onClose, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteLecture(lecture._id);
      onDeleted(lecture._id);
      toast.success("Lecture deleted.");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete lecture.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Delete Lecture?</h3>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-semibold text-slate-700">"{lecture.title}"</span> will be
            permanently deleted. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── LectureRow ───────────────────────────────────────────────────────────────

const LectureRow = ({ lecture, index, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical size={16} />
        </div>
        <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{lecture.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={10} />
              {formatDuration(lecture.duration)}
            </span>
            {lecture.isPreview && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <Eye size={9} />
                Free Preview
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {lecture.lectureDescription && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <button
            onClick={() => onEdit(lecture)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(lecture)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {expanded && lecture.lectureDescription && (
        <div className="px-4 pb-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 leading-relaxed mt-2">
            {lecture.lectureDescription}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── EditCoursePage ───────────────────────────────────────────────────────────

const EditCoursePage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  // ── Course state ──────────────────────────────────────────────────────────
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading]             = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", category: "",
    level: "beginner", language: "English", price: 0, tags: "",
  });

  const [thumbnail, setThumbnail]       = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  // ── Lecture state ─────────────────────────────────────────────────────────
  const [lectures, setLectures]               = useState([]);
  const [lecturesLoading, setLecturesLoading] = useState(true);
  const [showAddModal, setShowAddModal]       = useState(false);
  const [editingLecture, setEditingLecture]   = useState(null);
  const [deletingLecture, setDeletingLecture] = useState(null);

  const dragIndex = useRef(null);

  // ── Fetch course ──────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        const c    = data.course;
        setForm({
          title:       c.title       || "",
          description: c.description || "",
          category:    c.category    || "",
          level:       c.level       || "beginner",
          language:    c.language    || "English",
          price:       c.price       ?? 0,
          tags:        (c.tags || []).join(", "),
        });
        if (c.thumbnail?.url)    setThumbnail(c.thumbnail);
        if (c.previewVideo?.url) setPreviewVideo(c.previewVideo);
      } catch {
        toast.error("Failed to load course.");
        navigate(`/educator/courses/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // ── Fetch lectures ────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLecturesLoading(true);
        const data = await getLecturesByCourse(id);
        setLectures(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load lectures.");
      } finally {
        setLecturesLoading(false);
      }
    };
    fetchLectures();
  }, [id]);

  // ── Course handlers ───────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim())       return toast.error("Title is required.");
    if (!form.description.trim()) return toast.error("Description is required.");
    if (!form.category)           return toast.error("Category is required.");
    if (!thumbnail?.url)          return toast.error("Thumbnail is required.");

    const payload = {
      ...form,
      price:        Number(form.price),
      tags:         form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      thumbnail,
      previewVideo: previewVideo || { url: "", publicId: "" },
    };

    try {
      setSaving(true);
      await updateCourse(id, payload);
      toast.success("Course updated successfully!");
      navigate(`/educator/courses/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  // ── Lecture drag-to-reorder ───────────────────────────────────────────────

  const handleDragStart = (index) => { dragIndex.current = index; };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    setLectures((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next;
    });
  };

  const handleDragEnd = () => { dragIndex.current = null; };

  // ── Lecture CRUD callbacks ────────────────────────────────────────────────

  const handleLectureSaved = (lecture, type) => {
    if (type === "create") {
      setLectures((prev) => [...prev, lecture]);
    } else {
      setLectures((prev) => prev.map((l) => (l._id === lecture._id ? lecture : l)));
    }
  };

  const handleLectureDeleted = (lectureId) => {
    setLectures((prev) => prev.filter((l) => l._id !== lectureId));
  };

  const nextOrder =
    lectures.length > 0 ? Math.max(...lectures.map((l) => l.order)) + 1 : 1;

  const totalDuration = lectures.reduce((acc, l) => acc + (l.duration || 0), 0);
  const previewCount  = lectures.filter((l) => l.isPreview).length;

  const isUploading = uploading;

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
        <div className="h-5 w-36 bg-slate-100 rounded-full" />
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/educator/courses/${id}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <h1 className="text-2xl font-black text-slate-800">Edit Course</h1>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isUploading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : (
              <><Save size={14} />Save Changes</>
            )}
          </button>
        </div>

        {/* ── Basic Information ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-slate-800 text-sm">Basic Information</h2>

          <div>
            <label className={labelClass}>
              Course Title
              <span className="float-right text-xs font-normal text-slate-400">
                {form.title.length}/120
              </span>
            </label>
            <input
              type="text" name="title" value={form.title} onChange={handleChange}
              maxLength={120} placeholder="e.g. Complete React Developer Course"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Description
              <span className="float-right text-xs font-normal text-slate-400">
                {form.description.length}/2000
              </span>
            </label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              maxLength={2000} rows={5}
              placeholder="What will students learn in this course?"
              className={inputClass + " resize-none leading-relaxed"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select name="level" value={form.level} onChange={handleChange} className={inputClass}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Language</label>
              <select name="language" value={form.language} onChange={handleChange} className={inputClass}>
                {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price (USD)</label>
              <input
                type="number" name="price" value={form.price} onChange={handleChange}
                min={0} placeholder="0 for free" className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Tags
              <span className="ml-1 text-xs font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              type="text" name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g. react, javascript, frontend" className={inputClass}
            />
          </div>
        </div>

        {/* ── Thumbnail ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Course Thumbnail</h2>
            <p className="text-xs text-slate-400 mt-0.5">Recommended: 1280×720px, JPG or PNG</p>
          </div>
          <UploadBox
            type="image" value={thumbnail}
            onChange={(val) => setThumbnail(val)}
            onClear={() => setThumbnail(null)}
          />
        </div>

        {/* ── Preview Video ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">
              Preview Video
              <span className="ml-2 text-xs font-normal text-slate-400">Optional</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">A short teaser shown to students before enrolling</p>
          </div>
          <UploadBox
            type="video" value={previewVideo}
            onChange={(val) => setPreviewVideo(val)}
            onClear={() => setPreviewVideo(null)}
          />
        </div>

        {/* ── Lectures ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Lectures</h2>
              <p className="text-xs text-slate-400 mt-0.5">Add, edit, delete or reorder your course lectures</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-indigo-200"
            >
              <Plus size={13} />
              Add Lecture
            </button>
          </div>

          {/* Stats */}
          {!lecturesLoading && lectures.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Lectures", value: lectures.length },
                { label: "Total Duration", value: formatDuration(totalDuration) },
                { label: "Free Previews",  value: previewCount },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl border border-slate-100 px-3 py-2.5 text-center">
                  <p className="text-lg font-black text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* List */}
          {lecturesLoading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-xl" />)}
            </div>
          ) : lectures.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Video size={18} className="text-indigo-300" />
              </div>
              <p className="font-bold text-slate-600 text-sm">No lectures yet</p>
              <p className="text-xs text-slate-400">Click "Add Lecture" to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {lectures.length} lecture{lectures.length !== 1 ? "s" : ""} · drag to reorder
              </p>
              {lectures.map((lecture, index) => (
                <div
                  key={lecture._id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <LectureRow
                    lecture={lecture}
                    index={index}
                    onEdit={(l) => setEditingLecture(l)}
                    onDelete={(l) => setDeletingLecture(l)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom action row ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-6">
          <Link
            to={`/educator/courses/${id}`}
            className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isUploading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : (
              <><CheckCircle2 size={14} />Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* ── Lecture Modals ─────────────────────────────────────────────── */}
      {showAddModal && (
        <LectureFormModal
          courseId={id}
          lecture={null}
          nextOrder={nextOrder}
          onClose={() => setShowAddModal(false)}
          onSaved={handleLectureSaved}
        />
      )}
      {editingLecture && (
        <LectureFormModal
          courseId={id}
          lecture={editingLecture}
          nextOrder={nextOrder}
          onClose={() => setEditingLecture(null)}
          onSaved={handleLectureSaved}
        />
      )}
      {deletingLecture && (
        <DeleteConfirmModal
          lecture={deletingLecture}
          onClose={() => setDeletingLecture(null)}
          onDeleted={handleLectureDeleted}
        />
      )}
    </>
  );
};

export default EditCoursePage;