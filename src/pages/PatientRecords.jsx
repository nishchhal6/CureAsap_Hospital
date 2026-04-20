import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Bed,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";

const PatientRecords = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitalRecords();
  }, [currentUser]);

  const fetchHospitalRecords = async () => {
    try {
      setLoading(true);

      // 1. Pehle check karo ki currentUser mein kya data hai
      console.log("Current User Data:", currentUser);

      // 2. Hospital ka naam nikalne ka sahi tarika (Check labels carefully)
      const hospitalNameFromAuth =
        currentUser?.hospitalName ||
        currentUser?.name ||
        currentUser?.full_name;

      if (!hospitalNameFromAuth) {
        console.error("Hospital name not found in Auth Context!");
        setLoading(false);
        return;
      }

      console.log("Filtering records for hospital:", hospitalNameFromAuth);

      // 3. Supabase Query
      const { data, error } = await supabase
        .from("emergency_records")
        .select("*")
        .eq("hospital_name", hospitalNameFromAuth) // Exact match check
        .order("completed_at", { ascending: false });

      if (error) throw error;

      console.log("Data fetched from Supabase:", data);
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Records...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <User className="w-10 h-10 text-primary" />
          <span>Completed Emergency Records</span>
        </h1>
        <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
          Total Cases: {records.length}
        </div>
      </div>

      <div className="emergency-card overflow-hidden bg-white shadow-xl rounded-3xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-navy">
                  Patient & Contact
                </th>
                <th className="text-left p-4 font-semibold text-navy">
                  Driver / Ambulance
                </th>
                <th className="text-left p-4 font-semibold text-navy">
                  Address
                </th>
                <th className="text-left p-4 font-semibold text-navy">
                  Completed At
                </th>
                <th className="text-left p-4 font-semibold text-navy">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400">
                    No records found for this hospital.
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
                        {record.vehicle_no}
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
                        {new Date(record.completed_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
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
                        {record.status?.toUpperCase()}
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
