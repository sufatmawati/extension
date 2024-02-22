import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useLocationState } from '@app/common/hooks/use-location-state';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useZeroIndexTaprootAddress } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';
import { useCurrentAccountNativeSegwitAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { BigTitle } from '@app/ui/components/containers/headers/header';
import { Tabs } from '@app/ui/components/tabs/tabs';

import { ReceiveCollectibles } from './components/receive-collectibles';
import { ReceiveTokens } from './components/receive-tokens';

type ReceiveDialog = 'full' | 'collectible';

// TODO ask design ideally all tabs should match but choose-fee has a different variation
export const receiveTabStyle = {
  mt: 'space.03',
  paddingX: 'space.03',
  pb: 'space.05',
};

interface ReceiveDialogProps {
  type?: 'full' | 'collectible';
}

export function ReceiveDialog({ type = 'full' }: ReceiveDialogProps) {
  useBackgroundLocationRedirect();
  const analytics = useAnalytics();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');
  const navigate = useNavigate();
  const location = useLocation();
  const btcAddressNativeSegwit = useCurrentAccountNativeSegwitAddressIndexZero();
  const stxAddress = useCurrentAccountStxAddressState();
  const accountIndex = get(location.state, 'accountIndex', undefined);
  const btcAddressTaproot = useZeroIndexTaprootAddress(accountIndex);

  const title = type === 'full' ? 'Choose asset to receive' : 'Receive collectible';

  function Collectibles() {
    return (
      <ReceiveCollectibles
        btcAddressTaproot={btcAddressTaproot}
        btcAddressNativeSegwit={btcAddressNativeSegwit}
        stxAddress={stxAddress}
        onCopyStamp={() => {
          void analytics.track('select_stamp_to_add_new_collectible');
          toast.success('Copied to clipboard!');
          navigator.clipboard.writeText(btcAddressNativeSegwit);
        }}
        onCopyStacksNft={() => {
          void analytics.track('select_nft_to_add_new_collectible');
          toast.success('Copied to clipboard!');
          navigator.clipboard.writeText(stxAddress);
        }}
        onCopyOrdinal={() => {
          void analytics.track('copy_address_to_clipboard');
          toast.success('Copied to clipboard!');
          navigator.clipboard.writeText(btcAddressNativeSegwit);
        }}
        onClickQrOrdinal={() => {
          void analytics.track('select_inscription_to_add_new_collectible');
          navigate(`${RouteUrls.Home}${RouteUrls.ReceiveCollectibleOrdinal}`, {
            state: {
              btcAddressTaproot,
              backgroundLocation,
            },
          });
        }}
        onClickQrStamp={() =>
          navigate(`${RouteUrls.Home}${RouteUrls.ReceiveBtcStamp}`, {
            state: { backgroundLocation },
          })
        }
        onClickQrStacksNft={() =>
          navigate(`${RouteUrls.Home}${RouteUrls.ReceiveStx}`, {
            state: { backgroundLocation },
          })
        }
      />
    );
  }

  return (
    <Dialog
      title={<BigTitle title={title} />}
      onClose={() => navigate(backgroundLocation ?? '..')}
      isShowing
    >
      {type === 'collectible' && <Collectibles />}
      {type === 'full' && (
        <Tabs.Root defaultValue="tokens">
          <Tabs.List>
            <Tabs.Trigger value="tokens" data-testid="tab-asset">
              Tokens
            </Tabs.Trigger>
            <Tabs.Trigger value="collectibles" data-testid="tab-collectible">
              Collectibles
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tokens">
            <ReceiveTokens
              btcAddressNativeSegwit={btcAddressNativeSegwit}
              stxAddress={stxAddress}
              onCopyBtc={() => {
                void analytics.track('copy_address_to_clipboard');
                toast.success('Copied to clipboard!');
                navigator.clipboard.writeText(btcAddressNativeSegwit);
              }}
              onCopyStx={() => {
                void analytics.track('copy_address_to_clipboard');
                toast.success('Copied to clipboard!');
                navigator.clipboard.writeText(stxAddress);
              }}
              onClickQrBtc={() =>
                navigate(`${RouteUrls.Home}${RouteUrls.ReceiveBtc}`, {
                  state: { backgroundLocation },
                })
              }
              onClickQrStx={() =>
                navigate(`${RouteUrls.Home}${RouteUrls.ReceiveStx}`, {
                  state: { backgroundLocation, btcAddressTaproot },
                })
              }
            />
          </Tabs.Content>
          <Tabs.Content value="collectibles">{/* <Collectibles /> */}</Tabs.Content>
        </Tabs.Root>
      )}
    </Dialog>
  );
}
