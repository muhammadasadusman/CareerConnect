
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import Footer from "./components/Footer";

// ==========================
// Public Company
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

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==========================================
            PUBLIC COMPANIES
        ========================================== */}

        <Route
          path="/companies/:id"
          element={<CompanyDetails />}
        />


        {/* ==========================================
            CANDIDATE
        ========================================== */}

        <Route
          path="/candidate-dashboard"
          element={<CandidateDashboard />}
        />

        <Route
          path="/candidate-applications"
          element={<CandidateApplications />}
        />

        <Route
          path="/saved-jobs"
          element={<SavedJobs />}
        />

        <Route
          path="/candidate-profile"
          element={<CandidateProfile />}
        />

        <Route
          path="/candidate-settings"
          element={<CandidateSettings />}
        />


        {/* ==========================================
            EMPLOYER
        ========================================== */}

        <Route
          path="/employer-dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/employer/analytics"
          element={<Analytics />}
        />

        <Route
          path="/post-job"
          element={<PostJob />}
        />

        <Route
          path="/employer/schedule-interview"
          element={<Interviews />}
        />

        <Route
          path="/employer/schedule-interview/:jobId"
          element={<Interviews />}
        />

        <Route
          path="/employer/company-profile"
          element={<CompanyProfile />}
        />

        <Route
          path="/employer/messages"
          element={<Messages />}
        />

        <Route
          path="/employer/settings"
          element={<Settings />}
        />

        <Route
          path="/employer/jobs"
          element={<MyJobs />}
        />

        <Route
          path="/employer/jobs/edit/:id"
          element={<EditJob />}
        />

        <Route
          path="/employer/applications/:jobId"
          element={<JobApplications />}
        />


        {/* ==========================================
            ADMIN
        ========================================== */}

        <Route
          path="/admin-panel"
          element={<AdminPanel />}
        />

        <Route
          path="/admin-panel/applications"
          element={<Applications />}
        />

        <Route
          path="/admin-panel/companies/:id"
          element={<CompanyDetails />}
        />


        {/* ==========================================
            MESSAGES
        ========================================== */}

        <Route
          path="/messages"
          element={<Messages />}
        />

        <Route
          path="/messages/:userId"
          element={<Messages />}
        />


        {/* ==========================================
            404
        ========================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      {/* ==========================================
          FOOTER
          Har page ke neeche automatically
      ========================================== */}

      <Footer />
    </>
  );
}

export default App;

