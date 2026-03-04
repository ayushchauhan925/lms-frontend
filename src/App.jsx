import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

// ─── Public Pages ─────────────────────────────────────────
import HomePage          from "./pages/public/HomePage";
import LoginPage         from "./pages/public/LoginPage";
import SignupPage        from "./pages/public/SignupPage";
import TermsOfService    from "./pages/public/TermsOfService";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import ContactUsPage     from "./pages/public/ContactUsPage";
import HelpCenterPage    from "./pages/public/HelpCenterPage";
import FAQPage           from "./pages/public/FAQPage";
import NotFoundPage      from "./pages/public/NotFoundPage";

// ─── Layouts ─────────────────────────────────────────────
import StudentLayout  from "./layouts/StudentLayout";
import EducatorLayout from "./layouts/EducatorLayout";

// ─── Student Pages ───────────────────────────────────────
import StudentDashboard       from "./pages/student/StudentDashboard";
import StudentProfilePage     from "./pages/student/StudentProfilePage";
import StudentSettingsPage    from "./pages/student/StudentSettingsPage";
import StudentPayments        from "./pages/student/StudentPayments";
import StudentCourses         from "./pages/student/StudentCourses";
import ExploreCourses         from "./pages/student/ExploreCourses";
import CourseDetailPage       from "./pages/student/CourseDetailPage";
import CourseLearningPage     from "./pages/student/CourseLearningPage";
import LecturePlayerPage      from "./pages/student/LecturePlayerPage";
import StudentCertificates    from "./pages/student/StudentCertificates";
import StudentCertificateView from "./pages/student/StudentCertificateView";
import StudentReviewsPage     from "./pages/student/StudentReviewsPage";

// ─── Educator Pages ──────────────────────────────────────
import EducatorDashboard         from "./pages/educator/EducatorDashboard";
import EducatorProfilePage       from "./pages/educator/EducatorProfilePage";
import EducatorSettingsPage      from "./pages/educator/EducatorSettingsPage"; // ✅ Added
import EducatorCourses           from "./pages/educator/EducatorCourses";
import EducatorCourseDetail      from "./pages/educator/EducatorCourseDetail";
import CreateCourse              from "./pages/educator/CreateCourse";
import EditCoursePage            from "./pages/educator/EditCoursePage";
import EducatorReviewsPage       from "./pages/educator/EducatorReviewsPage";
import EducatorCourseReviewsPage from "./pages/educator/EducatorCourseReviewsPage";
import EducatorEarningsPage      from "./pages/educator/EducatorEarningsPage";
import EducatorEnrollmentsPage   from "./pages/educator/EducatorEnrollmentsPage";

// ─── Route Guards ────────────────────────────────────────

const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "student") return <Navigate to="/login" replace />;
  return children;
};

const EducatorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "educator") return <Navigate to="/login" replace />;
  return children;
};

// ─── App ─────────────────────────────────────────────────

function App() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>

        {/* ── Public Routes ── */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            user ? (
              user.role === "student"
                ? <Navigate to="/student/dashboard" replace />
                : <Navigate to="/educator/dashboard" replace />
            ) : <LoginPage />
          }
        />

        <Route
          path="/signup"
          element={
            user ? (
              user.role === "student"
                ? <Navigate to="/student/dashboard" replace />
                : <Navigate to="/educator/dashboard" replace />
            ) : <SignupPage />
          }
        />

        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/faqs" element={<FAQPage />} />

        {/* ── Student Routes (With Layout) ── */}
        <Route element={<StudentRoute><StudentLayout /></StudentRoute>}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />
          <Route path="/student/payments" element={<StudentPayments />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/courses/:id" element={<CourseDetailPage />} />
          <Route path="/student/explore" element={<ExploreCourses />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/certificate/:courseId" element={<StudentCertificateView />} />
          <Route path="/student/reviews" element={<StudentReviewsPage />} />
        </Route>

        {/* ── Student Learning (No Layout) ── */}
        <Route element={<StudentRoute><Outlet /></StudentRoute>}>
          <Route path="/student/learn/:courseId" element={<CourseLearningPage />} />
          <Route path="/student/learn/:courseId/lecture/:lectureId" element={<LecturePlayerPage />} />
        </Route>

        {/* ── Educator Routes (With Layout) ── */}
        <Route element={<EducatorRoute><EducatorLayout /></EducatorRoute>}>
          <Route path="/educator/dashboard" element={<EducatorDashboard />} />
          <Route path="/educator/profile" element={<EducatorProfilePage />} />
          <Route path="/educator/settings" element={<EducatorSettingsPage />} /> {/* ✅ Added */}
          <Route path="/educator/courses" element={<EducatorCourses />} />
          <Route path="/educator/courses/create" element={<CreateCourse />} />
          <Route path="/educator/courses/:id" element={<EducatorCourseDetail />} />
          <Route path="/educator/courses/:id/edit" element={<EditCoursePage />} />
          <Route path="/educator/reviews" element={<EducatorReviewsPage />} />
          <Route path="/educator/reviews/:courseId" element={<EducatorCourseReviewsPage />} />
          <Route path="/educator/earnings" element={<EducatorEarningsPage />} />
          <Route path="/educator/enrollments" element={<EducatorEnrollmentsPage />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;