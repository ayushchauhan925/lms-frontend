import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  CheckCircle2, Loader2, Clock, Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import { getLecturesByCourse } from "../../services/lecture.service";
import { getCourseById }       from "../../services/course.service";
import { getCourseProgress, markLectureCompleted } from "../../services/progress.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDuration = (s) => {
  if (!s) return "0:00";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ─── LecturePlayerPage ────────────────────────────────────────────────────────

const LecturePlayerPage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [course, setCourse]                   = useState(null);
  const [lectures, setLectures]               = useState([]);
  const [currentIdx, setCurrentIdx]           = useState(0);
  const [completedIds, setCompletedIds]       = useState(new Set());
  const [loading, setLoading]                 = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  // ── Fetch data ────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, lecturesRes, progressRes] = await Promise.all([
          getCourseById(courseId),
          getLecturesByCourse(courseId),
          getCourseProgress(courseId),
        ]);

        setCourse(courseRes.course);
        setLectures(lecturesRes);

        // Build completed Set
        const ids = new Set(
          (progressRes.completedLectureIds || []).map((id) =>
            typeof id === "object" ? id._id || id.toString() : id
          )
        );
        setCompletedIds(ids);

        // Set current lecture index from URL param
        const idx = lecturesRes.findIndex((l) => l._id === lectureId);
        if (idx !== -1) setCurrentIdx(idx);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lecture.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lectureId]);

  // Reload video when lecture changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIdx]);

  const currentLecture = lectures[currentIdx];

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIdx < lectures.length - 1) setCurrentIdx((i) => i + 1);
  };

  const handleMarkComplete = async () => {
    if (!currentLecture || completedIds.has(currentLecture._id)) return;
    try {
      setMarkingComplete(true);
      await markLectureCompleted(courseId, currentLecture._id);
      setCompletedIds((prev) => new Set([...prev, currentLecture._id]));
      toast.success("Lecture marked as completed!");
      if (currentIdx < lectures.length - 1) {
        setTimeout(() => setCurrentIdx((i) => i + 1), 800);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark complete.");
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleVideoEnded = () => {
    if (currentLecture && !completedIds.has(currentLecture._id)) {
      handleMarkComplete();
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="h-screen bg-slate-900 flex items-center justify-center">
      <Loader2 size={32} className="text-white animate-spin" />
    </div>
  );

  const isFree      = currentLecture?.isPreview;
  const isCompleted = completedIds.has(currentLecture?._id);
  const percentage  = lectures.length > 0
    ? Math.round((completedIds.size / lectures.length) * 100)
    : 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700 flex-shrink-0">

        {/* Back to course player */}
        <button
          onClick={() => navigate(`/student/learn/${courseId}`)}
          className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={15} />
          Back to Course
        </button>

        {/* Course title */}
        <h1 className="text-sm font-bold text-white truncate max-w-xs hidden sm:block">
          {course?.title}
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">
            <span className="text-white font-semibold">{completedIds.size}</span>
            /{lectures.length} completed
          </span>
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            percentage === 100
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-indigo-500/20 text-indigo-400"
          }`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* ── Video (full width) ────────────────────────────────────────────── */}
      <div className="w-full bg-black">
        {currentLecture?.videoUrl ? (
          <video
            ref={videoRef}
            className="w-full max-h-[70vh] object-contain mx-auto block"
            controls
            onEnded={handleVideoEnded}
          >
            <source src={currentLecture.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No video available</p>
          </div>
        )}
      </div>

      {/* ── Bottom info + controls ────────────────────────────────────────── */}
      <div className="flex-1 bg-slate-900 px-6 py-6 max-w-5xl mx-auto w-full space-y-4">

        {/* Lecture meta */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">

            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Lecture {currentIdx + 1} of {lectures.length}
              </span>
              {isFree && (
                <span className="flex items-center gap-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  <Eye size={10} /> Free Preview
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-white leading-snug">
              {currentLecture?.title}
            </h2>

            {/* Duration */}
            {currentLecture?.duration > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock size={12} />
                {formatDuration(currentLecture.duration)}
              </div>
            )}
          </div>

          {/* Mark Complete */}
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={15} />
              Completed
            </div>
          ) : (
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white px-4 py-2 rounded-xl transition duration-200"
            >
              {markingComplete ? (
                <><Loader2 size={14} className="animate-spin" />Saving...</>
              ) : (
                <><CheckCircle2 size={14} />Mark Complete</>
              )}
            </button>
          )}
        </div>

        {/* Description */}
        {currentLecture?.lectureDescription && (
          <p className="text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
            {currentLecture.lectureDescription}
          </p>
        )}

        {/* Prev / Next */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition px-3 py-2 rounded-xl hover:bg-slate-800"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIdx === lectures.length - 1}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition px-3 py-2 rounded-xl hover:bg-slate-800"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default LecturePlayerPage;