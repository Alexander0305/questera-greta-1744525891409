import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiX } from 'react-icons/fi';

export default function GenerationControls({
  onGenerate,
  onStop,
  generating,
  progress,
  networks
}) {
  const [count, setCount] = useState(10);
  const [wordCount, setWordCount] = useState(12);

  const handleGenerate = () => {
    onGenerate(count, networks, wordCount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-300 text-sm block mb-2">
            Number of Wallets
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm block mb-2">
            Word Count
          </label>
          <select
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white"
          >
            <option value={12}>12 Words</option>
            <option value={24}>24 Words</option>
          </select>
        </div>
      </div>

      {generating && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-600"
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

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generating ? onStop : handleGenerate}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
          generating
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white`}
      >
        {generating ? (
          <>
            <FiX className="text-xl" />
            <span>Stop Generation</span>
          </>
        ) : (
          <>
            <FiPlay className="text-xl" />
            <span>Start Generation</span>
          </>
        )}
      </motion.button>
    </div>
  );
}