import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Bed, Edit, Save, X, Loader2 } from "lucide-react";
import { supabase } from "../supabase";

const BedManagement = () => {
  const { user } = useOutletContext();
  const [beds, setBeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [formData, setFormData] = useState({ total: "", available: "" });

  // 1. Fetch Beds Logic
  const fetchBeds = async () => {
    try {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("hospital_beds")
        .select("*")
        .eq("hospital_id", user.id)
        .maybeSingle();

      if (data) {
        setBeds(data);
      }
    } catch (err) {
      console.error("Error loading beds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchBeds();
  }, [user?.id]);

  // 2. Calculation Logic (Safe for undefined)
  const totalAll =
    (beds?.general_total || 0) +
    (beds?.icu_total || 0) +
    (beds?.emergency_total || 0);
  const availAll =
    (beds?.general_available || 0) +
    (beds?.icu_available || 0) +
    (beds?.emergency_available || 0);
  const occupiedAll = totalAll - availAll;

  const openEdit = (ward) => {
    setEditingWard(ward);
    setFormData({
      total: beds[`${ward}_total`],
      available: beds[`${ward}_available`],
    });
    setShowModal(true);
  };

  const saveBeds = async () => {
    try {
      const updatedData = {
        [`${editingWard}_total`]: Number(formData.total),
        [`${editingWard}_available`]: Number(formData.available),
      };

      const { error } = await supabase
        .from("hospital_beds")
        .update(updatedData)
        .eq("hospital_id", user.id);

      if (!error) {
        setBeds({ ...beds, ...updatedData });
        setShowModal(false);
      }
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (loading || !beds) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">
          Connecting to Database...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
        <Bed className="w-10 h-10" />
        <span>Bed Management</span>
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="emergency-card p-8 text-center bg-white rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Total Beds</h3>
          <div className="text-4xl font-bold text-navy">{totalAll}</div>
        </div>
        <div className="emergency-card p-8 text-center bg-white rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Available</h3>
          <div className="text-4xl font-bold text-green-600">{availAll}</div>
        </div>
        <div className="emergency-card p-8 text-center bg-white rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Occupied</h3>
          <div className="text-4xl font-bold text-red-600">{occupiedAll}</div>
        </div>
      </div>

      {/* Ward Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {["general", "icu", "emergency"].map((ward) => (
          <div
            key={ward}
            className="emergency-card p-8 bg-white rounded-3xl shadow-sm"
          >
            <h3 className="text-xl font-bold text-navy mb-6 capitalize">
              {ward} Ward
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{beds[`${ward}_total`]}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Available:</span>
                <span className="font-bold">{beds[`${ward}_available`]}</span>
              </div>
            </div>
            <button
              onClick={() => openEdit(ward)}
              className="mt-6 w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Edit size={18} /> Edit Beds
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[400px] p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-6 text-center">
              Update {editingWard}
            </h2>
            <div className="space-y-4">
              <input
                type="number"
                value={formData.total}
                onChange={(e) =>
                  setFormData({ ...formData, total: e.target.value })
                }
                className="w-full border p-3 rounded-xl"
                placeholder="Total Beds"
              />
              <input
                type="number"
                value={formData.available}
                onChange={(e) =>
                  setFormData({ ...formData, available: e.target.value })
                }
                className="w-full border p-3 rounded-xl"
                placeholder="Available Beds"
              />
            </div>
            <button
              onClick={saveBeds}
              className="mt-6 w-full btn-primary py-3 rounded-xl bg-red-600 text-white font-bold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
