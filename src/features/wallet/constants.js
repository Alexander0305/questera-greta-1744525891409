import { networkThemes } from './theme/networkThemes';

export const NETWORKS = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/icons/btc.svg',
    enabled: true,
    decimals: 8,
    ...networkThemes.BTC
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/icons/eth.svg',
    enabled: true,
    decimals: 18,
    rpcUrl: [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth',
      'https://ethereum.publicnode.com'
    ],
    ...networkThemes.ETH
  },
  BSC: {
    name: 'BNB Chain',
    symbol: 'BNB',
    icon: '/icons/bnb.svg',
    enabled: true,
    decimals: 18,
    rpcUrl: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org'
    ],
    ...networkThemes.BSC
  },
  MATIC: {
    name: 'Polygon',
    symbol: 'MATIC',
    icon: '/icons/matic.svg',
    enabled: true,
    decimals: 18,
    rpcUrl: [
      'https://polygon-rpc.com',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com'
    ],
    ...networkThemes.MATIC
  }
};

export const PUZZLE_RANGES = {
  PUZZLE_66: {
    start: '20000000000000000',
    end: '3ffffffffffffffff',
    name: 'Puzzle 66',
    reward: '1 BTC'
  },
  PUZZLE_120: {
    start: '1000000000000000000000000000000',
    end: '1fffffffffffffffffffffffffffff',
    name: 'Puzzle 120',
    reward: '10 BTC'
  }
};

export const VANITY_PATTERNS = {
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  CONTAINS: 'contains',
  CUSTOM_REGEX: 'custom_regex'
};

export const SEARCH_MODES = {
  VANITY: 'vanity',
  PUZZLE: 'puzzle',
  AI: 'ai',
  BULK: 'bulk'
};