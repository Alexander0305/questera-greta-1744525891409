import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Storage } from '../services/storage';
import { BalanceChecker } from '../services/BalanceChecker';
import { WalletGenerator } from '../services/WalletGenerator';

export function useWalletGeneration(options = {}) {
  const [wallets, setWallets] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    totalGenerated: 0,
    totalWithBalance: 0,
    totalValueUSD: '0',
    totalValueBTC: '0'
  });

  // Load saved wallets on mount
  useEffect(() => {
    loadSavedWallets();
  }, []);

  const loadSavedWallets = async () => {
    const savedWallets = await Storage.getWallets();
    const savedStats = await Storage.getStatistics();
    setWallets(savedWallets);
    setStats(savedStats);
  };

  const generateWallets = async (count, networks, wordCount = 12) => {
    if (generating) return;
    
    setGenerating(true);
    const generator = new WalletGenerator({
      wordCount,
      networks,
      count
    });

    try {
      const balanceChecker = new BalanceChecker();
      let walletsWithBalance = 0;
      let totalUSDValue = 0;
      let totalBTCValue = 0;

      for (let i = 0; i < count; i++) {
        const progress = ((i + 1) / count) * 100;
        setProgress(progress);

        const wallet = await generator.generateWallet();
        const balances = await balanceChecker.checkAllBalances(wallet.addresses);
        
        // Add balances to wallet
        wallet.balances = balances;
        
        // Check if wallet has any balance
        const hasBalance = Object.values(balances).some(b => parseFloat(b.balance) > 0);
        if (hasBalance) {
          walletsWithBalance++;
          // Calculate total values
          Object.values(balances).forEach(b => {
            if (b.usdValue) totalUSDValue += parseFloat(b.usdValue);
            if (b.btcValue) totalBTCValue += parseFloat(b.btcValue);
          });
        }

        // Update wallets
        setWallets(prev => {
          const updated = [...prev, wallet];
          Storage.saveWallets(updated);
          return updated;
        });

        // Show notification for wallets with balance
        if (hasBalance) {
          toast.success('Found wallet with balance!', {
            position: 'bottom-right'
          });
        }
      }

      // Update statistics
      const newStats = {
        totalGenerated: stats.totalGenerated + count,
        totalWithBalance: stats.totalWithBalance + walletsWithBalance,
        totalValueUSD: (parseFloat(stats.totalValueUSD) + totalUSDValue).toFixed(2),
        totalValueBTC: (parseFloat(stats.totalValueBTC) + totalBTCValue).toFixed(8)
      };
      
      setStats(newStats);
      await Storage.saveStatistics(newStats);

    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Error generating wallets');
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  const clearWallets = async () => {
    setWallets([]);
    await Storage.saveWallets([]);
    await Storage.saveStatistics({
      totalGenerated: 0,
      totalWithBalance: 0,
      totalValueUSD: '0',
      totalValueBTC: '0'
    });
  };

  return {
    wallets,
    generating,
    progress,
    stats,
    generateWallets,
    clearWallets
  };
}