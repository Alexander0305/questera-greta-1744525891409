import { ethers } from 'ethers';
import * as secp256k1 from '@noble/secp256k1';

export class VanityGenerator {
  constructor(pattern, type, caseSensitive = true) {
    this.pattern = pattern;
    this.type = type;
    this.caseSensitive = caseSensitive;
    this.workers = navigator.hardwareConcurrency || 4;
  }

  validatePattern() {
    if (this.pattern.length < 1) return false;
    const validChars = /^[a-zA-Z0-9]+$/;
    return validChars.test(this.pattern);
  }

  matchesPattern(address) {
    const compareAddress = this.caseSensitive ? address : address.toLowerCase();
    const comparePattern = this.caseSensitive ? this.pattern : this.pattern.toLowerCase();

    switch (this.type) {
      case 'starts_with':
        return compareAddress.startsWith(comparePattern);
      case 'ends_with':
        return compareAddress.endsWith(comparePattern);
      case 'contains':
        return compareAddress.includes(comparePattern);
      case 'custom_regex':
        try {
          const regex = new RegExp(comparePattern);
          return regex.test(compareAddress);
        } catch (e) {
          console.error('Invalid regex pattern:', e);
          return false;
        }
      default:
        return false;
    }
  }

  async generateBtcVanity() {
    let found = false;
    let wallet = null;
    let attempts = 0;

    while (!found && attempts < 100000) {
      const privateKey = secp256k1.utils.randomPrivateKey();
      const publicKey = secp256k1.getPublicKey(privateKey, true);
      const address = this.publicKeyToBtcAddress(publicKey);

      if (this.matchesPattern(address)) {
        found = true;
        wallet = {
          address,
          privateKey: Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join(''),
          type: 'BTC'
        };
      }

      attempts++;
    }

    return { wallet, attempts };
  }

  publicKeyToBtcAddress(publicKey) {
    // Simplified BTC address generation for demo
    return `1${Array.from(publicKey).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 30)}`;
  }

  async generateEthVanity() {
    let found = false;
    let wallet = null;
    let attempts = 0;

    while (!found && attempts < 100000) {
      const newWallet = ethers.Wallet.createRandom();
      if (this.matchesPattern(newWallet.address)) {
        found = true;
        wallet = {
          address: newWallet.address,
          privateKey: newWallet.privateKey,
          type: 'ETH'
        };
      }

      attempts++;
    }

    return { wallet, attempts };
  }

  async generate(network = 'ETH') {
    if (!this.validatePattern()) {
      throw new Error('Invalid pattern');
    }

    return network === 'BTC' ? this.generateBtcVanity() : this.generateEthVanity();
  }
}