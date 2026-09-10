import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Companies from "./pages/Companies";

import Footer from "./components/Footer";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// ==========================
// Company Details
// ==========================
import CompanyDetails from "./pages/AdminPanel/CompanyDetails";

// ==========================
// Candidate
// ==========================
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";
import CandidateApplications from "./pages/CandidateDashboard/CandidateApplications";
import SavedJobs from "./pages/CandidateDashboard/SavedJobs";
import CandidateProfile from "./pages/CandidateDashboard/CandidateProfile";
import CandidateSettings from "./pages/CandidateDashboard/CandidateSettings";

// ==========================
// Employer
// ==========================
import JobApplications from "./pages/employer/JobApplications";
import CompanyProfile from "./pages/employer/CompanyProfile";
import Messages from "./pages/employer/Messages";
import Dashboard from "./pages/employer/dashboard";
import PostJob from "./pages/employer/PostJob";
import MyJobs from "./pages/employer/MyJobs";
import EditJob from "./pages/employer/EditJob";
import Analytics from "./pages/employer/Analytics";
import Settings from "./pages/employer/Settings";
import Interviews from "./pages/employer/Interviews";

// ==========================
// Admin
// ==========================
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import Applications from "./pages/AdminPanel/Applications";

function App() {
  return (
    <>
      <Routes>
        {/* ==========================================
            PUBLIC PAGES
        ========================================== */}

        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />

        {/* URL Aliases for friendly navigation */}
        <Route
          path="/applications"
          element={<Navigate to="/candidate-applications" replace />}
        />
        <Route
          path="/profile"
          element={<Navigate to="/candidate-profile" replace />}
        />
        <Route
          path="/signup"
          element={<Navigate to="/register" replace />}
        />

        {/* ==========================================
            CANDIDATE (PROTECTED)
        ========================================== */}

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-applications"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-profile"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-settings"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateSettings />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            EMPLOYER (PROTECTED)
        ========================================== */}

        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/analytics"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/schedule-interview"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Interviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/schedule-interview/:jobId"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Interviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/company-profile"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/messages"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/settings"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applications/:jobId"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <JobApplications />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            ADMIN (PROTECTED)
        ========================================== */}

        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-panel/applications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-panel/companies/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            MESSAGES (AUTHENTICATED)
        ========================================== */}

        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRoles={["candidate", "recruiter", "admin"]}>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages/:userId"
          element={
            <ProtectedRoute allowedRoles={["candidate", "recruiter", "admin"]}>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            404 NOT FOUND
        ========================================== */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ==========================================
          FOOTER
      ========================================== */}
      <Footer />
    </>
  );
}

export default App;
