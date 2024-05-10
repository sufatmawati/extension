import type {
  Blockchains,
  Brc20CryptoAssetInfo,
  BtcCryptoAssetBalance,
  BtcCryptoAssetInfo,
  CryptoAssetBalance,
  CryptoAssetInfo,
  CryptoAssetType,
  MarketData,
  Sip010CryptoAssetInfo,
  StxCryptoAssetBalance,
  StxCryptoAssetInfo,
} from '@leather-wallet/models';

interface AccountCryptoAssetDetails {
  balance: CryptoAssetBalance;
  chain: Blockchains;
  info: CryptoAssetInfo;
  marketData: MarketData | null;
  type: CryptoAssetType;
}

export function createAccountCryptoAssetDetailsFactory<T extends AccountCryptoAssetDetails>(
  args: T
): T {
  const { balance, chain, info, marketData, type } = args;
  return {
    balance,
    chain,
    info,
    marketData,
    type,
  } as T;
}

export interface BtcAccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  balance: BtcCryptoAssetBalance;
  info: BtcCryptoAssetInfo;
}

export interface StxAccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  balance: StxCryptoAssetBalance;
  info: StxCryptoAssetInfo;
}

export interface Brc20AccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  holderAddress: string;
  info: Brc20CryptoAssetInfo;
}

export interface Sip010AccountCryptoAssetWithDetails extends AccountCryptoAssetDetails {
  info: Sip010CryptoAssetInfo;
}

export type AccountCryptoAssetWithDetails =
  | BtcAccountCryptoAssetWithDetails
  | StxAccountCryptoAssetWithDetails
  | Brc20AccountCryptoAssetWithDetails
  | Sip010AccountCryptoAssetWithDetails;
