import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiDollarSign, FiBitcoin, FiPackage } from 'react-icons/fi';

export default function Statistics({ stats }) {
  const statItems = [
    {
      icon: <FiPackage className="text-2xl" />,
      label: 'Total Generated',
      value: stats.totalGenerated.toLocaleString(),
      color: 'text-purple-400'
    },
    {
      icon: <FiActivity className="text-2xl" />,
      label: 'With Balance',
      value: stats.totalWithBalance.toLocaleString(),
      color: 'text-green-400'
    },
    {
      icon: <FiDollarSign className="text-2xl" />,
      label: 'Total Value USD',
      value: `$${parseFloat(stats.totalValueUSD).toLocaleString()}`,
      color: 'text-blue-400'
    },
    {
      icon: <FiBitcoin className="text-2xl" />,
      label: 'Total Value BTC',
      value: `₿${stats.totalValueBTC}`,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20"
        >
          <div className="flex items-center space-x-3">
            <div className={`${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}