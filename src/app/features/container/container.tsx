import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { useAnalytics, useInitalizeAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { AppVersion } from '@app/components/app-version';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { useOnSignOut } from '@app/routes/hooks/use-on-sign-out';
import { useOnWalletLock } from '@app/routes/hooks/use-on-wallet-lock';
import { useHasStateRehydrated } from '@app/store';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { ContainerLayout } from '@app/ui/components/containers/container.layout';
import { NetworkModeBadge } from '@app/ui/components/containers/headers/components/network-mode-badge';
import { Header } from '@app/ui/components/containers/headers/header';
import { Flag } from '@app/ui/components/flag/flag';
import { HamburgerIcon } from '@app/ui/components/icons/hamburger-icon';
import { Logo } from '@app/ui/components/logo';

import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { Settings } from '../settings/settings';
import { getDisplayAddresssBalanceOf, isKnownPopup, showAccountInfo } from './get-popup-header';
import { getTitleFromUrl } from './get-title-from-url';
import { TotalBalance } from './total-balance';

export function Container() {
  // setIsShowingSwitchAccount is repeated so could be improved but at least jotai isShowingSwitchAccountsState is gone
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const analytics = useAnalytics();
  const hasStateRehydrated = useHasStateRehydrated();

  const { chain, name: chainName } = useCurrentNetworkState();

  useOnWalletLock(() => closeWindow());
  useOnSignOut(() => closeWindow());
  useRestoreFormState();
  useInitalizeAnalytics();

  useEffect(() => void analytics.page('view', `${pathname}`), [analytics, pathname]);

  const isHomePage = () => {
    // match for '/activity' could be better to use === `/${activity}`
    return pathname === RouteUrls.Home || pathname.match(RouteUrls.Activity);
  };

  const isLandingPage = () => {
    return pathname === RouteUrls.RequestDiagnostics || pathname.match(RouteUrls.Onboarding); // need to match get-started/ledger
  };
  const isOnboardingPage = () => {
    return (
      pathname === RouteUrls.BackUpSecretKey ||
      pathname === RouteUrls.SetPassword ||
      pathname === RouteUrls.SignIn ||
      pathname === RouteUrls.ViewSecretKey
    );
  };

  //  > scroll behaviour - test more
  //  - remove global styles and test virtuoso and popup mode

  // > settings fix menu - dialogs
  // - need to show Settings menu on unlock screen
  // > fix hacky code around showing logo or not - get rid of placeholder etc
  // => add storybook pages

  // BUG - when create account in Extension mode it doesn't show up there but does in full screen
  // BUG - in extension mode popout when account locked can scroll and header beige?
  // BUG - receive modal copy address not working (since pre-tabs)
  // BUG - send BTC / STX footer looks weird, fixed to bottom
  // BUG - send BTC/ STX select account not showing anything in modal - recipient-accounts
  const getVariant = () => {
    if (isHomePage()) return 'home';
    if (isOnboardingPage()) return 'onboarding';
    return 'page';
  };

  const variant = getVariant();
  useEffect(() => {
    // set the whole body colour based on page variant so it can update dynamically
    if (variant === 'home') {
      document.body.style.backgroundColor = token('colors.accent.background-primary');
    }
    if (variant === 'page' || variant === 'onboarding') {
      document.body.style.backgroundColor = token('colors.accent.background-secondary');
    }
  }, [variant]);

  const isGetAddressesPopup = pathname === RouteUrls.RpcGetAddresses;
  const isSessionLocked = pathname === RouteUrls.Unlock;

  const hideLogo = () => {
    return pathname === RouteUrls.RpcGetAddresses || pathname === RouteUrls.Unlock;
  };

  const displayHeader = !isLandingPage() && !isGetAddressesPopup;
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  if (!hasStateRehydrated) return <LoadingSpinner />;

  return (
    <>
      <SwitchAccountDialog
        isShowing={isShowingSwitchAccount}
        onClose={() => setIsShowingSwitchAccount(false)}
      />
      {/* TODO #4310 Toast */}
      <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <ContainerLayout
        header={
          displayHeader ? (
            <Header
              variant={variant}
              // on /fund/:currency goBack doesn't make sense as it re-opens popup.
              // Need to test everywhere and add custom logic
              onGoBack={
                isSessionLocked || isKnownPopup(pathname as RouteUrls)
                  ? undefined
                  : () => navigate(-1)
              }
              settingsMenu={
                // disabling settings for all popups for now pending clarification
                isKnownPopup(pathname as RouteUrls) ? null : (
                  <Settings
                    triggerButton={<HamburgerIcon />}
                    toggleSwitchAccount={() => setIsShowingSwitchAccount(!!isShowingSwitchAccount)}
                  />
                )
              }
              networkBadge={
                <NetworkModeBadge
                  isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                  name={chainName}
                />
              }
              title={getTitleFromUrl(pathname as RouteUrls)}
              logo={
                !hideLogo() ? (
                  <>
                    <Logo
                      data-testid={OnboardingSelectors.LogoRouteToHome}
                      onClick={variant !== 'home' ? () => navigate(RouteUrls.Home) : undefined}
                    />
                    <AppVersion />
                  </>
                ) : (
                  // FIXME get rid of this Box used to position when no logo
                  <Box width="102px" height="32px" />
                )
              }
              account={
                showAccountInfo(pathname as RouteUrls) && (
                  <Flag
                    align="middle"
                    img={
                      <CurrentAccountAvatar
                        color={token('colors.white')}
                        fontSize="16px"
                        fontWeight={500}
                        size="32px"
                        toggleSwitchAccount={() => setShowSwitchAccount(!showSwitchAccount)}
                      />
                    }
                  >
                    <CurrentAccountName />
                  </Flag>
                )
              }
              totalBalance={
                showAccountInfo(pathname as RouteUrls) && (
                  <TotalBalance
                    displayAddresssBalanceOf={getDisplayAddresssBalanceOf(pathname as RouteUrls)}
                  />
                )
              }
            />
          ) : null
        }
        variant={variant}
      >
        <Outlet />
      </ContainerLayout>
    </>
  );
}
