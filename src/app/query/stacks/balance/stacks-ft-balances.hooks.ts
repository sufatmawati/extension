import type { CryptoAssetBalance } from '@leather-wallet/models';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isDefined } from '@shared/utils';

import { useStacksAccountFungibleTokenMetadata } from '../token-metadata/fungible-tokens/fungible-token-metadata.hooks';
import { type FtAssetResponse, isFtAsset } from '../token-metadata/token-metadata.utils';
import { useStacksAccountBalanceQuery } from './stx-balance.query';

function createSip010CryptoAssetBalance(
  balance: string,
  token?: FtAssetResponse
): CryptoAssetBalance | undefined {
  if (!(token && isFtAsset(token))) return;
  return {
    availableBalance: createMoney(new BigNumber(balance), token.symbol ?? '', token.decimals),
  };
}

export function useStacksAccountBalanceFungibleTokens(address: string) {
  return useStacksAccountBalanceQuery(address, {
    select: resp => resp.fungible_tokens,
  });
}

// TODO: Asset refactor: remove if determined unnecessary
// ts-unused-exports:disable-next-line
export function useSip010CryptoAssetBalances(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  const tokenMetadata = useStacksAccountFungibleTokenMetadata(tokens);

  if (!Object.keys(tokens).length) return [];

  return Object.entries(tokens)
    .map(([_, value], i) => createSip010CryptoAssetBalance(value.balance, tokenMetadata[i].data))
    .filter(isDefined);
}
