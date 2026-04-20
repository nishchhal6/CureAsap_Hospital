import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase, supabaseAdmin } from "../supabase";
import {
  Users,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Loader2,
  Truck,
  Mail,
  Lock,
} from "lucide-react";

const DriverManagement = () => {
  const { currentUser } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      if (!currentUser?.id) {
        console.log("Waiting for User ID...");
        return;
      }

      console.log("Fetching drivers for Hospital ID:", currentUser.id);

      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("hospital_id", currentUser.id) // Ensure karo column name exact yahi ho
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Drivers found:", data);
      setDrivers(data || []);
    } catch (e) {
      console.error("Fetch Error details:", e);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    // Jab tak currentUser ya uski ID na mile, fetch mat karo
    if (currentUser?.id) {
      fetchDrivers();

      const channel = supabase
        .channel("driver-status-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "drivers",
            filter: `hospital_id=eq.${currentUser.id}`, // Seedhe ID use karo
          },
          () => fetchDrivers(),
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [currentUser?.id, fetchDrivers]);

  const toggleStatus = async (driverId, currentStatus) => {
    try {
      const newStatus = currentStatus === "available" ? "offline" : "available";
      const { error } = await supabase
        .from("drivers")
        .update({ status: newStatus })
        .eq("id", driverId);
      if (error) throw error;
    } catch (e) {
      alert("Toggle failed: " + e.message);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const vehicle = formData.get("vehicle");

    try {
      setActionLoading(true);

      // 1. FIXED: supabaseAdmin use karein taaki Admin logout na ho
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: "driver",
              hospital_id: currentUser.id, // Hospital linking
            },
          },
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed.");

      const driverUid = authData.user.id;

      // 2. Profile Table mein data insert karein
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: driverUid,
          role: "driver",
          full_name: name,
          email: email,
          phone: phone,
          hospital_id: currentUser.id,
        },
      ]);
      if (profileError) throw profileError;

      // 3. Drivers Table mein entry (is se naya hospital generate nahi hoga)
      const { error: driverTableError } = await supabase
        .from("drivers")
        .upsert({
          id: driverUid,
          name: name,
          vehicle: vehicle,
          hospital_id: currentUser.id,
          status: "available",
        });

      if (driverTableError) throw driverTableError;

      setShowAdd(false);
      fetchDrivers();
      alert("✅ Driver created successfully! You are still logged in.");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-8 p-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
          <div className="p-3 bg-red-50 rounded-2xl">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <span>Driver Management</span>
        </h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-medium">No drivers added yet.</p>
          </div>
        ) : (
          drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <Truck size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {driver.name}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">
                      {driver.vehicle}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${driver.status === "available" ? "bg-green-50 text-green-600 border-green-100" : driver.status === "busy" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}
                >
                  {driver.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Delete this driver? This won't delete their Auth account.",
                      )
                    ) {
                      await supabase
                        .from("drivers")
                        .delete()
                        .eq("id", driver.id);
                      fetchDrivers();
                    }
                  }}
                  className="text-slate-300 hover:text-red-500 p-2 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => toggleStatus(driver.id, driver.status)}
                  disabled={driver.status === "busy"}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${driver.status === "available" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"}`}
                >
                  {driver.status === "available" ? (
                    <ToggleRight size={28} />
                  ) : (
                    <ToggleLeft size={28} />
                  )}
                  <span className="text-sm font-bold uppercase tracking-tight">
                    {driver.status === "available" ? "Online" : "Offline"}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-6 right-6 p-2 text-slate-400"
            >
              <X size={24} />
            </button>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">
                Add New Driver
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Register a new ambulance driver account.
              </p>
            </div>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">
                  Login Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="driver@email.com"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">
                  Initial Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="Driver's full name"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  required
                  placeholder="+91 00000 00000"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">
                  Vehicle Number
                </label>
                <input
                  name="vehicle"
                  required
                  placeholder="UP 80 XX 0000"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500 rounded-2xl px-6 py-4 outline-none transition-all font-medium"
                />
              </div>
              <button
                disabled={actionLoading}
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 transition-all disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    <span>CREATE ACCOUNT</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
