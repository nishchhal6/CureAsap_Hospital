import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Phone, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const PatientRecords = () => {
  const { currentUser } = useAuth();
  const { user } = useOutletContext();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchHospitalRecords();
    }
  }, [currentUser]);

  const fetchHospitalRecords = async () => {
    try {
      setLoading(true);

      // DashboardLayout se jo naam aa raha hai (e.g., "SN Medical College")
      const dashboardName = user.hospital;

      // Agar database mein "SN Medical" hai aur yahan "SN Medical College",
      // toh hum 'ilike' (case-insensitive search) use kar sakte hain
      const { data, error } = await supabase
        .from("emergency_records")
        .select("*")
        // .eq ki jagah .ilike use karo taaki partial name bhi match ho jaye
        .ilike("hospital_name", `%${dashboardName.split(" ")[0]}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-navy font-semibold">
        Loading Hospital Records...
      </div>
    );

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <User className="w-10 h-10 text-primary" />
          <span>Completed Emergency Records</span>
        </h1>
        <div className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
          Total Cases: {records.length}
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow-xl rounded-3xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-bold text-navy">
                  Patient & Contact
                </th>
                <th className="text-left p-4 font-bold text-navy">
                  Driver / Ambulance
                </th>
                <th className="text-left p-4 font-bold text-navy">Address</th>
                <th className="text-left p-4 font-bold text-navy">
                  Completed At
                </th>
                <th className="text-left p-4 font-bold text-navy">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 opacity-20" />
                      <p>
                        No records found for "
                        {currentUser?.profile?.full_name || "this hospital"}".
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-navy">
                        {record.citizen_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {record.citizen_phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">
                        {record.driver_name || "N/A"}
                      </div>
                      <div className="text-xs text-blue-600 font-bold">
                        {record.vehicle_no || "No Vehicle"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-600 max-w-[200px] truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {record.citizen_address}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.completed_at
                          ? new Date(record.completed_at).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "medium",
                                timeStyle: "short",
                              },
                            )
                          : "Processing..."}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center w-fit gap-1 ${getStatusStyle(record.status)}`}
                      >
                        {record.status === "completed" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {record.status?.toUpperCase() || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
