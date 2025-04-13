import { ethers } from 'ethers';
import { generateMnemonic, validateMnemonic } from 'bip39';
import { WalletGenerator } from './WalletGenerator';
import { BalanceChecker } from './BalanceChecker';
import { NETWORKS } from '../constants';

export class BulkGenerator {
  constructor(options = {}) {
    this.options = {
      count: 1,
      includePrivateKeys: true,
      includeMnemonic: true,
      wordCount: 12,
      networks: ['BTC', 'ETH'],
      checkBalances: false,
      ...options
    };
    this.balanceChecker = new BalanceChecker();
  }

  async generateWallets() {
    const wallets = [];
    const generator = new WalletGenerator();

    for (let i = 0; i < this.options.count; i++) {
      const mnemonic = generateMnemonic(this.options.wordCount === 24 ? 256 : 128);
      if (!validateMnemonic(mnemonic)) continue;

      const addresses = {};
      for (const network of this.options.networks) {
        if (network === 'BTC') {
          addresses.BTC = {
            address: await generator.deriveBitcoinAddress(mnemonic),
            balance: '0'
          };
        } else {
          const path = `m/44'/${network === 'ETH' ? '60' : '0'}'/${i}'/0/0`;
          const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
          addresses[network] = {
            address: wallet.address,
            balance: '0'
          };
        }
      }

      if (this.options.checkBalances) {
        await this.checkBalances(addresses);
      }

      wallets.push({
        id: i + 1,
        mnemonic: this.options.includeMnemonic ? mnemonic : undefined,
        addresses,
        timestamp: new Date().toISOString()
      });
    }

    return wallets;
  }

  async checkBalances(addresses) {
    for (const [network, data] of Object.entries(addresses)) {
      if (network === 'BTC') {
        data.balance = await this.balanceChecker.checkBtcBalance(data.address);
      } else {
        data.balance = await this.balanceChecker.checkEvmBalance(data.address, network);
      }
    }
  }

  async exportToCSV(wallets) {
    const rows = [this.generateCSVHeader()];
    
    for (const wallet of wallets) {
      rows.push(this.generateCSVRow(wallet));
    }

    return rows.join('\n');
  }

  async exportToJSON(wallets) {
    return JSON.stringify(wallets, null, 2);
  }

  async exportToTXT(wallets) {
    return wallets.map(wallet => this.generateTXTEntry(wallet)).join('\n\n');
  }

  generateCSVHeader() {
    const headers = ['ID', 'Timestamp'];
    if (this.options.includeMnemonic) headers.push('Mnemonic');
    
    for (const network of this.options.networks) {
      headers.push(`${network} Address`);
      if (this.options.checkBalances) {
        headers.push(`${network} Balance`);
      }
    }

    return headers.join(',');
  }

  generateCSVRow(wallet) {
    const row = [wallet.id, wallet.timestamp];
    if (this.options.includeMnemonic) row.push(wallet.mnemonic);
    
    for (const network of this.options.networks) {
      row.push(wallet.addresses[network].address);
      if (this.options.checkBalances) {
        row.push(wallet.addresses[network].balance);
      }
    }

    return row.join(',');
  }

  generateTXTEntry(wallet) {
    const lines = [
      `Wallet #${wallet.id}`,
      `Generated: ${wallet.timestamp}`,
      this.options.includeMnemonic ? `Mnemonic: ${wallet.mnemonic}` : '',
      '\nAddresses:'
    ];

    for (const [network, data] of Object.entries(wallet.addresses)) {
      lines.push(`${network}: ${data.address}`);
      if (this.options.checkBalances) {
        lines.push(`Balance: ${data.balance} ${NETWORKS[network].symbol}`);
      }
    }

    return lines.join('\n');
  }
}