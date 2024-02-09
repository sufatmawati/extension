import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useDialogs } from '@app/common/hooks/use-dialogs';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { useWalletType } from '@app/common/use-wallet-type';
import { openInNewTab, openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { SignOut } from '@app/features/settings/sign-out/sign-out-confirm';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys, useLedgerDeviceTargetId } from '@app/store/ledger/ledger.selectors';
import { useCurrentNetworkId } from '@app/store/networks/networks.selectors';
import { DropdownMenu } from '@app/ui/components/dropdown-menu/dropdown-menu';
import { Flag } from '@app/ui/components/flag/flag';
import { ChevronsRightIcon } from '@app/ui/components/icons/chevrons-right-icon';
import { ExternalLinkIcon } from '@app/ui/components/icons/external-link-icon';
import { PlaceholderIcon } from '@app/ui/components/icons/placeholder-icon';
import { SwapIcon } from '@app/ui/components/icons/swap-icon';
import { Caption } from '@app/ui/components/typography/caption';

import { openFeedbackDialog } from '../feedback-button/feedback-button';
import { extractDeviceNameFromKnownTargetIds } from '../ledger/utils/generic-ledger-utils';
// import { AdvancedMenuItems } from './components/advanced-menu-items';
import { LedgerDeviceItemRow } from './components/ledger-item-row';
import { NetworkList } from './network/network-list';
import { ThemeList } from './theme/theme-list';

export function Settings({ triggerButton }: { triggerButton: React.ReactNode }) {
  // const ref = useRef<HTMLDivElement | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);
  const hasGeneratedWallet = !!useCurrentStacksAccount();
  const { lockWallet } = useKeyActions();

  const currentNetworkId = useCurrentNetworkId();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const targetId = useLedgerDeviceTargetId();

  const location = useLocation();

  const isLedger = useHasLedgerKeys();
  const { setIsShowingSwitchAccountsState } = useDialogs();
  // FIXME #4370 task 1 - need to fix these button links and also lock / theme in extension mode as mentioned above
  // just open dialogs with no routes
  // >

  // > keep going here, good progress
  // > investigate AdvancedMenuItems, even with hidden items
  // > fix issue with sign out

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{triggerButton}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              {isLedger && targetId && (
                <DropdownMenu.Item>
                  <LedgerDeviceItemRow deviceType={extractDeviceNameFromKnownTargetIds(targetId)} />
                </DropdownMenu.Item>
              )}
              {hasGeneratedWallet && (
                <DropdownMenu.Item
                  data-testid={SettingsSelectors.SwitchAccountTrigger}
                  onClick={() => setIsShowingSwitchAccountsState(true)}
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
                  <Flag img={<PlaceholderIcon />} textStyle="label.02">
                    View Secret Key
                  </Flag>
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger
                  data-testid={SettingsSelectors.ToggleTheme}
                  // onClick={() => {
                  //   void analytics.track('click_change_theme_menu_item');
                  // }}
                >
                  <Flag img={<PlaceholderIcon />} textStyle="label.02">
                    Change theme
                  </Flag>
                  <div className="RightSlot">
                    <ChevronsRightIcon />
                  </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className="DropdownMenuSubContent"
                    sideOffset={2}
                    alignOffset={-5}
                  >
                    <DropdownMenu.Label>Change theme</DropdownMenu.Label>
                    <ThemeList />
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
              <DropdownMenu.Item
                // hideFrom="md" // FIXME - improve this to not load DropdownMenu.Item also
                data-testid={SettingsSelectors.OpenWalletInNewTab}
                onClick={() => {
                  void analytics.track('click_open_in_new_tab_menu_item');
                  openIndexPageInNewTab(location.pathname);
                }}
              >
                <Flag img={<PlaceholderIcon />} textStyle="label.02">
                  <Flex justifyContent="space-between">
                    Open in new tab
                    <ExternalLinkIcon />
                  </Flex>
                </Flag>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                data-testid={SettingsSelectors.GetSupportMenuItem}
                onClick={() => {
                  openInNewTab('https://leather.gitbook.io/guides/installing/contact-support');
                }}
              >
                <Flag img={<PlaceholderIcon />} textStyle="label.02">
                  <Flex justifyContent="space-between">
                    Get support
                    <ExternalLinkIcon />
                  </Flex>
                </Flag>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  openFeedbackDialog();
                }}
              >
                <Flag img={<PlaceholderIcon />} textStyle="label.02">
                  Give feedback
                </Flag>
              </DropdownMenu.Item>
              {hasGeneratedWallet ? <DropdownMenu.Separator /> : null}

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger
                  data-testid={SettingsSelectors.ChangeNetworkAction}
                  // onClick={() => {
                  //   void analytics.track('click_change_network_menu_item');
                  // }}
                >
                  {/* // use item instead of flag here */}
                  <Flag img={<PlaceholderIcon />} textStyle="label.02">
                    <Flex width="100%" alignItems="center" justifyContent="space-between">
                      <Box>Change network</Box>
                      <Caption data-testid={SettingsSelectors.CurrentNetwork}>
                        {currentNetworkId}
                      </Caption>
                    </Flex>
                  </Flag>
                  <div>
                    <ChevronsRightIcon />
                  </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className="DropdownMenuSubContent"
                    sideOffset={2}
                    alignOffset={-5}
                  >
                    <DropdownMenu.Label>Change network</DropdownMenu.Label>
                    <NetworkList />
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator />

              {/* TODO - refactor this section */}
              {/* {showAdvancedMenuOptions && (
              <AdvancedMenuItems
                closeHandler={wrappedCloseCallback}
                settingsShown={isShowingSettings}
              />
            )} */}
              {hasGeneratedWallet && walletType === 'software' && (
                <DropdownMenu.Item
                  onClick={() => {
                    void analytics.track('lock_session');
                    void lockWallet();
                    navigate(RouteUrls.Unlock);
                  }}
                  data-testid={SettingsSelectors.LockListItem}
                >
                  <Flag img={<PlaceholderIcon />} textStyle="label.02">
                    Lock
                  </Flag>
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Item
                color="error.label"
                onClick={
                  () => setShowSignOut(!showSignOut)
                  // navigate(RouteUrls.SignOutConfirm, {
                  //   relative: linkRelativeType,
                  //   state: { backgroundLocation: location },
                  // })
                }
                data-testid={SettingsSelectors.SignOutListItem}
              >
                <Flag img={<PlaceholderIcon />} textStyle="label.02">
                  Sign out
                </Flag>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <SignOut isShowing={showSignOut} onClose={() => setShowSignOut(!showSignOut)} />
    </>
  );
}
