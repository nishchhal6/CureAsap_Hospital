import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../supabase";
import {
  AlertCircle,
  MapPin,
  Truck,
  Video,
  PlayCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";

const EmergencyRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningRequestId, setAssigningRequestId] = useState(null);

  // FETCH LOGIC: Updated to include ALL live journey statuses
  const fetchEmergencyRequests = useCallback(async () => {
    try {
      const hospitalId = currentUser?.hospitalId || currentUser?.id;
      if (!hospitalId) return;

      setLoading(true);

      // 1. Beds Fetch Logic
      const { data: bedData, error: bedErr } = await supabase
        .from("hospital_beds")
        .select("general_available, icu_available, emergency_available")
        .eq("hospital_id", hospitalId)
        .maybeSingle();

      if (bedErr) throw bedErr;

      // 2. Logic: Agar bed 0 hain toh requests mat dikhao
      const totalAvail =
        (bedData?.general_available || 0) +
        (bedData?.icu_available || 0) +
        (bedData?.emergency_available || 0);

      if (totalAvail <= 0 && bedData) {
        // bedData check taaki first time user block na ho
        setRequests([]);
        setLoading(false);
        return;
      }

      // 3. Requests Fetch Logic
      const { data, error: reqErr } = await supabase
        .from("emergency_requests")
        .select("*")
        .or(
          `status.eq.pending,and(accepted_by_hospital_id.eq.${hospitalId},status.neq.completed,status.neq.rejected)`,
        )
        .order("created_at", { ascending: false });

      if (reqErr) throw reqErr;
      setRequests(data || []);
    } catch (err) {
      // Yahan 'err' use ho raha hai
      console.error("Error fetching requests:", err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchAvailableDrivers = useCallback(async () => {
    if (!currentUser?.id) return;
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .eq("hospital_id", currentUser.id)
      .eq("status", "available");
    setDrivers(data || []);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.id) return;

    fetchEmergencyRequests();
    fetchAvailableDrivers();

    const channel = supabase
      .channel(`emergency-updates-all`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergency_requests" },
        () => fetchEmergencyRequests(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "drivers" },
        () => fetchAvailableDrivers(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hospital_beds",
          filter: `hospital_id=eq.${currentUser.id}`,
        },
        () => fetchEmergencyRequests(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, fetchEmergencyRequests, fetchAvailableDrivers]);

  const openVideoModal = (emergency) => {
    setCurrentVideo(emergency);
    setShowVideo(true);
  };

  const closeVideoModal = () => {
    setShowVideo(false);
    setCurrentVideo(null);
  };

  const acceptEmergency = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const hospitalId = currentUser?.hospitalId || currentUser?.id;

      if (!hospitalId) {
        alert("Error: Hospital ID missing.");
        return;
      }

      const { error } = await supabase
        .from("emergency_requests")
        .update({
          status: "accepted",
          accepted_by_hospital_id: hospitalId,
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      // --- YE LINE ADD KAREIN (UI UPDATE KE LIYE) ---
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "accepted" } : req,
        ),
      );
      // ----------------------------------------------

      setAssigningRequestId(requestId);
      setShowAssignModal(true);
      if (showVideo) closeVideoModal();
    } catch (error) {
      alert("Accepting failed: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const assignDriverToRequest = async (driverId) => {
    try {
      setActionLoadingId(assigningRequestId);

      const { error: reqError } = await supabase
        .from("emergency_requests")
        .update({
          status: "driver_assigned",
          assigned_driver_id: driverId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assigningRequestId);

      if (reqError) throw reqError;

      await supabase
        .from("drivers")
        .update({ status: "busy" })
        .eq("id", driverId);

      // --- YE SECTION ADD KAREIN (INSTANT UI UPDATE) ---
      setRequests((prev) =>
        prev.map((req) =>
          req.id === assigningRequestId
            ? {
                ...req,
                status: "driver_assigned",
                assigned_driver_id: driverId,
              }
            : req,
        ),
      );
      // -------------------------------------------------

      setShowAssignModal(false);
      setAssigningRequestId(null);
      // Alert hata sakte hain agar aapko annoyance lag rahi ho
      alert("✅ Driver Assigned! Status updated.");
    } catch (error) {
      alert("Assignment failed: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const rejectEmergency = async (requestId) => {
    try {
      setActionLoadingId(requestId);
      const { error } = await supabase
        .from("emergency_requests")
        .update({
          status: "rejected",
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;
    } catch (error) {
      alert("Rejection failed: " + error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  // STATUS HELPER: Isse badge ke colors handle honge
  const getStatusStyle = (status) => {
    switch (status) {
      case "driver_assigned":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "on_the_way":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "reached_patient":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "patient_onboard":
        return "bg-teal-50 text-teal-700 border-teal-100";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <>
      <div className="space-y-5">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <AlertCircle className="w-10 h-10 text-red-600" />
          <span>Emergency Requests</span>
        </h1>

        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">
              No active emergency requests
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((emergency) => {
              const isProcessing = actionLoadingId === emergency.id;
              const hasVideo = !!emergency.video_url;
              const isJourneyStarted = [
                "driver_assigned",
                "on_the_way",
                "reached_patient",
                "patient_onboard",
              ].includes(emergency.status);

              return (
                <div
                  key={emergency.id}
                  className="emergency-card p-8 border-4 border-transparent hover:border-red-200 group bg-white rounded-3xl shadow-sm"
                >
                  <div className="flex items-center justify-center mb-8 p-3 bg-red-50/50 rounded-2xl border-2 border-red-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-navy text-center">
                      {emergency.citizen_name || "Emergency Request"}
                    </h3>

                    <div className="flex items-center justify-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <Truck className="w-6 h-6 text-gray-500" />
                      <span className="font-semibold text-base">
                        {isJourneyStarted
                          ? "Ambulance Dispatched"
                          : "Awaiting Driver"}
                      </span>
                    </div>

                    <div className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-navy text-center">
                        {emergency.citizen_address}
                      </span>
                    </div>

                    <div className="text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyle(emergency.status)}`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        Status:{" "}
                        {emergency.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {emergency.video_url && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3 text-red-600">
                        <Video className="w-5 h-5 animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider">
                          Live SOS Clip (Portrait)
                        </span>
                      </div>

                      {/* Container ko Portrait (9:16) shape mein rakha hai */}
                      <div
                        className="relative mx-auto overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-black shadow-2xl shadow-red-100/50"
                        style={{ width: "280px", aspectRatio: "9/16" }}
                      >
                        <video
                          src={emergency.video_url}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />

                        {/* Ek chota sa red 'REC' dot effect ke liye (Optional) */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                          <span className="text-[10px] text-white font-bold">
                            LIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-200">
                    {emergency.status === "pending" && (
                      <>
                        <button
                          onClick={() => acceptEmergency(emergency.id)}
                          disabled={isProcessing}
                          className="btn-primary flex-1 py-4 text-base font-bold"
                        >
                          {isProcessing ? "..." : "Accept Emergency"}
                        </button>
                        <button
                          onClick={() => rejectEmergency(emergency.id)}
                          className="px-8 py-4 border border-slate-300 text-gray-700 font-semibold rounded-2xl flex-1"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {emergency.status === "accepted" && (
                      <button
                        onClick={() => {
                          setAssigningRequestId(emergency.id);
                          setShowAssignModal(true);
                        }}
                        className="btn-primary w-full py-4 text-base font-bold bg-navy"
                      >
                        Assign Driver Now
                      </button>
                    )}

                    {isJourneyStarted && (
                      <div className="w-full text-center py-4 bg-green-50 text-green-700 font-bold rounded-2xl border border-green-200 flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        <span>Driver is Tracking Patient</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Driver Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-navy mb-6 text-center">
              Assign Available Driver
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-2">
              {drivers.length > 0 ? (
                drivers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => assignDriverToRequest(d.id)}
                    className="w-full text-left p-4 border-2 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <p className="font-bold text-navy group-hover:text-blue-700">
                        {d.name}
                      </p>
                      <p className="text-xs text-slate-500">{d.vehicle}</p>
                    </div>
                    <CheckCircle className="text-green-500 opacity-0 group-hover:opacity-100" />
                  </button>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">
                  No available drivers found.
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAssignModal(false)}
              className="w-full py-3 text-slate-400 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyRequests;
