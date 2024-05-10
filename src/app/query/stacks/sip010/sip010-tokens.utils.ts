import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import type { Sip010AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { getAssetStringParts } from '@app/ui/utils/get-asset-string-parts';

export type Sip010CryptoAssetFilter = 'all' | 'supported' | 'unsupported';

export function filterSip010CryptoAssets(
  assets: Sip010AccountCryptoAssetWithDetails[],
  swapAssets: SwapAsset[],
  filter: Sip010CryptoAssetFilter
) {
  return assets.filter(asset => {
    const { address: contractAddress } = getAssetStringParts(asset.info.contractId);
    if (filter === 'supported') {
      return swapAssets.some(swapAsset => swapAsset.principal.includes(contractAddress));
    }
    if (filter === 'unsupported') {
      return !swapAssets.some(swapAsset => swapAsset.principal.includes(contractAddress));
    }
    return assets;
  });
}
