import React from 'react';
import { motion } from 'framer-motion';
import { FaHospital, FaPhone, FaAmbulance } from 'react-icons/fa';

const HospitalView = () => {
  const hospitals = [
    {
      id: 1,
      name: 'City General Hospital',
      beds: 45,
      available: 12,
      critical: 3,
      eta: '5 min',
      phone: '+1 234-567-8901'
    },
    {
      id: 2,
      name: "St. Mary's Medical Center",
      beds: 32,
      available: 8,
      critical: 2,
      eta: '8 min',
      phone: '+1 234-567-8902'
    },
    {
      id: 3,
      name: 'University Hospital',
      beds: 78,
      available: 23,
      critical: 5,
      eta: '12 min',
      phone: '+1 234-567-8903'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Hospital Network</h2>
        <p className="text-gray-400">Real-time bed availability and stroke center status</p>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 gap-6">
        {hospitals.map((hospital, index) => (
          <motion.div
            key={hospital.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Left: Hospital Info + Stats */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 flex-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                  <FaHospital className="text-3xl text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{hospital.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Stroke Center • Level 1 Trauma</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-4 md:mt-0 md:ml-6">
                <div>
                  <p className="text-2xl font-bold text-white">{hospital.beds}</p>
                  <p className="text-xs text-gray-400">Total Beds</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{hospital.available}</p>
                  <p className="text-xs text-gray-400">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{hospital.critical}</p>
                  <p className="text-xs text-gray-400">Critical</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{hospital.eta}</p>
                  <p className="text-xs text-gray-400">ETA</p>
                </div>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3 justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition">
                <FaAmbulance />
                <span>Dispatch Ambulance</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition">
                <FaPhone />
                <span>Call Hospital</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HospitalView;