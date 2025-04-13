import { ethers } from 'ethers';
import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from 'bip39';
import * as secp256k1 from '@noble/secp256k1';

export class WalletGenerator {
  static generateMnemonic(wordCount = 12) {
    const strength = wordCount === 24 ? 256 : 128;
    return generateMnemonic(strength);
  }

  static validateMnemonic(mnemonic) {
    return validateMnemonic(mnemonic);
  }

  static async deriveBitcoinAddress(mnemonic, index = 0) {
    const seed = mnemonicToSeedSync(mnemonic);
    const privateKey = secp256k1.utils.hashToPrivateKey(seed);
    const publicKey = secp256k1.getPublicKey(privateKey, true);
    
    // Simple BTC address generation (placeholder)
    // In production, use a proper BTC address derivation library
    return `1${Buffer.from(publicKey).toString('hex').slice(0, 30)}`;
  }

  static async deriveEthereumAddress(mnemonic, index = 0) {
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = ethers.Wallet.fromPhrase(mnemonic, path);
    return wallet.address;
  }
}