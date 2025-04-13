import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BulkGenerator } from '../services/BulkGenerator';
import { NETWORKS } from '../constants';
import NetworkSelector from './NetworkSelector';

export default function BulkGeneratorComponent() {
  const [options, setOptions] = useState({
    count: 10,
    includePrivateKeys: true,
    includeMnemonic: true,
    wordCount: 12,
    networks: ['BTC', 'ETH'],
    checkBalances: false
  });

  const [generating, setGenerating] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [progress, setProgress] = useState(0);

  const handleNetworkToggle = (network) => {
    setOptions(prev => ({
      ...prev,
      networks: prev.networks.includes(network)
        ? prev.networks.filter(n => n !== network)
        : [...prev.networks, network]
    }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setWallets([]);
    setProgress(0);

    try {
      const generator = new BulkGenerator(options);
      const generatedWallets = await generator.generateWallets();
      setWallets(generatedWallets);
    } catch (error) {
      console.error('Generation error:', error);
    }

    setGenerating(false);
  };

  const handleExport = async () => {
    if (!wallets.length) return;

    const generator = new BulkGenerator(options);
    let content;
    let filename;
    let type;

    switch (exportFormat) {
      case 'csv':
        content = await generator.exportToCSV(wallets);
        filename = 'wallets.csv';
        type = 'text/csv';
        break;
      case 'json':
        content = await generator.exportToJSON(wallets);
        filename = 'wallets.json';
        type = 'application/json';
        break;
      case 'txt':
        content = await generator.exportToTXT(wallets);
        filename = 'wallets.txt';
        type = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Bulk Wallet Generator</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm block mb-2">Number of Wallets</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={options.count}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                count: parseInt(e.target.value)
              }))}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">Word Count</label>
            <select
              value={options.wordCount}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                wordCount: parseInt(e.target.value)
              }))}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
            >
              <option value={12}>12 Words</option>
              <option value={24}>24 Words</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-gray-300 text-sm block">Networks</label>
          <NetworkSelector
            selectedNetworks={options.networks}
            onNetworkToggle={handleNetworkToggle}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeMnemonic}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                includeMnemonic: e.target.checked
              }))}
              className="rounded bg-gray-800 border-gray-600"
            />
            <span className="text-gray-300">Include Mnemonic</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.checkBalances}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                checkBalances: e.target.checked
              }))}
              className="rounded bg-gray-800 border-gray-600"
            />
            <span className="text-gray-300">Check Balances</span>
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={generating}
          className={`w-full py-3 rounded-lg font-medium ${
            generating
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {generating ? 'Generating...' : 'Generate Wallets'}
        </motion.button>

        {wallets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-4 py-2 bg-gray-800 rounded-lg text-white"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="txt">TXT</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
              >
                Export
              </motion.button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {wallets.map((wallet, index) => (
                  <motion.div
                    key={wallet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-gray-800 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400">Wallet #{wallet.id}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(wallet.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {options.includeMnemonic && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Mnemonic:</p>
                        <p className="text-white font-mono text-sm break-all">
                          {wallet.mnemonic}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {Object.entries(wallet.addresses).map(([network, data]) => (
                        <div
                          key={network}
                          className={`p-2 rounded ${NETWORKS[network].gradient}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-white">{NETWORKS[network].name}</span>
                            {options.checkBalances && (
                              <span className="text-white">
                                {data.balance} {NETWORKS[network].symbol}
                              </span>
                            )}
                          </div>
                          <p className="text-white/80 font-mono text-sm break-all">
                            {data.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}