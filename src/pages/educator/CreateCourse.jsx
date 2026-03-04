import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Video, CheckCircle2, ChevronRight } from "lucide-react";
import CourseForm from "../../components/educator/CourseForm";
import LectureList from "../../components/educator/LectureList";
import LectureFormModal from "../../components/educator/LectureFormModal";

// ─── Step Indicator ───────────────────────────────────────────────────────────

const steps = [
  { id: 1, label: "Course Details", icon: BookOpen },
  { id: 2, label: "Add Lectures",   icon: Video    },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center gap-2">
    {steps.map((step, index) => {
      const isDone   = currentStep > step.id;
      const isActive = currentStep === step.id;
      const Icon     = step.icon;

      return (
        <div key={step.id} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition duration-200 ${
              isDone
                ? "bg-emerald-100 text-emerald-700"
                : isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {isDone ? <CheckCircle2 size={13} /> : <Icon size={13} />}
            {step.label}
          </div>
          {index < steps.length - 1 && (
            <ChevronRight
              size={14}
              className={currentStep > step.id ? "text-emerald-400" : "text-slate-300"}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─── CreateCourse ─────────────────────────────────────────────────────────────

const CreateCourse = () => {
  const [step, setCourse_step]        = useState(1);
  const [course, setCourse]           = useState(null);
  const [lectures, setLectures]       = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLecture, setEditLecture] = useState(null);

  // ── Callbacks ─────────────────────────────────────────────────────────────

  const handleCourseCreated = (createdCourse) => {
    setCourse(createdCourse);
    setCourse_step(2);
  };

  const handleAddLecture = () => {
    setEditLecture(null);
    setIsModalOpen(true);
  };

  const handleEditLecture = (lecture) => {
    setEditLecture(lecture);
    setIsModalOpen(true);
  };

  const handleLectureAdded = (lecture) => {
    setLectures((prev) => [...prev, lecture]);
  };

  const handleLectureUpdated = (updated) => {
    setLectures((prev) =>
      prev.map((l) => (l._id === updated._id ? updated : l))
    );
  };

  const handleLectureDeleted = (id) => {
    setLectures((prev) => prev.filter((l) => l._id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditLecture(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Create Course</h1>
          <p className="text-slate-400 text-sm mt-1">
            Fill in your course details, then add lectures.
          </p>
        </div>
        <StepIndicator currentStep={step} />
      </div>

      {/* ── Step 1 — Course Details ── */}
      {step === 1 && (
        <CourseForm onCourseCreated={handleCourseCreated} />
      )}

      {/* ── Step 2 — Lectures ── */}
      {step === 2 && course && (
        <>
          {/* Course summary card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            {course.thumbnail?.url && (
              <img
                src={course.thumbnail.url}
                alt={course.title}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-200"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {course.title}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {course.category}
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                  {course.level}
                </span>
                <span className="text-xs text-slate-400">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
              Draft
            </span>
          </div>

          {/* Lecture list */}
          <LectureList
            lectures={lectures}
            onAddLecture={handleAddLecture}
            onEditLecture={handleEditLecture}
            onLectureDeleted={handleLectureDeleted}
          />

          {/* Back link */}
          <div className="flex justify-start">
            <Link
              to="/educator/courses"
              className="text-sm text-slate-400 hover:text-indigo-600 font-medium transition"
            >
              ← Back to My Courses
            </Link>
          </div>
        </>
      )}

      {/* ── Lecture Modal ── */}
      <LectureFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        courseId={course?._id}
        nextOrder={lectures.length + 1}
        editLecture={editLecture}
        onLectureAdded={handleLectureAdded}
        onLectureUpdated={handleLectureUpdated}
      />
    </div>
  );
};

export default CreateCourse;