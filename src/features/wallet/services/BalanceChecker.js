import { ethers } from 'ethers';
import { NetworkProvider } from './NetworkProvider';
import { NETWORKS } from '../constants';

export class BalanceChecker {
  async checkAllBalances(address) {
    const balances = {};
    
    for (const [network, config] of Object.entries(NETWORKS)) {
      if (!config.enabled) continue;

      try {
        const balance = await this.checkBalance(address, network);
        balances[network] = {
          balance,
          value: 0,
          symbol: config.symbol
        };
      } catch (error) {
        console.error(`Error checking ${network} balance:`, error);
        balances[network] = {
          balance: '0',
          value: 0,
          symbol: config.symbol
        };
      }
    }
    
    return balances;
  }

  async checkBalance(address, network) {
    if (network === 'BTC') {
      return this.checkBtcBalance(address);
    }
    return this.checkEvmBalance(address, network);
  }

  async checkBtcBalance(address) {
    const mockBalance = '0'; // For development purposes
    return mockBalance;

    // In production, implement proper BTC balance checking:
    /*
    try {
      const response = await fetch(`https://blockchain.info/balance?active=${address}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return ethers.formatUnits(data[address]?.final_balance || '0', 8);
    } catch (error) {
      console.error('Error checking BTC balance:', error);
      return '0';
    }
    */
  }

  async checkEvmBalance(address, network) {
    try {
      const provider = NetworkProvider.getProvider(network);
      if (!provider) return '0';

      const balance = await provider.getBalance(address);
      return ethers.formatUnits(balance, NETWORKS[network]?.decimals || 18);
    } catch (error) {
      console.error(`Error checking ${network} balance:`, error);
      return '0';
    }
  }
}