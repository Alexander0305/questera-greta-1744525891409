import { ethers } from 'ethers';
import { NETWORKS } from '../constants';

export class NetworkProvider {
  static providers = {};

  static getProvider(network) {
    if (!this.providers[network]) {
      const networkConfig = NETWORKS[network];
      if (!networkConfig?.rpcUrl) return null;

      try {
        // Create provider with fallback URLs
        const urls = Array.isArray(networkConfig.rpcUrl) 
          ? networkConfig.rpcUrl 
          : [networkConfig.rpcUrl];

        // Try each URL until one works
        for (const url of urls) {
          try {
            const provider = new ethers.JsonRpcProvider(url);
            // Test the provider
            if (this.testProvider(provider)) {
              this.providers[network] = provider;
              break;
            }
          } catch (error) {
            console.warn(`Failed to connect to ${url}:`, error);
            continue;
          }
        }

        if (!this.providers[network]) {
          console.error(`No working RPC URL found for ${network}`);
          return null;
        }
      } catch (error) {
        console.error(`Error creating provider for ${network}:`, error);
        return null;
      }
    }
    return this.providers[network];
  }

  static async testProvider(provider) {
    try {
      const network = await provider.getNetwork();
      return network.chainId > 0;
    } catch {
      return false;
    }
  }

  static async getGasPrice(network) {
    try {
      const provider = this.getProvider(network);
      if (!provider) return null;

      const feeData = await provider.getFeeData();
      return feeData?.gasPrice || null;
    } catch (error) {
      console.error(`Error getting gas price for ${network}:`, error);
      return null;
    }
  }

  static resetProvider(network) {
    delete this.providers[network];
  }

  static resetAllProviders() {
    this.providers = {};
  }
}