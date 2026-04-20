import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./components/layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BedManagement from "./pages/BedManagement.jsx";
import DriverManagement from "./pages/DriverManagement.jsx";
import AmbulanceManagement from "./pages/AmbulanceManagement.jsx";
import PatientRecords from "./pages/PatientRecords.jsx";
import EmergencyRequests from "./pages/EmergencyRequests.jsx";
import Reports from "./pages/Reports.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return currentUser ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="beds" element={<BedManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="ambulance" element={<AmbulanceManagement />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="emergencies" element={<EmergencyRequests />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
