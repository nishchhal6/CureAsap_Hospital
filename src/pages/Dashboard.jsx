import { useOutletContext, useNavigate } from "react-router-dom"
import { dummyData } from "../data/dummyData.js"
import { AlertCircle, Bed, Truck, Users } from "lucide-react"

const Dashboard = () => {
  const { user } = useOutletContext()
  const navigate = useNavigate()

  return (
    <div className="space-y-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Emergencies */}
        <div
          onClick={() => navigate("/emergencies")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-navy mb-2">
            {user.alerts}
          </h3>

          <p className="text-gray-600 font-medium">
            Active Emergencies
          </p>
        </div>

        {/* Beds */}
        <div
          onClick={() => navigate("/beds")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-medical-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bed className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-navy mb-2">
            {dummyData.beds.available}/{dummyData.beds.total}
          </h3>

          <p className="text-gray-600 font-medium">
            Available Beds
          </p>
        </div>

        {/* Drivers */}
        <div
          onClick={() => navigate("/drivers")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-navy mb-2">
            {dummyData.drivers.filter(
              (d) => d.status === "available"
            ).length}
          </h3>

          <p className="text-gray-600 font-medium">
            Available Drivers
          </p>
        </div>

        {/* Ambulances */}
        <div
          onClick={() => navigate("/ambulance")}
          className="emergency-card p-8 text-center cursor-pointer hover:scale-105 transition"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Truck className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-navy mb-2">
            {dummyData.ambulances.length}
          </h3>

          <p className="text-gray-600 font-medium">
            Total Ambulances
          </p>
        </div>

      </div>


      {/* Quick Actions */}
      <div className="emergency-card p-8">

        <h2 className="text-2xl font-bold text-navy mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Emergency Requests */}
          <button
            onClick={() => navigate("/emergencies")}
            className="btn-primary text-left p-6 h-24 flex items-center space-x-4"
          >
            <AlertCircle className="w-8 h-8" />
            <span>View Emergency Requests</span>
          </button>

          {/* Beds */}
          <button
            onClick={() => navigate("/beds")}
            className="btn-secondary text-left p-6 h-24 flex items-center space-x-4"
          >
            <Bed className="w-8 h-8" />
            <span>Update Bed Status</span>
          </button>

          {/* Drivers */}
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
  )
}

export default Dashboard