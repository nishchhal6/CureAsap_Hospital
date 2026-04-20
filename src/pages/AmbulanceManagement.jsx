import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext.jsx";
import { Truck, User, Edit3, Plus, X } from "lucide-react";

const AmbulanceManagement = () => {
  const { currentUser } = useAuth();
  const [ambulances, setAmbulances] = useState([]);
  const [drivers, setDrivers] = useState([]); // Available drivers list
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_no: "",
    model: "",
    assigned_driver_id: "",
  });

  useEffect(() => {
    fetchAmbulances();
    fetchDrivers();
  }, [currentUser]);

  const fetchAmbulances = async () => {
    const hospitalId = currentUser?.hospitalId || currentUser?.id;
    const { data } = await supabase
      .from("ambulances")
      .select(`*, drivers(name)`) // Join with drivers table
      .eq("hospital_id", hospitalId);
    setAmbulances(data || []);
    setLoading(false);
  };

  const fetchDrivers = async () => {
    const hospitalId = currentUser?.hospitalId || currentUser?.id;
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .eq("hospital_id", hospitalId);
    setDrivers(data || []);
  };

  const handleAddAmbulance = async (e) => {
    e.preventDefault();
    const hospitalId = currentUser?.hospitalId || currentUser?.id;

    const { error } = await supabase.from("ambulances").insert([
      {
        ...formData,
        hospital_id: hospitalId,
        status: "available",
      },
    ]);

    if (!error) {
      setShowModal(false);
      fetchAmbulances();
      setFormData({ vehicle_no: "", model: "", assigned_driver_id: "" });
    } else {
      alert("Error: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "on-duty":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <Truck className="w-10 h-10 text-primary" />
          <span>Ambulance Fleet</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Ambulance</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ambulances.map((amb) => (
          <div
            key={amb.id}
            className="emergency-card p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-navy uppercase">
                  {amb.vehicle_no}
                </h3>
                <p className="text-sm text-slate-500">{amb.model}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(amb.status)}`}
              >
                {amb.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Assigned Driver
                  </p>
                  <p className="font-semibold text-navy">
                    {amb.drivers?.name || "No Driver Assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-navy text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
                View History
              </button>
              <button className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200">
                <Edit3 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD AMBULANCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-navy"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold text-navy mb-6">
              Register Ambulance
            </h2>
            <form onSubmit={handleAddAmbulance} className="space-y-4">
              <input
                type="text"
                placeholder="Vehicle Number (e.g., UP80-AB-1234)"
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_no: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Model (e.g., Force Traveller)"
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
              <select
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assigned_driver_id: e.target.value,
                  })
                }
              >
                <option value="">Select Permanent Driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full btn-primary py-4 rounded-2xl text-lg font-bold"
              >
                Save Ambulance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceManagement;
