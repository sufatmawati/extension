import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { btcCryptoAssetPlaceholder } from '@app/query/bitcoin/btc/btc-crypto-asset.hooks';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';

import { ConnectLedgerButton } from '../../components/connect-ledger-asset-button';

export function BtcCryptoAssetItemFallback() {
  return (
    <CryptoAssetItemLayout
      asset={btcCryptoAssetPlaceholder}
      icon={<BtcAvatarIcon />}
      name={btcCryptoAssetPlaceholder.info.name}
      rightElement={<ConnectLedgerButton chain={btcCryptoAssetPlaceholder.chain} />}
    />
  );
}
