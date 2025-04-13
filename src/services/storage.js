import { set, get } from 'idb-keyval';

export const StorageKeys = {
  WALLETS: 'wallets',
  STATISTICS: 'statistics',
  SETTINGS: 'settings'
};

export class Storage {
  static async saveWallets(wallets) {
    await set(StorageKeys.WALLETS, wallets);
  }

  static async getWallets() {
    return await get(StorageKeys.WALLETS) || [];
  }

  static async saveStatistics(stats) {
    await set(StorageKeys.STATISTICS, stats);
  }

  static async getStatistics() {
    return await get(StorageKeys.STATISTICS) || {
      totalGenerated: 0,
      totalWithBalance: 0,
      totalValueUSD: '0',
      totalValueBTC: '0'
    };
  }

  static async saveSettings(settings) {
    await set(StorageKeys.SETTINGS, settings);
  }

  static async getSettings() {
    return await get(StorageKeys.SETTINGS) || {
      theme: 'dark',
      autoSave: true,
      notifications: true
    };
  }
}