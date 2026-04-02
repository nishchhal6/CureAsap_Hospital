import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import DashboardLayout from './components/layouts/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BedManagement from './pages/BedManagement.jsx'
import DriverManagement from './pages/DriverManagement.jsx'
import AmbulanceManagement from './pages/AmbulanceManagement.jsx'
import PatientRecords from './pages/PatientRecords.jsx'
import EmergencyRequests from './pages/EmergencyRequests.jsx'
import Reports from './pages/Reports.jsx'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardLayout />}>
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
  )
}

export default App
