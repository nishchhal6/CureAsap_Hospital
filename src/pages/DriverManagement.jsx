import { useState } from "react";
import { dummyData } from "../data/dummyData.js";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Phone,
  X,
  Save,
} from "lucide-react";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState(dummyData.drivers);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  const [editingDriver, setEditingDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    license: "",
    aadhaar: "",
    email: "",
    vehicle: "",
    phone: "",
    address: "",
    status: "available",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "on-duty":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "offline":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addDriver = () => {
    const newDriver = {
      id: Date.now(),
      ...formData,
    };

    setDrivers([...drivers, newDriver]);
    setShowAdd(false);

    setFormData({
      name: "",
      license: "",
      aadhaar: "",
      email: "",
      vehicle: "",
      phone: "",
      address: "",
      status: "available",
    });
  };

  const openDeleteConfirm = (driver) => {
    setDriverToDelete(driver);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    setDrivers(drivers.filter((d) => d.id !== driverToDelete.id));
    setShowDelete(false);
    setDriverToDelete(null);
  };

  const openEdit = (driver) => {
    setEditingDriver(driver);
    setFormData(driver);
    setShowEdit(true);
  };

  const saveEdit = () => {
    const updated = drivers.map((d) =>
      d.id === editingDriver.id ? { ...d, ...formData } : d
    );

    setDrivers(updated);
    setShowEdit(false);
  };

  const toggleStatus = (id) => {
    const updated = drivers.map((d) =>
      d.id === id
        ? {
            ...d,
            status: d.status === "available" ? "offline" : "available",
          }
        : d
    );

    setDrivers(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy flex items-center space-x-3">
          <Users className="w-10 h-10" />
          <span>Driver Management</span>
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Driver Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="emergency-card p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-medical-blue to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="font-bold text-xl text-navy">
                    {driver.name}
                  </h3>
                  <p className="text-sm text-gray-600">{driver.vehicle}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                  driver.status
                )}`}
              >
                {driver.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{driver.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(driver)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={() => openDeleteConfirm(driver)}
                  className="p-2 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <button
                onClick={() => toggleStatus(driver.id)}
                className="btn-secondary px-4 py-2 text-sm flex items-center space-x-1"
              >
                {driver.status === "available" ? (
                  <ToggleLeft className="w-4 h-4" />
                ) : (
                  <ToggleRight className="w-4 h-4" />
                )}
                <span>Toggle</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD DRIVER POPUP */}

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[500px] p-6 shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Add Driver</h2>
              <button onClick={() => setShowAdd(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <input name="name" placeholder="Driver Name" onChange={handleChange} value={formData.name} className="w-full border rounded-lg px-3 py-2"/>
              <input name="license" placeholder="Driving License" onChange={handleChange} value={formData.license} className="w-full border rounded-lg px-3 py-2"/>
              <input name="aadhaar" placeholder="Aadhaar Number" onChange={handleChange} value={formData.aadhaar} className="w-full border rounded-lg px-3 py-2"/>
              <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="w-full border rounded-lg px-3 py-2"/>
              <input name="vehicle" placeholder="Vehicle Number" onChange={handleChange} value={formData.vehicle} className="w-full border rounded-lg px-3 py-2"/>
              <input name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} className="w-full border rounded-lg px-3 py-2"/>
              <textarea name="address" placeholder="Address" onChange={handleChange} value={formData.address} className="w-full border rounded-lg px-3 py-2"/>
            </div>

            <button
              onClick={addDriver}
              className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Driver</span>
            </button>
          </div>
        </div>
      )}

      {/* EDIT DRIVER POPUP */}

{showEdit && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-[500px] p-6 shadow-2xl overflow-y-auto max-h-[90vh]">

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Driver</h2>

        <button onClick={() => setShowEdit(false)}>
          <X />
        </button>
      </div>

      <div className="space-y-3">

        <input
          name="name"
          placeholder="Driver Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          name="license"
          placeholder="Driving License Number"
          value={formData.license}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          name="aadhaar"
          placeholder="Aadhaar Number"
          value={formData.aadhaar}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          name="vehicle"
          placeholder="Vehicle Number"
          value={formData.vehicle}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

      </div>

      <button
        onClick={saveEdit}
        className="mt-6 w-full btn-primary flex items-center justify-center space-x-2"
      >
        <Save className="w-5 h-5" />
        <span>Update Driver</span>
      </button>

    </div>

  </div>
)}

      {/* DELETE CONFIRMATION */}

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[350px] p-6 shadow-2xl text-center">
            <h2 className="text-lg font-bold mb-4">Delete Driver</h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this driver?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;