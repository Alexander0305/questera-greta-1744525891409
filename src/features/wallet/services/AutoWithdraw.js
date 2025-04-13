import { ethers } from 'ethers';
import { NetworkProvider } from './NetworkProvider';
import { NETWORKS } from '../constants';

export class AutoWithdraw {
  constructor(destinationAddress) {
    this.destinationAddress = destinationAddress;
  }

  async withdrawEvm(privateKey, network, amount) {
    try {
      const provider = NetworkProvider.getProvider(network);
      const wallet = new ethers.Wallet(privateKey, provider);
      
      const gasPrice = await NetworkProvider.getGasPrice(network);
      if (!gasPrice) throw new Error('Failed to get gas price');

      const tx = {
        to: this.destinationAddress,
        value: ethers.parseUnits(amount, NETWORKS[network].decimals),
        gasPrice
      };

      // Estimate gas
      const gasLimit = await provider.estimateGas(tx);
      tx.gasLimit = gasLimit;

      const transaction = await wallet.sendTransaction(tx);
      return {
        success: true,
        hash: transaction.hash,
        network
      };
    } catch (error) {
      console.error(`Error withdrawing ${network}:`, error);
      return {
        success: false,
        error: error.message,
        network
      };
    }
  }

  async withdrawBtc(privateKey, amount) {
    // Implementation for Bitcoin withdrawal would go here
    // This requires additional Bitcoin-specific libraries
    throw new Error('Bitcoin withdrawal not yet implemented');
  }

  async withdrawAll(wallet, balances) {
    const results = [];

    for (const [network, data] of Object.entries(balances)) {
      if (parseFloat(data.balance) > 0) {
        if (network === 'BTC') {
          try {
            const result = await this.withdrawBtc(wallet.privateKey, data.balance);
            results.push(result);
          } catch (error) {
            results.push({
              success: false,
              error: error.message,
              network
            });
          }
        } else {
          const result = await this.withdrawEvm(wallet.privateKey, network, data.balance);
          results.push(result);
        }
      }
    }

    return results;
  }
}