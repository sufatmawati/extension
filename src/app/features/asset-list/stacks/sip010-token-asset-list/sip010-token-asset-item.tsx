import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { StacksAssetAvatar } from '@app/components/stacks-asset-avatar';
import type {
  AccountCryptoAssetWithDetails,
  Sip010AccountCryptoAssetWithDetails,
} from '@app/query/models/crypto-asset.model';

import { parseSip010TokenCryptoAssetBalance } from './sip010-token-asset-item.utils';

interface Sip010TokenAssetItemProps {
  asset: Sip010AccountCryptoAssetWithDetails;
  onClick?(asset: AccountCryptoAssetWithDetails): void;
}
export function Sip010TokenAssetItem({ asset, onClick }: Sip010TokenAssetItemProps) {
  const { avatar, fiatBalance, imageCanonicalUri, title } =
    parseSip010TokenCryptoAssetBalance(asset);

  return (
    <CryptoAssetItemLayout
      asset={asset}
      fiatBalance={fiatBalance}
      caption={asset.info.symbol}
      icon={
        <StacksAssetAvatar
          color="white"
          gradientString={avatar}
          imageCanonicalUri={imageCanonicalUri}
        >
          {title[0]}
        </StacksAssetAvatar>
      }
      name={asset.info.name}
      onClick={onClick}
    />
  );
}
