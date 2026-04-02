import { dummyData } from '../data/dummyData.js'
import { BarChart3, PieChart, Activity, Calendar, FileText, Download } from 'lucide-react'

const Reports = () => {
  const beds = dummyData.beds

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <BarChart3 className="w-10 h-10" />
          <span>Reports & Analysis</span>
        </h1>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupancy Chart */}
        <div className="emergency-card p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-navy">Bed Occupancy</h3>
              <p className="text-gray-600">72% occupied</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Available</span>
              <div className="w-24 bg-green-100 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
              <span>{beds.available}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Occupied</span>
              <div className="w-24 bg-red-100 h-2 rounded-full">
                <div className="bg-red-600 h-2 rounded-full" style={{width: '28%'}}></div>
              </div>
              <span>{beds.occupied}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="emergency-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergencies Today</p>
                <p className="text-3xl font-bold text-navy">12</p>
              </div>
              <Activity className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <div className="emergency-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-green-600">8.2 min</p>
              </div>
              <Calendar className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="emergency-card p-8">
        <h3 className="text-xl font-bold text-navy mb-6">Recent Activities</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-navy">AMB002 reached patient</p>
              <p className="text-sm text-gray-600">2 minutes ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
          </div>
          <div className="flex items-center p-4 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-navy">New emergency request</p>
              <p className="text-sm text-gray-600">5 minutes ago</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
