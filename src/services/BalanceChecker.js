import { ethers } from 'ethers';
import axios from 'axios';
import { Decimal } from 'decimal.js';

export class BalanceChecker {
  constructor() {
    this.providers = {
      ETH: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      // Add more providers for other networks
    };
    
    this.priceCache = {
      timestamp: 0,
      prices: {}
    };
  }

  async checkAllBalances(addresses) {
    const results = {};
    const prices = await this.getPrices();

    for (const [network, address] of Object.entries(addresses)) {
      try {
        const balance = await this.checkBalance(network, address);
        const usdValue = this.calculateUSDValue(balance, network, prices);
        
        results[network] = {
          balance,
          usdValue,
          lastChecked: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error checking ${network} balance:`, error);
        results[network] = {
          balance: '0',
          usdValue: '0',
          error: error.message
        };
      }
    }

    return results;
  }

  async checkBalance(network, address) {
    switch (network) {
      case 'BTC':
        return this.checkBTCBalance(address);
      case 'ETH':
        return this.checkETHBalance(address);
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  async checkBTCBalance(address) {
    try {
      const response = await axios.get(
        `https://blockstream.info/api/address/${address}`
      );
      return ethers.formatUnits(response.data.chain_stats.funded_txo_sum, 8);
    } catch (error) {
      console.error('Error checking BTC balance:', error);
      return '0';
    }
  }

  async checkETHBalance(address) {
    try {
      const balance = await this.providers.ETH.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error checking ETH balance:', error);
      return '0';
    }
  }

  async getPrices() {
    if (Date.now() - this.priceCache.timestamp < 60000) {
      return this.priceCache.prices;
    }

    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
      );
      
      this.priceCache = {
        timestamp: Date.now(),
        prices: {
          BTC: response.data.bitcoin.usd,
          ETH: response.data.ethereum.usd
        }
      };

      return this.priceCache.prices;
    } catch (error) {
      console.error('Error fetching prices:', error);
      return this.priceCache.prices;
    }
  }

  calculateUSDValue(balance, network, prices) {
    if (!balance || !prices[network]) return '0';
    return new Decimal(balance).times(prices[network]).toFixed(2);
  }
}