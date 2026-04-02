import { useState } from 'react'
import { dummyData } from '../data/dummyData.js'
import { Bed, Edit, Save, X } from 'lucide-react'

const BedManagement = () => {
  const [beds, setBeds] = useState(dummyData.beds)
  const [showModal, setShowModal] = useState(false)
  const [editingWard, setEditingWard] = useState(null)

  const [formData, setFormData] = useState({
    total: '',
    available: ''
  })

  const openEdit = (ward) => {
    setEditingWard(ward)
    setFormData({
      total: beds[ward].total,
      available: beds[ward].available
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const saveBeds = () => {
    setBeds({
      ...beds,
      [editingWard]: {
        ...beds[editingWard],
        total: Number(formData.total),
        available: Number(formData.available)
      }
    })
    setShowModal(false)
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <Bed className="w-10 h-10" />
          <span>Bed Management</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="emergency-card p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Beds</h3>
          <div className="text-4xl font-bold text-navy">{beds.total}</div>
        </div>

        <div className="emergency-card p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Available</h3>
          <div className="text-4xl font-bold text-green-600">{beds.available}</div>
        </div>

        <div className="emergency-card p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Occupied</h3>
          <div className="text-4xl font-bold text-red-600">{beds.occupied}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* General Ward */}
        <div className="emergency-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-navy">General Ward</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-navy">{beds.general.total}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-600">Available:</span>
              <span className="text-2xl font-bold text-green-600">{beds.general.available}</span>
            </div>
          </div>

          <button
            onClick={() => openEdit('general')}
            className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Beds</span>
          </button>
        </div>

        {/* ICU */}
        <div className="emergency-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-navy">ICU</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-navy">{beds.icu.total}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-600">Available:</span>
              <span className="text-2xl font-bold text-green-600">{beds.icu.available}</span>
            </div>
          </div>

          <button
            onClick={() => openEdit('icu')}
            className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Beds</span>
          </button>
        </div>

        {/* Emergency Ward */}
        <div className="emergency-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-navy">Emergency Ward</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-navy">{beds.emergency.total}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-600">Available:</span>
              <span className="text-2xl font-bold text-green-600">{beds.emergency.available}</span>
            </div>
          </div>

          <button
            onClick={() => openEdit('emergency')}
            className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Beds</span>
          </button>
        </div>

      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[420px] p-6 shadow-2xl relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X size={20}/>
            </button>

            <h2 className="text-xl font-bold text-center mb-6">
              Edit Beds
            </h2>

            <div className="space-y-4">

              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                placeholder="Total Beds"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="number"
                name="available"
                value={formData.available}
                onChange={handleChange}
                placeholder="Available Beds"
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>

            <button
              onClick={saveBeds}
              className="mt-6 w-full bg-primary text-white py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5"/>
              <span>Save</span>
            </button>

          </div>

        </div>
      )}

    </div>
  )
}

export default BedManagement