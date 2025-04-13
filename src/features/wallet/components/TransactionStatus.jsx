import React from 'react';
import { motion } from 'framer-motion';
import { NETWORKS } from '../constants';

export default function TransactionStatus({ transactions }) {
  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            tx.success 
              ? 'bg-green-900/20 border border-green-500/30' 
              : 'bg-red-900/20 border border-red-500/30'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${tx.success ? 'text-green-400' : 'text-red-400'}`}>
                {NETWORKS[tx.network].name}
              </span>
            </div>
            <span className={`text-sm ${tx.success ? 'text-green-400' : 'text-red-400'}`}>
              {tx.success ? 'Success' : 'Failed'}
            </span>
          </div>
          
          {tx.success && tx.hash && (
            <a
              href={`https://etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 mt-2 block"
            >
              View Transaction
            </a>
          )}
          
          {!tx.success && tx.error && (
            <p className="text-xs text-red-400 mt-2">{tx.error}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}