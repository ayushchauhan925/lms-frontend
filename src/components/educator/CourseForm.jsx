import { useState, useRef } from "react";
import {
  BookOpen,
  FileText,
  Tag,
  BarChart2,
  Globe,
  DollarSign,
  Image,
  Video,
  Hash,
  Loader2,
  ChevronRight,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { createCourse } from "../../services/course.service";
import { uploadToCloudinary } from "../../utils/cloudinary";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Business",
  "Mobile Development",
  "DevOps",
  "Cybersecurity",
];

const LEVELS = ["beginner", "intermediate", "advanced"];

const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Portuguese",
];

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition duration-200";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialForm = {
  title: "",
  description: "",
  category: "",
  level: "beginner",
  language: "English",
  price: "",
  tags: "",
};

const initialUpload = { url: "", publicId: "", duration: null };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FieldRow = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
);

const SectionLabel = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
      <Icon size={14} className="text-indigo-600" />
    </div>
    <p className="text-sm font-semibold text-slate-700">{text}</p>
  </div>
);


const UploadBox = ({
  accept,
  label,
  hint,
  uploaded,
  progress,
  uploading,
  onFile,
  onClear,
  previewType = "image",
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  // ── Uploaded — show preview ───────────────────────────────────────────────
  if (uploaded?.url) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <div className="relative rounded-xl border border-emerald-200 bg-emerald-50 overflow-hidden">
          {previewType === "image" ? (
            <img
              src={uploaded.url}
              alt="Uploaded preview"
              className="w-full h-44 object-cover"
            />
          ) : (
            <video
              src={uploaded.url}
              controls
              className="w-full h-44 object-cover bg-black"
            />
          )}

          {/* Success badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">Uploaded</span>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-rose-50 transition"
          >
            <X size={13} className="text-slate-500 hover:text-rose-500" />
          </button>

          {/* Duration badge for video */}
          {previewType === "video" && uploaded.duration && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              {Math.floor(uploaded.duration / 60)}m {uploaded.duration % 60}s
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Uploading — show progress bar ─────────────────────────────────────────
  if (uploading) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="text-indigo-600 animate-spin" />
              <span className="text-sm font-medium text-indigo-700">Uploading...</span>
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
      </div>
    );
  }

  // ── Idle — drop zone ──────────────────────────────────────────────────────
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`
          cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition duration-200
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
              Drop file here or{" "}
              <span className="text-indigo-600 underline underline-offset-2">browse</span>
            </p>
            {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

// ─── CourseForm ───────────────────────────────────────────────────────────────

/**
 * Props:
 *   onCourseCreated(course) — lifts created course object up to CreateCoursePage
 */
const CourseForm = ({ onCourseCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Thumbnail
  const [thumbnail, setThumbnail] = useState(initialUpload);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);

  // Preview video
  const [previewVideo, setPreviewVideo] = useState(initialUpload);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file.");
    }
    try {
      setThumbUploading(true);
      setThumbProgress(0);
      const result = await uploadToCloudinary(file, "image", setThumbProgress);
      setThumbnail(result);
      toast.success("Thumbnail uploaded!");
    } catch {
      toast.error("Thumbnail upload failed. Please try again.");
    } finally {
      setThumbUploading(false);
    }
  };

  const handleVideoFile = async (file) => {
    if (!file.type.startsWith("video/")) {
      return toast.error("Please select a video file.");
    }
    try {
      setVideoUploading(true);
      setVideoProgress(0);
      const result = await uploadToCloudinary(file, "video", setVideoProgress);
      setPreviewVideo(result);
      toast.success("Preview video uploaded!");
    } catch {
      toast.error("Video upload failed. Please try again.");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim())       return toast.error("Course title is required.");
    if (!form.description.trim()) return toast.error("Description is required.");
    if (!form.category)           return toast.error("Please select a category.");
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0)
                                  return toast.error("Enter a valid price (0 for free).");
    if (!thumbnail.url)           return toast.error("Please upload a thumbnail.");

    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      level:       form.level,
      language:    form.language,
      price:       Number(form.price),
      thumbnail: {
        url:      thumbnail.url,
        publicId: thumbnail.publicId,
      },
      previewVideo: {
        url:      previewVideo.url,
        publicId: previewVideo.publicId,
        ...(previewVideo.duration && { duration: previewVideo.duration }),
      },
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      setSubmitting(true);
      const data = await createCourse(payload);
      toast.success("Course created! Now add your lectures.");
      onCourseCreated(data.course);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basic Info ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionLabel icon={BookOpen} text="Basic Information" />

        <div className="space-y-5">

          {/* Title */}
          <div>
            <label className={labelClass}>
              Course Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Complete Web Development Bootcamp"
                maxLength={120}
                className={inputClass + " pl-9"}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-right">{form.title.length}/120</p>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3 top-3.5 text-slate-400" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will students learn? What makes this course unique?"
                maxLength={2000}
                rows={4}
                className={inputClass + " pl-9 resize-none"}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/2000</p>
          </div>

          {/* Category + Level */}
          <FieldRow>
            <div>
              <label className={labelClass}>
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass + " pl-9 appearance-none cursor-pointer"}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Level</label>
              <div className="relative">
                <BarChart2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className={inputClass + " pl-9 appearance-none cursor-pointer"}
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FieldRow>

          {/* Language + Price */}
          <FieldRow>
            <div>
              <label className={labelClass}>Language</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className={inputClass + " pl-9 appearance-none cursor-pointer"}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Price (USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0 for free"
                  min={0}
                  className={inputClass + " pl-9"}
                />
              </div>
            </div>
          </FieldRow>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            <div className="relative">
              <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, javascript, frontend  (comma separated)"
                className={inputClass + " pl-9"}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Separate tags with commas. Helps students discover your course.
            </p>
          </div>

        </div>
      </div>

      {/* ── Thumbnail ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionLabel icon={Image} text="Course Thumbnail" />
        <UploadBox
          label={<>Thumbnail Image <span className="text-rose-500">*</span></>}
          accept="image/*"
          hint="JPG, PNG or WEBP recommended. Min 750×422px."
          uploaded={thumbnail}
          uploading={thumbUploading}
          progress={thumbProgress}
          onFile={handleThumbnailFile}
          onClear={() => setThumbnail(initialUpload)}
          previewType="image"
        />
      </div>

      {/* ── Preview Video ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionLabel icon={Video} text="Preview Video (Optional)" />
        <p className="text-xs text-slate-400 -mt-3 mb-4">
          A short teaser shown to students before they enroll. Keep it under 3 minutes.
        </p>
        <UploadBox
          label="Preview Video"
          accept="video/*"
          hint="MP4 recommended. Max 500MB."
          uploaded={previewVideo}
          uploading={videoUploading}
          progress={videoProgress}
          onFile={handleVideoFile}
          onClear={() => setPreviewVideo(initialUpload)}
          previewType="video"
        />
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || thumbUploading || videoUploading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition duration-200 shadow-md shadow-indigo-200"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Creating Course...
            </>
          ) : (
            <>
              Save & Continue
              <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>

    </form>
  );
};

export default CourseForm;