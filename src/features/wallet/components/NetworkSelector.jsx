import React from 'react';
import { motion } from 'framer-motion';
import { NETWORKS } from '../constants';

export default function NetworkSelector({ selectedNetworks, onNetworkToggle }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(NETWORKS).map(([key, network]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNetworkToggle(key)}
          className={`p-4 rounded-xl ${network.gradient} transition-all duration-200
            ${selectedNetworks.includes(key) 
              ? 'ring-2 ring-white ring-opacity-60' 
              : 'opacity-60'}`}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white font-medium">{network.name}</span>
            <span className="text-white/80 text-sm">{network.symbol}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}