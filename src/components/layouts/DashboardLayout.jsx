import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Hospital,
  User,
  Bed,
  Truck,
  Users,
  AlertCircle,
  Bell,
  Edit3,
  Save,
  X,
} from "lucide-react";

const DashboardLayout = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const { logout, currentUser } = useAuth();

  const [user, setUser] = useState({
    hospital: "Apollo Hospitals",
    name: currentUser?.email?.split("@")[0] || "Hospital Admin",
    role: "Admin",
    qualifications: "MBBS, MD (Cardiology)",
    experience: "8 Years",
    phone: "+91 98765 43210",
    alerts: 3,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Hospital, path: "/" },
    { id: "beds", title: "Bed Management", icon: Bed, path: "/beds" },
    {
      id: "drivers",
      title: "Driver Management",
      icon: Users,
      path: "/drivers",
    },
    {
      id: "ambulance",
      title: "Ambulance Management",
      icon: Truck,
      path: "/ambulance",
    },
    { id: "patients", title: "Patient Records", icon: User, path: "/patients" },
    {
      id: "emergencies",
      title: "Emergency Requests",
      icon: AlertCircle,
      path: "/emergencies",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New emergency request",
      time: "2 min ago",
      type: "emergency",
    },
    { id: 2, title: "Bed ICU-12 cleaned", time: "15 min ago", type: "bed" },
    {
      id: 3,
      title: "Driver Ravi Kumar arrived",
      time: "1 hr ago",
      type: "driver",
    },
  ];

  const toggleEditProfile = () => {
    if (editingProfile) {
      localStorage.setItem("hospitalUser", JSON.stringify(user));
    }
    setEditingProfile(!editingProfile);
  };

  const handleProfileChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="flex flex-col w-80 bg-white border-r border-slate-200 shadow-2xl">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-red-600 rounded-2xl flex items-center justify-center">
              <Hospital className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-bold text-xl text-navy">{user.hospital}</h2>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-red-50 hover:text-primary"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="ml-3 font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div
          className="mt-auto p-4 border-t border-slate-200 cursor-pointer hover:bg-slate-50"
          onClick={() => setShowProfileModal(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-red-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>

            <div>
              <p className="font-bold text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <Edit3 className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between relative z-40">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 hover:bg-slate-100 rounded-xl"
            >
              <Bell className="w-6 h-6" />

              {user.alerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                  {user.alerts}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications ({user.alerts})
                  </h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-6 py-4 hover:bg-slate-50 border-b border-slate-100 last:border-none"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            notif.type === "emergency"
                              ? "bg-red-100 text-red-600"
                              : notif.type === "bed"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                          }`}
                        >
                          {notif.type === "emergency" ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : notif.type === "bed" ? (
                            <Bed className="w-5 h-5" />
                          ) : (
                            <Truck className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-sm">{notif.title}</p>
                          <p className="text-xs text-gray-500">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[420px] p-6 shadow-2xl relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center mb-5">
              Doctor Profile
            </h2>

            <div className="space-y-4">
              <input
                name="name"
                value={user.name}
                disabled={!editingProfile}
                onChange={handleProfileChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="qualifications"
                value={user.qualifications}
                disabled={!editingProfile}
                onChange={handleProfileChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="experience"
                value={user.experience}
                disabled={!editingProfile}
                onChange={handleProfileChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="phone"
                value={user.phone}
                disabled={!editingProfile}
                onChange={handleProfileChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={toggleEditProfile}
                className="flex-1 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {editingProfile ? <Save size={18} /> : <Edit3 size={18} />}
                {editingProfile ? "Save" : "Edit"}
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 border border-red-400 text-red-600 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
