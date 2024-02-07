// import { useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex, HStack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
// import { useDialogs } from '@app/common/hooks/use-dialogs';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
// import { useModifierKey } from '@app/common/hooks/use-modifier-key';
// import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { useWalletType } from '@app/common/use-wallet-type';
// import { whenPageMode } from '@app/common/utils';
import { openInNewTab, openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { Divider } from '@app/components/layout/divider';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys, useLedgerDeviceTargetId } from '@app/store/ledger/ledger.selectors';
import { useCurrentNetworkId } from '@app/store/networks/networks.selectors';
import { DropdownMenu } from '@app/ui/components/dropdown-menu/dropdown-menu';
import { ExternalLinkIcon } from '@app/ui/components/icons/external-link-icon';
import { Caption } from '@app/ui/components/typography/caption';

import { openFeedbackDialog } from '../feedback-button/feedback-button';
import { extractDeviceNameFromKnownTargetIds } from '../ledger/utils/generic-ledger-utils';
// import { AdvancedMenuItems } from './components/advanced-menu-items';
import { LedgerDeviceItemRow } from './components/ledger-item-row';
import { SettingsMenuItem as MenuItem } from './components/settings-menu-item';

// import { MenuWrapper } from './components/settings-menu-wrapper';

export function SettingsDropdown({ triggerButton }: { triggerButton: React.ReactNode }) {
  // const ref = useRef<HTMLDivElement | null>(null);
  const hasGeneratedWallet = !!useCurrentStacksAccount();
  const { lockWallet } = useKeyActions();

  // const { isShowingSettings, setIsShowingSettings } = useDialogs();
  const currentNetworkId = useCurrentNetworkId();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { walletType } = useWalletType();
  const targetId = useLedgerDeviceTargetId();

  const location = useLocation();

  const isLedger = useHasLedgerKeys();

  // RouteUrls.Activity is nested off / so we need to use a link relative to the route
  const linkRelativeType =
    location.pathname === `${RouteUrls.Home}${RouteUrls.Activity}` ? 'route' : 'path';

  // FIXME #4370 task 1 - need to fix these button links and also lock / theme in extension mode as mentioned above
  // just open dialogs with no routes

  return (
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

            {hasGeneratedWallet && walletType === 'software' && (
              <DropdownMenu.Item>
                <MenuItem
                  data-testid={SettingsSelectors.ViewSecretKeyListItem}
                  onClick={() => navigate(RouteUrls.ViewSecretKey)}
                >
                  {/* This link isn't working */}
                  View Secret Key
                </MenuItem>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item>
              <MenuItem
                data-testid={SettingsSelectors.ToggleTheme}
                onClick={() => {
                  void analytics.track('click_change_theme_menu_item');
                  navigate(RouteUrls.ChangeTheme, {
                    relative: linkRelativeType,
                    state: { backgroundLocation: location },
                  });
                }}
              >
                Change theme
              </MenuItem>
            </DropdownMenu.Item>

            <DropdownMenu.Item>
              <MenuItem
                hideFrom="md" // FIXME - improve this to not load DropdownMenu.Item also
                data-testid={SettingsSelectors.OpenWalletInNewTab}
                onClick={() => {
                  void analytics.track('click_open_in_new_tab_menu_item');
                  openIndexPageInNewTab(location.pathname);
                }}
              >
                <HStack>
                  <Box>Open in new tab</Box>
                  <ExternalLinkIcon />
                </HStack>
              </MenuItem>
            </DropdownMenu.Item>

            <DropdownMenu.Item>
              <MenuItem
                data-testid={SettingsSelectors.GetSupportMenuItem}
                onClick={() => {
                  openInNewTab('https://leather.gitbook.io/guides/installing/contact-support');
                }}
              >
                <HStack>
                  <Box>Get support</Box>
                  <ExternalLinkIcon />
                </HStack>
              </MenuItem>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              {/* this isn't working */}
              <MenuItem
                onClick={() => {
                  openFeedbackDialog();
                }}
              >
                Give feedback
              </MenuItem>
            </DropdownMenu.Item>
            {/*  check about this divider */}
            {/* {hasGeneratedWallet ? <Divider /> : null} */}

            <DropdownMenu.Item>
              <MenuItem
                data-testid={SettingsSelectors.ChangeNetworkAction}
                onClick={() => {
                  void analytics.track('click_change_network_menu_item');
                  navigate(RouteUrls.SelectNetwork, {
                    relative: linkRelativeType,
                    state: { backgroundLocation: location },
                  });
                }}
              >
                <Flex width="100%" alignItems="center" justifyContent="space-between">
                  <Box>Change network</Box>
                  <Caption data-testid={SettingsSelectors.CurrentNetwork}>
                    {currentNetworkId}
                  </Caption>
                </Flex>
              </MenuItem>
            </DropdownMenu.Item>
            {/* TODO - check if new menu has better provider */}
            <Divider />

            {/* TODO - refactor this section */}
            {/* {showAdvancedMenuOptions && (
              <AdvancedMenuItems
                closeHandler={wrappedCloseCallback}
                settingsShown={isShowingSettings}
              />
            )} */}
            {hasGeneratedWallet && walletType === 'software' && (
              <DropdownMenu.Item>
                <MenuItem
                  onClick={() => {
                    void analytics.track('lock_session');
                    void lockWallet();
                    navigate(RouteUrls.Unlock);
                  }}
                  data-testid="settings-lock"
                >
                  Lock
                </MenuItem>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item>
              <MenuItem
                color="error.label"
                onClick={() =>
                  navigate(RouteUrls.SignOutConfirm, {
                    relative: linkRelativeType,
                    state: { backgroundLocation: location },
                  })
                }
                data-testid={SettingsSelectors.SignOutListItem}
              >
                Sign out
              </MenuItem>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  // return (
  //   <MenuWrapper isShowing={isShowingSettings} ref={ref}>
  //     {/* {isLedger && targetId && (
  //       <LedgerDeviceItemRow deviceType={extractDeviceNameFromKnownTargetIds(targetId)} />
  //     )} */}
  //     {hasGeneratedWallet && walletType === 'software' && (
  //       <>
  //         <MenuItem
  //           data-testid={SettingsSelectors.ViewSecretKeyListItem}
  //           onClick={wrappedCloseCallback(() => {
  //             navigate(RouteUrls.ViewSecretKey);
  //           })}
  //         >
  //           View Secret Key
  //         </MenuItem>
  //       </>
  //     )}
  //     <MenuItem
  //       data-testid={SettingsSelectors.ToggleTheme}
  //       onClick={wrappedCloseCallback(() => {
  //         void analytics.track('click_change_theme_menu_item');
  //         navigate(RouteUrls.ChangeTheme, {
  //           relative: linkRelativeType,
  //           state: { backgroundLocation: location },
  //         });
  //       })}
  //     >
  //       Change theme
  //     </MenuItem>
  //     {whenPageMode({
  //       full: null,
  //       popup: (
  //         <MenuItem
  //           data-testid={SettingsSelectors.OpenWalletInNewTab}
  //           onClick={() => {
  //             void analytics.track('click_open_in_new_tab_menu_item');
  //             openIndexPageInNewTab(location.pathname);
  //           }}
  //         >
  //           <HStack>
  //             <Box>Open in new tab</Box>
  //             <ExternalLinkIcon />
  //           </HStack>
  //         </MenuItem>
  //       ),
  //     })}
  //     <MenuItem
  //       data-testid={SettingsSelectors.GetSupportMenuItem}
  //       onClick={wrappedCloseCallback(() => {
  //         openInNewTab('https://leather.gitbook.io/guides/installing/contact-support');
  //       })}
  //     >
  //       <HStack>
  //         <Box>Get support</Box>
  //         <ExternalLinkIcon />
  //       </HStack>
  //     </MenuItem>
  //     <MenuItem onClick={wrappedCloseCallback(() => openFeedbackDialog())}>Give feedback</MenuItem>
  //     {hasGeneratedWallet ? <Divider /> : null}
  //     <MenuItem
  //       data-testid={SettingsSelectors.ChangeNetworkAction}
  //       onClick={wrappedCloseCallback(() => {
  //         void analytics.track('click_change_network_menu_item');
  //         navigate(RouteUrls.SelectNetwork, {
  //           relative: linkRelativeType,
  //           state: { backgroundLocation: location },
  //         });
  //       })}
  //     >
  //       <Flex width="100%" alignItems="center" justifyContent="space-between">
  //         <Box>Change network</Box>
  //         <Caption data-testid={SettingsSelectors.CurrentNetwork}>{currentNetworkId}</Caption>
  //       </Flex>
  //     </MenuItem>

  //     <Divider />

  //     {showAdvancedMenuOptions && (
  //       <AdvancedMenuItems closeHandler={wrappedCloseCallback} settingsShown={isShowingSettings} />
  //     )}
  //     {hasGeneratedWallet && walletType === 'software' && (
  //       <MenuItem
  //         onClick={wrappedCloseCallback(() => {
  //           void analytics.track('lock_session');
  //           void lockWallet();
  //           navigate(RouteUrls.Unlock);
  //         })}
  //         data-testid="settings-lock"
  //       >
  //         Lock
  //       </MenuItem>
  //     )}
  //     <MenuItem
  //       color="error.label"
  //       onClick={wrappedCloseCallback(() =>
  //         navigate(RouteUrls.SignOutConfirm, {
  //           relative: linkRelativeType,
  //           state: { backgroundLocation: location },
  //         })
  //       )}
  //       data-testid={SettingsSelectors.SignOutListItem}
  //     >
  //       Sign out
  //     </MenuItem>
  //   </MenuWrapper>
  // );
}
