export const dummyData = {
  beds: {
    total: 250,
    available: 180,
    occupied: 70,
    general: { total: 150, available: 110 },
    icu: { total: 50, available: 30 },
    emergency: { total: 50, available: 40 }
  },
  drivers: [
    { id: 1, name: 'Ravi Kumar', status: 'available', phone: '+91 98765 43210', vehicle: 'MH04 AB1234' },
    { id: 2, name: 'Priya Singh', status: 'on-duty', phone: '+91 98765 43211', vehicle: 'MH04 AB1235' },
    { id: 3, name: 'Amit Patel', status: 'offline', phone: '+91 98765 43212', vehicle: 'MH04 AB1236' },
    { id: 4, name: 'Neha Sharma', status: 'available', phone: '+91 98765 43213', vehicle: 'MH04 AB1237' }
  ],
  ambulances: [
    { id: 'AMB001', driver: 'Ravi Kumar', status: 'available', location: 'Hospital Gate' },
    { id: 'AMB002', driver: 'Priya Singh', status: 'on-duty', location: 'En Route to Sector 15' },
    { id: 'AMB003', driver: 'Amit Patel', status: 'maintenance', location: 'Garage' }
  ],
  patients: [
    { id: 1, name: 'Rahul Verma', age: 45, disease: 'Heart Attack', ward: 'ICU-12', status: 'Critical' },
    { id: 2, name: 'Sunita Devi', age: 32, disease: 'Fracture', ward: 'General-45', status: 'Stable' },
    { id: 3, name: 'Arjun Singh', age: 28, disease: 'Fever', ward: 'Emergency-08', status: 'Stable' }
  ],
  emergencies: [
    { id: 1, priority: 'High', patient: 'Victim - Road Accident', ambulance: 'AMB002', status: 'En Route' },
    { id: 2, priority: 'Medium', patient: 'Chest Pain', ambulance: 'None', status: 'Pending' }
  ]
}
