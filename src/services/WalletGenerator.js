import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Storage } from './storage';

export class WalletGenerator {
  constructor(options = {}) {
    this.options = {
      wordCount: 12,
      network: 'ETH',
      count: 1,
      ...options
    };
  }

  async generateWallets() {
    const wallets = [];
    for (let i = 0; i < this.options.count; i++) {
      const wallet = await this.generateWallet();
      wallets.push(wallet);
      
      // Save to storage after each wallet generation
      const existingWallets = await Storage.getWallets();
      await Storage.saveWallets([...existingWallets, wallet]);
    }
    return wallets;
  }

  async generateWallet() {
    const mnemonic = this.options.mnemonic || bip39.generateMnemonic(
      this.options.wordCount === 24 ? 256 : 128
    );
    
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const addresses = {};

    // Derive addresses for each selected network
    for (const network of this.options.networks) {
      addresses[network] = await this.deriveAddress(network, seed, 0);
    }

    return {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      mnemonic,
      addresses,
      type: 'mnemonic',
      wordCount: this.options.wordCount
    };
  }

  async deriveAddress(network, seed, index) {
    switch (network) {
      case 'BTC':
        return this.deriveBTCAddress(seed, index);
      case 'ETH':
        return this.deriveETHAddress(seed, index);
      // Add more networks here
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  async deriveBTCAddress(seed, index) {
    const network = bitcoin.networks.bitcoin;
    const hdMaster = bitcoin.bip32.fromSeed(Buffer.from(seed), network);
    const keyPair = hdMaster.derivePath(`m/44'/0'/${index}'/0/0`);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network
    });

    return {
      address,
      path: `m/44'/0'/${index}'/0/0`,
      privateKey: keyPair.toWIF()
    };
  }

  async deriveETHAddress(seed, index) {
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const wallet = hdNode.derivePath(`m/44'/60'/${index}'/0/0`);

    return {
      address: wallet.address,
      path: `m/44'/60'/${index}'/0/0`,
      privateKey: wallet.privateKey
    };
  }

  static validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }
}