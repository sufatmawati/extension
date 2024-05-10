import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { stxCryptoAssetPlaceholder } from '@app/query/stacks/stx/stx-crypto-asset.hooks';
import { StxAvatarIcon } from '@app/ui/components/avatar/stx-avatar-icon';

import { ConnectLedgerButton } from '../../components/connect-ledger-asset-button';

export function StxCryptoAssetItemFallback() {
  return (
    <CryptoAssetItemLayout
      asset={stxCryptoAssetPlaceholder}
      icon={<StxAvatarIcon />}
      name={stxCryptoAssetPlaceholder.info.name}
      rightElement={<ConnectLedgerButton chain={stxCryptoAssetPlaceholder.chain} />}
    />
  );
}
