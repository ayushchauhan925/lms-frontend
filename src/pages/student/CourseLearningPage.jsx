import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

import { getCourseById }        from "../../services/course.service";
import { getLecturesByCourse }  from "../../services/lecture.service";
import { getCourseProgress, markLectureCompleted } from "../../services/progress.service";

import PlayerTopBar  from "../../components/student/PlayerTopBar";
import VideoPlayer   from "../../components/student/VideoPlayer";
import LectureList   from "../../components/student/LectureList";
import LectureInfo   from "../../components/student/LectureInfo";
import NavigationBar from "../../components/student/NavigationBar";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="h-screen flex flex-col bg-slate-900 animate-pulse">
    {/* Top bar skeleton */}
    <div className="h-14 bg-slate-800 border-b border-slate-700" />
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 p-6 space-y-4">
        <div className="w-full max-w-3xl mx-auto aspect-video bg-slate-700 rounded-2xl" />
        <div className="h-24 bg-slate-800 rounded-2xl" />
        <div className="h-14 bg-slate-800 rounded-2xl" />
      </div>
      <div className="w-72 border-l border-slate-700 bg-slate-800" />
    </div>
  </div>
);

// ─── CourseLearningPage ───────────────────────────────────────────────────────

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate     = useNavigate();

  const [course, setCourse]                   = useState(null);
  const [lectures, setLectures]               = useState([]);
  const [currentIdx, setCurrentIdx]           = useState(0);
  const [completedIds, setCompletedIds]       = useState(new Set());
  const [loading, setLoading]                 = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  // ── Fetch all data on mount ───────────────────────────────────────────────

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

        const ids = new Set(
          (progressRes.completedLectureIds || []).map((id) =>
            typeof id === "object" ? id._id || id.toString() : id
          )
        );
        setCompletedIds(ids);

        if (progressRes.lastWatchedLectureId) {
          const lastId =
            typeof progressRes.lastWatchedLectureId === "object"
              ? progressRes.lastWatchedLectureId._id || progressRes.lastWatchedLectureId.toString()
              : progressRes.lastWatchedLectureId;
          const idx = lecturesRes.findIndex((l) => l._id === lastId);
          if (idx !== -1) setCurrentIdx(idx);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) return <Skeleton />;

  const currentLecture = lectures[currentIdx];

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectLecture = (lec) => {
    const idx = lectures.findIndex((l) => l._id === lec._id);
    if (idx !== -1) setCurrentIdx(idx);
  };

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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-slate-800 border-b border-slate-700">

        {/* Learnify brand strip */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-700/60">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">Learnify</span>
          </button>
          <span className="text-xs text-slate-400 hidden sm:block">Course Player</span>
        </div>

        {/* Progress bar */}
        <PlayerTopBar
          courseTitle={course?.title || ""}
          completedCount={completedIds.size}
          totalCount={lectures.length}
        />
      </div>

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left — Player ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-slate-900 p-6 space-y-4">

          {/* Video */}
          <div className="max-w-3xl mx-auto">
            <VideoPlayer
              videoUrl={currentLecture?.videoUrl}
              lectureId={currentLecture?._id}
              courseId={courseId}
              onEnded={handleVideoEnded}
            />
          </div>

          {/* Lecture info + nav — light card on dark bg */}
          <div className="max-w-3xl mx-auto space-y-3">
            <LectureInfo
              lecture={currentLecture}
              index={currentIdx + 1}
            />
            <NavigationBar
              onPrev={handlePrev}
              onNext={handleNext}
              onMarkComplete={handleMarkComplete}
              hasPrev={currentIdx > 0}
              hasNext={currentIdx < lectures.length - 1}
              isCompleted={completedIds.has(currentLecture?._id)}
              markingComplete={markingComplete}
            />
          </div>

        </div>

        {/* ── Right — Lecture List ───────────────────────────────────────── */}
        <div className="w-72 flex-shrink-0 overflow-hidden border-l border-slate-700">
          <LectureList
            lectures={lectures}
            currentLectureId={currentLecture?._id}
            completedIds={completedIds}
            onSelect={handleSelectLecture}
          />
        </div>

      </div>
    </div>
  );
};

export default CourseLearningPage;