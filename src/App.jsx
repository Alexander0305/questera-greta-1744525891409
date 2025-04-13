import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AIFinder from './features/wallet/components/AIFinder';
import VanityGenerator from './features/wallet/components/VanityGenerator';
import PuzzleScanner from './features/wallet/components/PuzzleScanner';
import BulkGenerator from './features/wallet/components/BulkGenerator';
import FuturisticContainer from './features/wallet/components/FuturisticContainer';
import NetworkList from './features/wallet/components/NetworkList';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('ai');
  const [selectedNetworks, setSelectedNetworks] = useState(['BTC', 'ETH']);

  const tabs = [
    { id: 'ai', name: 'AI Finder', icon: '🤖' },
    { id: 'vanity', name: 'Vanity Generator', icon: '✨' },
    { id: 'puzzle', name: 'Puzzle Scanner', icon: '🧩' },
    { id: 'bulk', name: 'Bulk Generator', icon: '📦' }
  ];

  const handleNetworkToggle = (networks) => {
    if (Array.isArray(networks)) {
      setSelectedNetworks(networks);
    } else {
      setSelectedNetworks(prev =>
        prev.includes(networks)
          ? prev.filter(n => n !== networks)
          : [...prev, networks]
      );
    }
  };

  return (
    <div className="min-h-screen bg-mass-effect-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <FuturisticContainer className="p-8">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center space-x-4">
            <span className="text-mass-effect-light-blue">Ultra X</span>
            <span className="text-mass-effect-cyan">Wallet</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Panel - Network Selection */}
            <div>
              <h2 className="text-2xl font-bold text-mass-effect-light-blue mb-4">Networks</h2>
              <NetworkList
                selectedNetworks={selectedNetworks}
                onNetworkToggle={handleNetworkToggle}
              />
            </div>

            {/* Right Panel - Tools */}
            <div>
              <div className="flex flex-wrap gap-4 mb-6">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-6 py-3 rounded-lg flex items-center space-x-2
                      ${activeTab === tab.id
                        ? 'bg-mass-effect-blue text-white'
                        : 'bg-mass-effect-dark-blue text-mass-effect-light-blue hover:bg-mass-effect-blue/20'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </motion.button>
                ))}
              </div>

              <FuturisticContainer className="p-6">
                {activeTab === 'ai' && <AIFinder selectedNetworks={selectedNetworks} />}
                {activeTab === 'vanity' && <VanityGenerator selectedNetworks={selectedNetworks} />}
                {activeTab === 'puzzle' && <PuzzleScanner selectedNetworks={selectedNetworks} />}
                {activeTab === 'bulk' && <BulkGenerator selectedNetworks={selectedNetworks} />}
              </FuturisticContainer>
            </div>
          </div>
        </FuturisticContainer>
      </div>
    </div>
  );
}