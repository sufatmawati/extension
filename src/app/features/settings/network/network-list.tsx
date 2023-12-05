import { useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';

import { WalletDefaultNetworkConfigurationIds } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { NetworkListItem } from '@app/features/settings/network/network-list-item';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useCurrentNetworkState, useNetworksActions } from '@app/store/networks/networks.hooks';
import { useNetworks } from '@app/store/networks/networks.selectors';
import { Button } from '@app/ui/components/button/button';
import { DropdownMenu } from '@app/ui/components/dropdown-menu/dropdown-menu';

const defaultNetworkIds = Object.values(WalletDefaultNetworkConfigurationIds) as string[];

export function NetworkList() {
  useBackgroundLocationRedirect();
  const navigate = useNavigate();
  const networks = useNetworks();
  const analytics = useAnalytics();
  const networksActions = useNetworksActions();
  const currentNetwork = useCurrentNetworkState();

  function addNetwork() {
    void analytics.track('add_network');
    navigate(RouteUrls.AddNetwork);
  }

  function removeNetwork(id: string) {
    void analytics.track('remove_network');
    networksActions.removeNetwork(id);
  }

  function selectNetwork(id: string) {
    void analytics.track('change_network', { id });
    networksActions.changeNetwork(id);
  }

  return (
    <>
      {Object.keys(networks).map(id => (
        <NetworkListItem
          key={id}
          networkId={id}
          onNetworkSelected={id => selectNetwork(id)}
          isCustom={!defaultNetworkIds.includes(id)}
          onRemoveNetwork={id => {
            if (id === currentNetwork.id) networksActions.changeNetwork('mainnet');
            removeNetwork(id);
          }}
        />
      ))}

      <DropdownMenu.Item>
        <Button data-testid={SettingsSelectors.BtnAddNetwork} fullWidth onClick={addNetwork}>
          Add a network
        </Button>
      </DropdownMenu.Item>
    </>
  );
}
