import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { dummyData } from "../data/dummyData.js";
import { AlertCircle, Bed, Truck, Users } from "lucide-react";
import { supabase } from "../supabase";

const Dashboard = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    emergencies: 0,
    drivers: 0,
    ambulances: 0,
    beds: { available: 180, total: 250 },
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // 1. Auth se ID nikaalna (Sahi ID mil rahi hai console ke hisab se)
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      const hId = authUser?.id;

      if (!hId) return;

      console.log("Fetching REAL data for:", hId);

      // Sabhi counts ek saath fetch karein
      const [eRes, dRes, aRes] = await Promise.all([
        supabase
          .from("emergency_requests")
          .select("*", { count: "exact", head: true })
          .or(`status.eq.pending,accepted_by_hospital_id.eq.${hId}`)
          .not("status", "in", '("completed","rejected")'),
        supabase
          .from("drivers")
          .select("*", { count: "exact", head: true })
          .eq("hospital_id", hId),
        supabase
          .from("ambulances")
          .select("*", { count: "exact", head: true })
          .eq("hospital_id", hId),
      ]);
      const { data: bedData } = await supabase
        .from("hospital_beds")
        .select(
          "general_available, icu_available, emergency_available, general_total, icu_total, emergency_total",
        )
        .eq("hospital_id", hId)
        .maybeSingle();

      const totalAvail =
        (bedData?.general_available ?? 0) +
        (bedData?.icu_available ?? 0) +
        (bedData?.emergency_available ?? 0);

      const totalCapacity =
        (bedData?.general_total ?? 0) +
        (bedData?.icu_total ?? 0) +
        (bedData?.emergency_total ?? 0);

      setCounts((prev) => ({
        ...prev,
        emergencies: eRes.count || 0,
        drivers: dRes.count || 0,
        ambulances: aRes.count || 0,
        beds: { available: totalAvail, total: totalCapacity }, // ⭐ Real Beds Count
      }));
    } catch (err) {
      console.error("Stats Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // 2. Location API ko 'no-cors' mode ya simple try-catch mein rakhein
    const autoSyncLocation = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;

          // Nominatim API kai baar localhost ko block karti hai
          // Isliye hum isse optional bana rahe hain
          let addr = "Location Updated";
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: { "Accept-Language": "en" },
              },
            );
            const d = await res.json();
            addr = `${d.address.city || d.address.town || "Unknown"}, ${d.address.state || ""}`;
          } catch (e) {
            console.log("Address fetch skipped due to CORS/Network");
          }

          await supabase.from("hospitals").upsert(
            {
              profile_id: authUser.id,
              hospital_name: user?.hospital || "Apollo Hospitals",
              latitude,
              longitude,
              address: addr,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "profile_id" },
          );
        });
      } catch (e) {
        console.log("Location sync error:", e);
      }
    };

    autoSyncLocation();

    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergency_requests" },
        fetchStats,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "drivers" },
        fetchStats,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ambulances" },
        fetchStats,
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Active Emergencies */}
        <div
          onClick={() => navigate("/emergencies")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-2">
            {counts.emergencies}
          </h3>
          <p className="text-gray-600 font-medium">Active Emergencies</p>
        </div>

        {/* 2. Available Beds */}
        <div
          onClick={() => navigate("/beds")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-medical-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bed className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-2">
            {counts.beds.available}/{counts.beds.total}
          </h3>
          <p className="text-gray-600 font-medium">Available Beds</p>
        </div>

        {/* 3. Registered Drivers */}
        <div
          onClick={() => navigate("/drivers")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-2">
            {counts.drivers}
          </h3>
          <p className="text-gray-600 font-medium">Registered Drivers</p>
        </div>

        {/* 4. Total Ambulances */}
        <div
          onClick={() => navigate("/ambulance")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-2">
            {counts.ambulances}
          </h3>
          <p className="text-gray-600 font-medium">Total Ambulances</p>
        </div>
      </div>

      {/* Quick Actions (Baki sab sahi hai) */}
      <div className="emergency-card p-8">
        <h2 className="text-2xl font-bold text-navy mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/emergencies")}
            className="btn-primary text-left p-6 h-24 flex items-center space-x-4"
          >
            <AlertCircle className="w-8 h-8" />
            <span>View Emergency Requests</span>
          </button>

          <button
            onClick={() => navigate("/beds")}
            className="btn-secondary text-left p-6 h-24 flex items-center space-x-4"
          >
            <Bed className="w-8 h-8" />
            <span>Update Bed Status</span>
          </button>

          <button
            onClick={() => navigate("/drivers")}
            className="bg-gradient-to-r from-medical-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-left p-6 h-24 flex items-center space-x-4 rounded-2xl shadow-lg hover:shadow-xl"
          >
            <Users className="w-8 h-8" />
            <span>Assign Driver</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
