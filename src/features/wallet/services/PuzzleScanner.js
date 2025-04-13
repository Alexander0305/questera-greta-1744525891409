import { ethers } from 'ethers';

export class PuzzleScanner {
  constructor(rangeStart, rangeEnd) {
    this.rangeStart = BigInt(rangeStart);
    this.rangeEnd = BigInt(rangeEnd);
    this.batchSize = 1000n;
  }

  async scanRange(startIndex, endIndex) {
    const results = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      const privateKey = i.toString(16).padStart(64, '0');
      const wallet = new ethers.Wallet(privateKey);
      const btcAddress = this.deriveBtcAddress(privateKey);
      
      results.push({
        privateKey,
        ethAddress: wallet.address,
        btcAddress
      });
    }

    return results;
  }

  deriveBtcAddress(privateKey) {
    // Simplified BTC address generation for demo
    return `1${privateKey.slice(0, 30)}`;
  }

  async checkBalance(address) {
    try {
      const response = await fetch(`https://blockchain.info/balance?active=${address}`);
      const data = await response.json();
      return ethers.formatUnits(data[address].final_balance, 8);
    } catch {
      return "0";
    }
  }

  calculateProgress(current) {
    const range = this.rangeEnd - this.rangeStart;
    const progress = ((current - this.rangeStart) * 100n) / range;
    return Number(progress);
  }

  generateMiniKey() {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let key = "S";
    for (let i = 0; i < 21; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return this.validateMiniKey(key) ? key : this.generateMiniKey();
  }

  async validateMiniKey(miniKey) {
    // Browser-compatible hash implementation
    const msgUint8 = new TextEncoder().encode(miniKey + "?");
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray[0] === 0;
  }
}