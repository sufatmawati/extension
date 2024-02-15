import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { css } from 'leather-styles/css';
import { Stack } from 'leather-styles/jsx';

import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';

import { receiveTabStyle } from '../receive-dialog';
import { ReceiveItem } from './receive-item';

interface ReceiveTokensProps {
  btcAddressNativeSegwit: string;
  stxAddress: string;
  onCopyBtc(): void;
  onCopyStx(): void;
  onClickQrBtc(): void;
  onClickQrStx(): void;
}
export function ReceiveTokens({
  btcAddressNativeSegwit,
  stxAddress,
  onCopyBtc,
  onCopyStx,
  onClickQrBtc,
  onClickQrStx,
}: ReceiveTokensProps) {
  return (
    <Stack className={css(receiveTabStyle)}>
      <ReceiveItem
        address={btcAddressNativeSegwit}
        icon={<BtcIcon />}
        dataTestId={HomePageSelectors.ReceiveBtcNativeSegwitQrCodeBtn}
        onCopyAddress={onCopyBtc}
        onClickQrCode={onClickQrBtc}
        title="Bitcoin"
      />
      <ReceiveItem
        address={stxAddress}
        icon={<StxAvatar />}
        dataTestId={HomePageSelectors.ReceiveStxQrCodeBtn}
        onCopyAddress={onCopyStx}
        onClickQrCode={onClickQrStx}
        title="Stacks"
      />
    </Stack>
  );
}
