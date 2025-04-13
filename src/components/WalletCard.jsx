import React from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function WalletCard({ wallet, onCopy }) {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
    if (onCopy) onCopy(text, label);
  };

  const getExplorerUrl = (network, address) => {
    switch (network) {
      case 'BTC':
        return `https://blockstream.info/address/${address}`;
      case 'ETH':
        return `https://etherscan.io/address/${address}`;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* Wallet Info */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">
              Wallet #{wallet.id.toString().slice(-4)}
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(wallet.timestamp).toLocaleString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            wallet.type === 'mnemonic' 
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-blue-500/20 text-blue-300'
          }`}>
            {wallet.type === 'mnemonic' ? `${wallet.wordCount} Words` : 'Private Key'}
          </span>
        </div>

        {/* Mnemonic */}
        {wallet.mnemonic && (
          <div className="space-y-2 p-4 bg-black/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-purple-300">Seed Phrase</span>
              <button
                onClick={() => copyToClipboard(wallet.mnemonic, 'Seed phrase')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiCopy size={16} />
              </button>
            </div>
            <p className="text-white/80 font-mono text-sm break-all">
              {wallet.mnemonic}
            </p>
          </div>
        )}

        {/* Addresses */}
        <div className="space-y-3">
          {Object.entries(wallet.addresses).map(([network, data]) => (
            <div
              key={network}
              className="p-4 bg-black/30 rounded-lg space-y-2 border border-purple-500/10"
            >
              <div className="flex justify-between items-center">
                <span className="text-purple-300">{network}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(data.address, `${network} address`)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiCopy size={16} />
                  </button>
                  {getExplorerUrl(network, data.address) && (
                    <a
                      href={getExplorerUrl(network, data.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-white/80 font-mono text-sm break-all">
                {data.address}
              </p>

              {data.balance && (
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-purple-500/10">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-white">
                    {data.balance} {network}
                    {data.usdValue && (
                      <span className="text-gray-400 text-sm ml-2">
                        (${data.usdValue})
                      </span>
                    )}
                  </span>
                </div>
              )}

              {data.privateKey && (
                <div className="mt-2 pt-2 border-t border-purple-500/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Private Key</span>
                    <button
                      onClick={() => copyToClipboard(data.privateKey, `${network} private key`)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                  <p className="text-white/80 font-mono text-sm break-all mt-1">
                    {data.privateKey}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}