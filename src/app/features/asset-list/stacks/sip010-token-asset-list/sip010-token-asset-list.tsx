import { Stack } from 'leather-styles/jsx';

import { isDefined } from '@shared/utils';

import type { AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { useFilteredSip010CryptoAssetList } from '@app/query/stacks/sip010/sip010-tokens.hooks';

import { Sip010TokenAssetItem } from './sip010-token-asset-item';

interface Sip010TokenAssetListProps {
  address: string;
  onClick?(asset: AccountCryptoAssetWithDetails): void;
}
export function Sip010TokenAssetList({ address, onClick }: Sip010TokenAssetListProps) {
  const assets = useFilteredSip010CryptoAssetList({
    address,
    filter: isDefined(onClick) ? 'all' : 'supported',
  });

  if (!assets.length) return null;

  return (
    <Stack>
      {assets.map(asset => (
        <Sip010TokenAssetItem asset={asset} key={asset.info.contractId} onClick={onClick} />
      ))}
    </Stack>
  );
}
