import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import WalletCard from './WalletCard';

export default function WalletList({ wallets, filter = 'all' }) {
  const filteredWallets = useMemo(() => {
    switch (filter) {
      case 'with-balance':
        return wallets.filter(wallet => 
          Object.values(wallet.balances).some(b => parseFloat(b.balance) > 0)
        );
      case 'zero-balance':
        return wallets.filter(wallet =>
          Object.values(wallet.balances).every(b => parseFloat(b.balance) === 0)
        );
      default:
        return wallets;
    }
  }, [wallets, filter]);

  const Row = ({ index, style }) => {
    const wallet = filteredWallets[index];
    return (
      <div style={style}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <WalletCard wallet={wallet} />
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">
          Found Wallets ({filteredWallets.length})
        </h3>
      </div>
      
      <AnimatePresence>
        {filteredWallets.length > 0 ? (
          <div className="h-[600px]">
            <List
              height={600}
              width="100%"
              itemCount={filteredWallets.length}
              itemSize={300}
            >
              {Row}
            </List>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            No wallets found
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}