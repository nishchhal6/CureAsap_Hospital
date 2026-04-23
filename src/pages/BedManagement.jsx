import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Bed, Edit, Save, X, Loader2 } from "lucide-react";
import { supabase } from "../supabase";

const BedManagement = () => {
  // Outlet context se user lene ki koshish
  const { user: contextUser } = useOutletContext() || {};
  const [beds, setBeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [formData, setFormData] = useState({ total: "", available: "" });

  // 1. Fetch Beds Logic (Function ko thoda robust banaya hai)
  const fetchBeds = useCallback(async (userId) => {
    try {
      setLoading(true);
      console.log("Fetching beds for ID:", userId);

      let { data, error } = await supabase
        .from("hospital_beds")
        .select("*")
        .eq("hospital_id", userId)
        .maybeSingle();

      if (error) throw error;

      // Agar data nahi hai, toh automatic row create karo
      if (!data) {
        console.log("No row found, inserting default data...");
        const { data: newData, error: insertError } = await supabase
          .from("hospital_beds")
          .insert([
            {
              hospital_id: userId,
              general_total: 150,
              general_available: 110,
              icu_total: 50,
              icu_available: 30,
              emergency_total: 50,
              emergency_available: 40,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        data = newData;
      }

      setBeds(data);
    } catch (err) {
      console.error("Bed Management Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Auth Sync logic (Loading spinner ko khatam karne ke liye)
  useEffect(() => {
    const initFetch = async () => {
      // Pehle dekho context mein user hai?
      if (contextUser?.id) {
        fetchBeds(contextUser.id);
      } else {
        // Agar nahi, toh direct session se uthao
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          fetchBeds(session.user.id);
        } else {
          console.error("User not found in Context or Session");
          setLoading(false);
        }
      }
    };

    initFetch();
  }, [contextUser, fetchBeds]);

  // 3. Calculation Logic
  const totalAll =
    (beds?.general_total || 0) +
    (beds?.icu_total || 0) +
    (beds?.emergency_total || 0);
  const availAll =
    (beds?.general_available || 0) +
    (beds?.icu_available || 0) +
    (beds?.emergency_available || 0);
  const occupiedAll = totalAll - availAll;

  // 4. Update Logic
  const saveBeds = async () => {
    try {
      const hId =
        contextUser?.id || (await supabase.auth.getUser()).data.user?.id;
      const updatedData = {
        [`${editingWard}_total`]: Number(formData.total),
        [`${editingWard}_available`]: Number(formData.available),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("hospital_beds")
        .update(updatedData)
        .eq("hospital_id", hId);

      if (error) throw error;

      setBeds({ ...beds, ...updatedData });
      setShowModal(false);
      alert("Database Updated Successfully! 🚑");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const openEdit = (ward) => {
    setEditingWard(ward);
    setFormData({
      total: beds[`${ward}_total`],
      available: beds[`${ward}_available`],
    });
    setShowModal(true);
  };

  if (loading && !beds) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium italic">
          Syncing with Hospital Database...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <Bed className="w-10 h-10 text-red-600" />
          <span>Bed Management</span>
        </h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-navy text-center">
          <p className="text-gray-500 font-semibold mb-1">Total Capacity</p>
          <div className="text-4xl font-black text-navy">{totalAll}</div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-green-500 text-center">
          <p className="text-gray-500 font-semibold mb-1">Available Now</p>
          <div className="text-4xl font-black text-green-600">{availAll}</div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border-b-4 border-red-500 text-center">
          <p className="text-gray-500 font-semibold mb-1">Occupied</p>
          <div className="text-4xl font-black text-red-600">{occupiedAll}</div>
        </div>
      </div>

      {/* Ward Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {["general", "icu", "emergency"].map((ward) => (
          <div
            key={ward}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <h3 className="text-xl font-bold text-navy mb-6 capitalize border-l-4 border-red-600 pl-3">
              {ward} Ward
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold text-navy">
                  {beds[`${ward}_total`]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">Available:</span>
                <span className="text-xl font-bold text-green-600">
                  {beds[`${ward}_available`]}
                </span>
              </div>
            </div>
            <button
              onClick={() => openEdit(ward)}
              className="mt-8 w-full bg-red-700 hover:bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Edit size={18} /> Update Beds
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-navy capitalize">
                Edit {editingWard}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-red-100 transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 tracking-widest ml-1 uppercase">
                  Total Beds
                </label>
                <input
                  type="number"
                  value={formData.total}
                  onChange={(e) =>
                    setFormData({ ...formData, total: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-red-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 tracking-widest ml-1 uppercase">
                  Available Now
                </label>
                <input
                  type="number"
                  value={formData.available}
                  onChange={(e) =>
                    setFormData({ ...formData, available: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-green-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-lg"
                />
              </div>
            </div>

            <button
              onClick={saveBeds}
              className="mt-10 w-full bg-red-700 hover:bg-red-800 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-200 transition-all"
            >
              <Save size={22} />
              Confirm Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
