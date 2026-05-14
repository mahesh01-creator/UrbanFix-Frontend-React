import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import UserLogin from "../pages/auth/user/UserLogin";
import UserRegister from "../pages/auth/user/UserRegister";
import AdminLogin from "../pages/auth/admin/AdminLogin";
// import AdminRegister from "../pages/auth/admin/AdminRegister";
import WorkerLogin from "../pages/auth/worker/WorkerLogin";
import WorkerRegister from "../pages/auth/worker/WorkerRegister";

import Profile from "../components/common/Profile";

// User Pages
import UserDashboard from "../pages/user/Dashboard";
import Feedback from "../pages/user/Feedback";
import IssueComplaint from "../pages/user/IssueComplaint";
import MyComplaints from "../pages/user/MyComplaints";
import TrackComplaint from "../pages/user/TrackComplaint";


// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AllComplaints from "../pages/admin/AllComplaints";
import AssignWorkers from "../pages/admin/AssignWorker";
import Monitor from "../pages/admin/Monitor";
import VerifyComplaint from "../pages/admin/VerifyComplaint";
import WorkerManagement from "../pages/admin/WorkerManagement";
import ComplaintDetails from "../pages/admin/ComplaintDetails";


// Worker Pages
import ComplaintsHistory from "../pages/worker/AllComplaints";
import AssignedComplaints from "../pages/worker/AssignedComplaints";
import WorkerDashboard from "../pages/worker/Dashboard";
import ResolveComplaint from "../pages/worker/ResolveComplaint";
import UpdateLocation from "../pages/worker/UpdateLocation";



// Public
import LandingPage from "../pages/Landing/UserLandingPage";
import AdminLanding from "../pages/Landing/AdminLanding";
import WorkerLanding from "../pages/Landing/WorkerLanding";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminLanding />} />
      <Route path="/worker" element={<WorkerLanding />} />

      {/* User Auth Routes */}
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />

      {/* Admin Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* <Route path="/admin/register" element={<AdminRegister />} /> */}

      {/* Worker Auth Routes */}
      <Route path="/worker/login" element={<WorkerLogin />} />
      <Route path="/worker/register" element={<WorkerRegister />} />

      {/* Protected User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/issue-Complaint"
        element={
          <ProtectedRoute role="USER">
            <IssueComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/my-complaints"
        element={
          <ProtectedRoute role="USER">
            <MyComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/Feedback"
        element={
          <ProtectedRoute role="USER">
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/track-complaint"
        element={
          <ProtectedRoute role="USER">
            <TrackComplaint />
          </ProtectedRoute>
        }
      />
     

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/complaint/:id"
  element={
    <ProtectedRoute role="ADMIN">
      <ComplaintDetails />
    </ProtectedRoute>
  }
/>
      <Route
        path="/admin/verify-complaint"
        element={
          <ProtectedRoute role="ADMIN">
            <VerifyComplaint />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/all-Complaints"
        element={
          <ProtectedRoute role="ADMIN">
            <AllComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assignWorkers"
        element={
          <ProtectedRoute role="ADMIN">
            <AssignWorkers />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/workersManagement"
        element={
          <ProtectedRoute role="ADMIN">
            <WorkerManagement />
          </ProtectedRoute>
        }
      />

        <Route
        path="/admin/Monitor"
        element={
          <ProtectedRoute role="ADMIN">
            <Monitor />
          </ProtectedRoute>
        }
        
      />
     

        {/* Protected Worker Routes */}
      <Route
        path="/worker/all-complaints"
        element={
          <ProtectedRoute role="WORKER">
            <ComplaintsHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worker/assigned-complaints"
        element={
          <ProtectedRoute role="WORKER">
            <AssignedComplaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/worker/resolve/:id"
        element={
          <ProtectedRoute role="WORKER">
            <ResolveComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/update-location"
        element={
          <ProtectedRoute role="WORKER">
            <UpdateLocation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute role="WORKER">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/worker/profile" element={<Profile />} />
    </Routes>
  );
}