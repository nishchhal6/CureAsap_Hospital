import { dummyData } from '../data/dummyData.js'
import { Truck, MapPin, User, Edit3, Plus } from 'lucide-react'

const AmbulanceManagement = () => {
  const ambulances = dummyData.ambulances

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'on-duty': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <Truck className="w-10 h-10" />
          <span>Ambulance Management</span>
        </h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Ambulance</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ambulances.map((ambulance) => (
          <div key={ambulance.id} className="emergency-card p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-navy mb-1">{ambulance.id}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(ambulance.status)}`}>
                  {ambulance.status.toUpperCase()}
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-r from-primary to-red-600 rounded-xl flex items-center justify-center">
                <Truck className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-navy">{ambulance.driver}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{ambulance.location}</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <button className="flex-1 btn-primary">
                Assign Emergency
              </button>
              <button className="px-4 p-3 bg-slate-100 hover:bg-slate-200 rounded-xl">
                <Edit3 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AmbulanceManagement
