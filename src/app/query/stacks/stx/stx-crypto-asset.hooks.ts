import type { StxCryptoAssetInfo } from '@leather-wallet/models';

import { STX_DECIMALS } from '@shared/constants';
import { createMoney } from '@shared/models/money.model';
import { isUndefined } from '@shared/utils';

import { useCryptoCurrencyMarketDataMeanAverage } from '@app/query/common/market-data/market-data.hooks';
import {
  type StxAccountCryptoAssetWithDetails,
  createAccountCryptoAssetDetailsFactory,
} from '@app/query/models/crypto-asset.model';

import { useStxCryptoAssetBalance } from '../balance/stx-balance.hooks';

const stxCryptoAssetInfo: StxCryptoAssetInfo = {
  decimals: STX_DECIMALS,
  hasMemo: true,
  name: 'stacks',
  symbol: 'STX',
};

const stxCryptoAssetBalancePlaceholder = {
  availableBalance: createMoney(0, 'STX'),
  availableUnlockedBalance: createMoney(0, 'STX'),
  inboundBalance: createMoney(0, 'STX'),
  lockedBalance: createMoney(0, 'STX'),
  outboundBalance: createMoney(0, 'STX'),
  pendingBalance: createMoney(0, 'STX'),
  totalBalance: createMoney(0, 'STX'),
  unlockedBalance: createMoney(0, 'STX'),
};

export const stxCryptoAssetPlaceholder =
  createAccountCryptoAssetDetailsFactory<StxAccountCryptoAssetWithDetails>({
    balance: stxCryptoAssetBalancePlaceholder,
    chain: 'stacks',
    info: stxCryptoAssetInfo,
    marketData: null,
    type: 'stx',
  });

export function useStxCryptoAsset(address: string) {
  const { data: balance, isInitialLoading } = useStxCryptoAssetBalance(address);
  const marketData = useCryptoCurrencyMarketDataMeanAverage('STX');

  if (isUndefined(balance)) return { asset: stxCryptoAssetPlaceholder, isInitialLoading };

  return {
    asset: createAccountCryptoAssetDetailsFactory<StxAccountCryptoAssetWithDetails>({
      balance,
      chain: 'stacks',
      info: stxCryptoAssetInfo,
      marketData,
      type: 'stx',
    }),
    isInitialLoading,
  };
}
