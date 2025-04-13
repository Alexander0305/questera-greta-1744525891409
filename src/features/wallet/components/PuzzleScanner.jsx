import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PuzzleScanner } from '../services/PuzzleScanner';
import { PUZZLE_RANGES } from '../constants';

export default function PuzzleScannerComponent() {
  const [selectedPuzzle, setSelectedPuzzle] = useState('');
  const [customRange, setCustomRange] = useState({
    start: '',
    end: ''
  });
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);

  const handleStartScan = async () => {
    setScanning(true);
    setResults([]);

    const range = selectedPuzzle === 'custom'
      ? customRange
      : PUZZLE_RANGES[selectedPuzzle];

    const scanner = new PuzzleScanner(range.start, range.end);

    try {
      // Start scanning in batches
      let currentIndex = scanner.rangeStart;
      
      while (currentIndex <= scanner.rangeEnd && scanning) {
        const endIndex = currentIndex + scanner.batchSize;
        const batchResults = await scanner.scanRange(currentIndex, endIndex);
        
        // Check balances and filter results
        const foundWallets = await Promise.all(
          batchResults.map(async (result) => {
            const balance = await scanner.checkBalance(result.btcAddress);
            return { ...result, balance };
          })
        );

        // Update results if any wallets with balance are found
        const walletsWithBalance = foundWallets.filter(w => w.balance !== "0");
        if (walletsWithBalance.length > 0) {
          setResults(prev => [...prev, ...walletsWithBalance]);
        }

        // Update progress
        const newProgress = scanner.calculateProgress(currentIndex);
        setProgress(newProgress);

        currentIndex += scanner.batchSize;
      }
    } catch (error) {
      console.error('Scanning error:', error);
    }

    setScanning(false);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Bitcoin Puzzle Scanner</h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm block mb-2">Select Puzzle</label>
          <select
            value={selectedPuzzle}
            onChange={(e) => setSelectedPuzzle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
          >
            <option value="">Select a puzzle range</option>
            {Object.entries(PUZZLE_RANGES).map(([key, puzzle]) => (
              <option key={key} value={key}>
                {puzzle.name} - Reward: {puzzle.reward}
              </option>
            ))}
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {selectedPuzzle === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">Start Range</label>
              <input
                type="text"
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({
                  ...prev,
                  start: e.target.value
                }))}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
                placeholder="Start (hex)"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-2">End Range</label>
              <input
                type="text"
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({
                  ...prev,
                  end: e.target.value
                }))}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
                placeholder="End (hex)"
              />
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={scanning ? () => setScanning(false) : handleStartScan}
          disabled={!selectedPuzzle}
          className={`w-full py-3 rounded-lg font-medium ${
            !selectedPuzzle
              ? 'bg-gray-700 cursor-not-allowed'
              : scanning
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {scanning ? 'Stop Scanning' : 'Start Scanning'}
        </motion.button>

        {scanning && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-gray-400 text-sm text-center">
              Progress: {progress.toFixed(2)}%
            </p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Found Wallets</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/20 rounded-lg space-y-2"
              >
                <p className="text-white font-mono text-sm">
                  Private Key: {result.privateKey}
                </p>
                <p className="text-white font-mono text-sm">
                  BTC Address: {result.btcAddress}
                </p>
                <p className="text-white font-mono text-sm">
                  ETH Address: {result.ethAddress}
                </p>
                <p className="text-green-400">
                  Balance: {result.balance} BTC
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}