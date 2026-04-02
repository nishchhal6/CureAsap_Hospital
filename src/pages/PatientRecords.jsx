import { dummyData } from '../data/dummyData.js'
import { User, Bed, AlertTriangle, Plus } from 'lucide-react'

const PatientRecords = () => {
  const patients = dummyData.patients

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <User className="w-10 h-10" />
          <span>Patient Records</span>
        </h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="emergency-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-navy">Patient</th>
                <th className="text-left p-4 font-semibold text-navy">Age</th>
                <th className="text-left p-4 font-semibold text-navy">Disease</th>
                <th className="text-left p-4 font-semibold text-navy">Ward</th>
                <th className="text-left p-4 font-semibold text-navy">Status</th>
                <th className="text-left p-4 font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-navy">{patient.name}</td>
                  <td className="p-4">{patient.age}</td>
                  <td className="p-4 text-gray-700">{patient.disease}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {patient.ward}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg">
                        <User className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-100 rounded-lg text-green-600">
                        <Bed className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PatientRecords
