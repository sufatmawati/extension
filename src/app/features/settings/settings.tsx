import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { css } from 'leather-styles/css';
import { Flex, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useModifierKey } from '@app/common/hooks/use-modifier-key';
import { useWalletType } from '@app/common/use-wallet-type';
import { openInNewTab, openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { AppVersion } from '@app/components/app-version';
import { Divider } from '@app/components/layout/divider';
import { NetworkDialog } from '@app/features/settings/network/network';
import { SignOut } from '@app/features/settings/sign-out/sign-out-confirm';
import { ThemeDialog } from '@app/features/settings/theme/theme-dialog';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys, useLedgerDeviceTargetId } from '@app/store/ledger/ledger.selectors';
import { useCurrentNetworkId } from '@app/store/networks/networks.selectors';
import { DropdownMenu } from '@app/ui/components/dropdown-menu/dropdown-menu';
import { Flag } from '@app/ui/components/flag/flag';
import { Caption } from '@app/ui/components/typography/caption';
import {
  ExitIcon,
  ExpandIcon,
  ExternalLinkIcon,
  KeyIcon,
  LockIcon,
  MegaphoneIcon,
  SunInCloudIcon,
  SupportIcon,
  SwapIcon,
  WorldIcon,
} from '@app/ui/icons/';

import { openFeedbackDialog } from '../feedback-button/feedback-button';
import { extractDeviceNameFromKnownTargetIds } from '../ledger/utils/generic-ledger-utils';
import { AdvancedMenuItems } from './components/advanced-menu-items';
import { LedgerDeviceItemRow } from './components/ledger-item-row';

interface SettingsProps {
  triggerButton: React.ReactNode;
  toggleSwitchAccount(): void;
}
export function Settings({ triggerButton, toggleSwitchAccount }: SettingsProps) {
  const [showSignOut, setShowSignOut] = useState(false);
  const [showChangeTheme, setShowChangeTheme] = useState(false);
  const [showChangeNetwork, setShowChangeNetwork] = useState(false);
  const hasGeneratedWallet = !!useCurrentStacksAccount();
  const { lockWallet } = useKeyActions();

  const currentNetworkId = useCurrentNetworkId();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const targetId = useLedgerDeviceTargetId();

  const location = useLocation();

  const isLedger = useHasLedgerKeys();
  const { isPressed: showAdvancedMenuOptions } = useModifierKey('alt', 120);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.IconButton>{triggerButton}</DropdownMenu.IconButton>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            side="bottom"
            sideOffset={8}
            className={css({
              width: 'settingsMenuWidth',
            })}
          >
            <DropdownMenu.Group>
              {isLedger && targetId && (
                <DropdownMenu.Item>
                  <LedgerDeviceItemRow deviceType={extractDeviceNameFromKnownTargetIds(targetId)} />
                </DropdownMenu.Item>
              )}
              {hasGeneratedWallet && (
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.SwitchAccountTrigger}
                  onClick={toggleSwitchAccount}
                >
                  <Flag img={<SwapIcon />} textStyle="label.02">
                    Switch account
                  </Flag>
                </DropdownMenu.Item>
              )}
              {hasGeneratedWallet && walletType === 'software' && (
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.ViewSecretKeyListItem}
                  onClick={() => navigate(RouteUrls.ViewSecretKey)}
                >
                  <Flag img={<KeyIcon />} textStyle="label.02">
                    View Secret Key
                  </Flag>
                </DropdownMenu.Item>
              )}
              <styled.div hideFrom="md">
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.OpenWalletInNewTab}
                  onClick={() => {
                    void analytics.track('click_open_in_new_tab_menu_item');
                    openIndexPageInNewTab(location.pathname);
                  }}
                >
                  <Flag img={<ExpandIcon />} textStyle="label.02">
                    Maximize
                  </Flag>
                </DropdownMenu.Item>
              </styled.div>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.ChangeNetworkAction}
                onClick={() => {
                  void analytics.track('click_change_network_menu_item');
                  setShowChangeNetwork(!showChangeNetwork);
                }}
              >
                <Flag img={<WorldIcon />}>
                  <Flex justifyContent="space-between">
                    <styled.span textStyle="label.02">Change network</styled.span>
                    <Caption data-testid={SettingsSelectors.CurrentNetwork}>
                      {currentNetworkId}
                    </Caption>
                  </Flex>
                </Flag>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.ToggleTheme}
                onClick={() => {
                  void analytics.track('click_change_theme_menu_item');
                  setShowChangeTheme(!showChangeTheme);
                }}
              >
                <Flag img={<SunInCloudIcon />}>
                  <Flex justifyContent="space-between" textStyle="label.02">
                    Change theme
                  </Flex>
                </Flag>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <Divider />
            <DropdownMenu.Group>
              <DropdownMenu.Item
                data-testid={SettingsSelectors.GetSupportMenuItem}
                onClick={() => {
                  openInNewTab('https://leather.gitbook.io/guides/installing/contact-support');
                }}
              >
                <Flag img={<SupportIcon />} textStyle="label.02">
                  <Flex justifyContent="space-between">
                    Get support
                    <ExternalLinkIcon variant="small" />
                  </Flex>
                </Flag>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => openFeedbackDialog()}>
                <Flag img={<MegaphoneIcon />} textStyle="label.02">
                  Give feedback
                </Flag>
              </DropdownMenu.Item>
            </DropdownMenu.Group>

            <Divider />
            <DropdownMenu.Group>
              {showAdvancedMenuOptions && <AdvancedMenuItems />}
              {hasGeneratedWallet && walletType === 'software' && (
                <DropdownMenu.Item
                  onClick={() => {
                    void analytics.track('lock_session');
                    void lockWallet();
                    navigate(RouteUrls.Unlock);
                  }}
                  data-testid={SettingsSelectors.LockListItem}
                >
                  <Flag img={<LockIcon />} textStyle="label.02">
                    Lock
                  </Flag>
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Item
                onClick={() => setShowSignOut(!showSignOut)}
                data-testid={SettingsSelectors.SignOutListItem}
              >
                <Flag color="red.action-primary-default" img={<ExitIcon />} textStyle="label.02">
                  Sign out
                </Flag>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <AppVersion />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <SignOut isShowing={showSignOut} onClose={() => setShowSignOut(!showSignOut)} />
      <ThemeDialog
        isShowing={showChangeTheme}
        onClose={() => setShowChangeTheme(!showChangeTheme)}
      />
      <NetworkDialog
        isShowing={showChangeNetwork}
        onClose={() => setShowChangeNetwork(!showChangeNetwork)}
      />
    </>
  );
}
