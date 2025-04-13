import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VanityGenerator } from '../services/VanityGenerator';
import { VANITY_PATTERNS } from '../constants';

export default function VanityAddressGenerator() {
  const [pattern, setPattern] = useState('');
  const [patternType, setPatternType] = useState(VANITY_PATTERNS.STARTS_WITH);
  const [network, setNetwork] = useState('ETH');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const generator = new VanityGenerator(pattern, patternType, caseSensitive);
      const { wallet, attempts } = await generator.generate(network);
      
      setResult({
        success: true,
        wallet,
        attempts
      });
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    }

    setGenerating(false);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Vanity Address Generator</h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm block mb-2">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
            placeholder="Enter desired pattern"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm block mb-2">Pattern Type</label>
            <select
              value={patternType}
              onChange={(e) => setPatternType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
            >
              <option value={VANITY_PATTERNS.STARTS_WITH}>Starts With</option>
              <option value={VANITY_PATTERNS.ENDS_WITH}>Ends With</option>
              <option value={VANITY_PATTERNS.CONTAINS}>Contains</option>
              <option value={VANITY_PATTERNS.CUSTOM_REGEX}>Custom Regex</option>
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-2">Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
            >
              <option value="ETH">Ethereum</option>
              <option value="BTC">Bitcoin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded bg-gray-800 border-gray-600"
          />
          <label className="text-gray-300">Case Sensitive</label>
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
          {generating ? 'Generating...' : 'Generate Address'}
        </motion.button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${
            result.success ? 'bg-green-900/20' : 'bg-red-900/20'
          }`}
        >
          {result.success ? (
            <div className="space-y-2">
              <p className="text-green-400">
                Found after {result.attempts} attempts!
              </p>
              <div className="space-y-1">
                <p className="text-white font-mono text-sm">
                  Address: {result.wallet.address}
                </p>
                <p className="text-white font-mono text-sm">
                  Private Key: {result.wallet.privateKey}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-400">{result.error}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}