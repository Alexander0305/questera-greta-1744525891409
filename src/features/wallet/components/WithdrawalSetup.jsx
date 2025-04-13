import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WithdrawalSetup({ onSave }) {
  const [destinationAddress, setDestinationAddress] = useState('');

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-white">Auto-Withdrawal Setup</h3>
      
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">Destination Address</label>
        <input
          type="text"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          placeholder="Enter your wallet address"
          className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSave(destinationAddress)}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
          font-medium transition-colors duration-200"
      >
        Save Withdrawal Address
      </motion.button>
    </div>
  );
}