import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { FiSearch, FiCheck } from 'react-icons/fi';
import { NETWORKS } from '../constants';

export default function NetworkList({ selectedNetworks, onNetworkToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const filteredNetworks = useMemo(() => {
    return Object.entries(NETWORKS).filter(([key, network]) =>
      network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const networkKeys = Object.keys(NETWORKS);
    if (newSelectAll) {
      onNetworkToggle(networkKeys);
    } else {
      onNetworkToggle([]);
    }
  };

  const Row = ({ index, style }) => {
    const [networkKey, network] = filteredNetworks[index];
    const isSelected = selectedNetworks.includes(networkKey);

    return (
      <motion.div
        style={style}
        whileHover={{ scale: 1.02 }}
        className={`p-3 m-1 rounded-lg cursor-pointer ${network.theme}`}
        onClick={() => onNetworkToggle(networkKey)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={network.icon} alt={network.name} className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="text-white font-medium">{network.name}</h3>
              <p className="text-white/70 text-sm">{network.symbol}</p>
            </div>
          </div>
          {isSelected && (
            <FiCheck className="text-white text-xl" />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search networks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
        >
          {selectAll ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="h-[600px]">
        <List
          height={600}
          width="100%"
          itemCount={filteredNetworks.length}
          itemSize={80}
        >
          {Row}
        </List>
      </div>
    </div>
  );
}