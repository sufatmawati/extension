import { FtMetadataResponse } from '@hirosystems/token-metadata-api-client';
import BigNumber from 'bignumber.js';

import { STX_DECIMALS } from '@shared/constants';
import type { AccountBalanceResponseBigNumber } from '@shared/models/account.model';
import type {
  StacksCryptoCurrencyAssetBalance,
  StacksFungibleTokenAssetBalance,
} from '@shared/models/crypto-asset-balance.model';
import { type MarketData } from '@shared/models/market.model';
import { createMoney } from '@shared/models/money.model';

import { isTransferableStacksFungibleTokenAsset } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

export function createStacksCryptoCurrencyAssetTypeWrapper(
  balance: BigNumber
): StacksCryptoCurrencyAssetBalance {
  return {
    blockchain: 'stacks',
    type: 'crypto-currency',
    balance: createMoney(balance, 'STX'),
    asset: {
      decimals: STX_DECIMALS,
      hasMemo: true,
      name: 'Stacks',
      symbol: 'STX',
    },
  };
}

export function createStacksFtCryptoAssetBalanceTypeWrapper(
  balance: BigNumber,
  contractId: string
): StacksFungibleTokenAssetBalance {
  const { address, contractName, assetName } = getAssetStringParts(contractId);
  return {
    blockchain: 'stacks',
    type: 'fungible-token',
    balance: createMoney(balance, '', 0),
    asset: {
      contractId,
      canTransfer: false,
      contractAddress: address,
      contractAssetName: assetName,
      contractName,
      decimals: 0,
      hasMemo: false,
      imageCanonicalUri: '',
      name: '',
      marketData: null,
      symbol: '',
    },
  };
}

export function convertFtBalancesToStacksFungibleTokenAssetBalanceType(
  ftBalances: AccountBalanceResponseBigNumber['fungible_tokens']
) {
  return (
    Object.entries(ftBalances)
      .map(([key, value]) => {
        const balance = new BigNumber(value.balance);
        return createStacksFtCryptoAssetBalanceTypeWrapper(balance, key);
      })
      // Assets users have traded will persist in the api response
      .filter(assetBalance => !assetBalance?.balance.amount.isEqualTo(0))
  );
}

export function addQueriedMetadataToInitializedStacksFungibleTokenAssetBalance(
  assetBalance: StacksFungibleTokenAssetBalance,
  metadata: FtMetadataResponse,
  marketData: MarketData | null
) {
  return {
    ...assetBalance,
    balance: createMoney(
      assetBalance.balance.amount,
      metadata.symbol ?? '',
      metadata.decimals ?? 0
    ),
    asset: {
      ...assetBalance.asset,
      canTransfer: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      decimals: metadata.decimals ?? 0,
      hasMemo: isTransferableStacksFungibleTokenAsset(assetBalance.asset),
      imageCanonicalUri: metadata.image_canonical_uri ?? '',
      name: metadata.name ?? '',
      marketData,
      symbol: metadata.symbol ?? '',
    },
  };
}

export function getStacksFungibleTokenCurrencyAssetBalance(
  selectedAssetBalance?: StacksCryptoCurrencyAssetBalance | StacksFungibleTokenAssetBalance
) {
  return selectedAssetBalance?.type === 'fungible-token' && selectedAssetBalance.asset.canTransfer
    ? selectedAssetBalance
    : undefined;
}
