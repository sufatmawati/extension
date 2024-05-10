import type { BtcCryptoAssetInfo } from '@leather-wallet/models';

import { BTC_DECIMALS } from '@shared/constants';
import { createMoney } from '@shared/models/money.model';

import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import { createAccountCryptoAssetDetailsFactory } from '@app/query/models/crypto-asset.model';

import type { BtcAccountCryptoAssetWithDetails } from '../../models/crypto-asset.model';
import { useBtcCryptoAssetBalanceNativeSegwit } from '../balance/btc-balance-native-segwit.hooks';

const btcCryptoAssetInfo: BtcCryptoAssetInfo = {
  decimals: BTC_DECIMALS,
  hasMemo: false,
  name: 'bitcoin',
  symbol: 'BTC',
};

const btcCryptoAssetBalancePlaceholder = {
  availableBalance: createMoney(0, 'BTC'),
  protectedBalance: createMoney(0, 'BTC'),
  uneconomicalBalance: createMoney(0, 'BTC'),
};

// TODO: Asset refactor: remove if determined unnecessary
// ts-unused-exports:disable-next-line
export const btcCryptoAssetPlaceholder =
  createAccountCryptoAssetDetailsFactory<BtcAccountCryptoAssetWithDetails>({
    balance: btcCryptoAssetBalancePlaceholder,
    chain: 'bitcoin',
    info: btcCryptoAssetInfo,
    marketData: null,
    type: 'btc',
  });

export function useBtcCryptoAsset(address: string) {
  const { btcCryptoAssetBalance, isInitialLoading } = useBtcCryptoAssetBalanceNativeSegwit(address);
  const marketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  return {
    asset: createAccountCryptoAssetDetailsFactory<BtcAccountCryptoAssetWithDetails>({
      balance: btcCryptoAssetBalance,
      chain: 'bitcoin',
      info: btcCryptoAssetInfo,
      marketData,
      type: 'btc',
    }),
    isInitialLoading,
  };
}
