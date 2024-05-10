import { useMemo } from 'react';

import type { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import type { Sip010CryptoAssetInfo } from '@leather-wallet/models';
import BigNumber from 'bignumber.js';

import { createMoney } from '@shared/models/money.model';
import { isDefined, isUndefined } from '@shared/utils';

import { getTicker, pullContractIdFromIdentity } from '@app/common/utils';
import {
  useAlexCurrencyPriceAsMarketData,
  useAlexSwappableAssets,
} from '@app/query/common/alex-sdk/alex-sdk.hooks';
import {
  type AccountCryptoAssetWithDetails,
  type Sip010AccountCryptoAssetWithDetails,
  createAccountCryptoAssetDetailsFactory,
} from '@app/query/models/crypto-asset.model';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

import { useStacksAccountBalanceFungibleTokens } from '../balance/stacks-ft-balances.hooks';
import { useStacksAccountFungibleTokenMetadata } from '../token-metadata/fungible-tokens/fungible-token-metadata.hooks';
import { isFtAsset } from '../token-metadata/token-metadata.utils';
import { type Sip010CryptoAssetFilter, filterSip010CryptoAssets } from './sip010-tokens.utils';

export function isTransferableStacksFungibleTokenAsset(asset: Partial<FtMetadataResponse>) {
  return !isUndefined(asset.decimals) && !isUndefined(asset.name) && !isUndefined(asset.symbol);
}

export function getSip010InfoFromAsset(asset: AccountCryptoAssetWithDetails) {
  if ('contractId' in asset.info) return asset.info;
  return;
}

function createSip010CryptoAssetInfo(
  contractId: string,
  key: string,
  token: FtMetadataResponse
): Sip010CryptoAssetInfo {
  const { assetName, contractName } = getAssetStringParts(key);
  const name = token.name ? token.name : assetName;

  return {
    canTransfer: isTransferableStacksFungibleTokenAsset(token),
    contractId,
    contractName,
    decimals: token.decimals ?? 0,
    hasMemo: isTransferableStacksFungibleTokenAsset(token),
    imageCanonicalUri: token.image_canonical_uri ?? '',
    name,
    symbol: token.symbol ?? getTicker(name),
  };
}

const sip010CryptoAssetBalancePlaceholder = { availableBalance: createMoney(0, '', 0) };

const sip010CryptoAssetPlaceholder =
  createAccountCryptoAssetDetailsFactory<Sip010AccountCryptoAssetWithDetails>({
    balance: sip010CryptoAssetBalancePlaceholder,
    chain: 'stacks',
    info: createSip010CryptoAssetInfo('', '', { sender_address: '', tx_id: '' }),
    marketData: null,
    type: 'sip-010',
  });

export function useSip010CryptoAssets(address: string) {
  const { data: tokens = {} } = useStacksAccountBalanceFungibleTokens(address);
  const tokenMetadata = useStacksAccountFungibleTokenMetadata(tokens);
  const priceAsMarketData = useAlexCurrencyPriceAsMarketData();

  if (!Object.keys(tokens).length) return [];

  return Object.entries(tokens)
    .map(([key, value], i) => {
      const token = tokenMetadata[i].data;
      if (!(token && isFtAsset(token))) return;
      const contractId = pullContractIdFromIdentity(key);

      return createAccountCryptoAssetDetailsFactory<Sip010AccountCryptoAssetWithDetails>({
        balance: {
          availableBalance: createMoney(
            new BigNumber(value.balance),
            token.symbol ?? '',
            token.decimals ?? 0
          ),
        },
        chain: 'stacks',
        info: createSip010CryptoAssetInfo(contractId, key, token),
        marketData: priceAsMarketData(contractId, token.symbol),
        type: 'sip-010',
      });
    })
    .filter(isDefined)
    .filter(asset => asset.balance.availableBalance.amount.isGreaterThan(0));
}

export function useSip010CryptoAsset(contractId: string) {
  const address = useCurrentStacksAccountAddress();
  const assets = useSip010CryptoAssets(address);
  return assets.find(asset => asset.info.contractId === contractId) ?? sip010CryptoAssetPlaceholder;
}

interface useFilteredStacksFungibleTokenListArgs {
  address: string;
  filter?: Sip010CryptoAssetFilter;
}
export function useFilteredSip010CryptoAssetList({
  address,
  filter = 'all',
}: useFilteredStacksFungibleTokenListArgs) {
  const assets = useSip010CryptoAssets(address);
  const { data: swapAssets = [] } = useAlexSwappableAssets();

  return useMemo(
    () => filterSip010CryptoAssets(assets, swapAssets, filter),
    [assets, swapAssets, filter]
  );
}

// TODO: Asset refactor: remove if determined unnecessary
// ts-unused-exports:disable-next-line
export function useTransferableSip010CryptoAssets(
  address: string
): Sip010AccountCryptoAssetWithDetails[] {
  const assets = useSip010CryptoAssets(address);
  return useMemo(() => assets.filter(asset => asset.info.canTransfer), [assets]);
}
