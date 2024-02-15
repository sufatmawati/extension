import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';
import { OrdinalIcon } from '@app/ui/components/icons/ordinal-icon';
import { StampsIcon } from '@app/ui/components/icons/stamps-icon';

import { ReceiveItem } from './receive-item';

interface ReceiveCollectiblesProps {
  btcAddressTaproot: string;
  btcAddressNativeSegwit: string;
  stxAddress: string;
  onCopyOrdinal(): void;
  onCopyStamp(): void;
  onCopyStacksNft(): void;
  onClickQrOrdinal(): void;
  onClickQrStacksNft(): void;
  onClickQrStamp(): void;
}
export function ReceiveCollectibles({
  btcAddressTaproot,
  btcAddressNativeSegwit,
  stxAddress,
  onCopyOrdinal,
  onCopyStamp,
  onCopyStacksNft,
  onClickQrOrdinal,
  onClickQrStacksNft,
  onClickQrStamp,
}: ReceiveCollectiblesProps) {
  return (
    <Stack>
      <ReceiveItem
        address={btcAddressTaproot}
        icon={<OrdinalIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcTaprootQrCodeBtn}
        onCopyAddress={onCopyOrdinal}
        onClickQrCode={onClickQrOrdinal}
        title="Ordinal inscription"
      />
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<StampsIcon />}
        onClickQrCode={onClickQrStamp}
        onCopyAddress={onCopyStamp}
        title="Bitcoin Stamp"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatar />}
        onCopyAddress={onCopyStacksNft}
        onClickQrCode={onClickQrStacksNft}
        title="Stacks NFT"
      />
    </Stack>
  );
}
