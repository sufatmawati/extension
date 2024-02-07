import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { token } from 'leather-styles/tokens';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { useAnalytics, useInitalizeAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { CurrentAccountAvatar } from '@app/features/current-account/current-account-avatar';
import { CurrentAccountName } from '@app/features/current-account/current-account-name';
import { useOnSignOut } from '@app/routes/hooks/use-on-sign-out';
import { useOnWalletLock } from '@app/routes/hooks/use-on-wallet-lock';
import { useHasStateRehydrated } from '@app/store';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { NetworkModeBadge } from '@app/ui/components/containers/headers/components/network-mode-badge';
import { Header } from '@app/ui/components/containers/headers/header';
import { Flag } from '@app/ui/components/flag/flag';
import { HamburgerIcon } from '@app/ui/components/icons/hamburger-icon';
import { Logo } from '@app/ui/components/logo';

import { ContainerLayout } from '../../ui/components/containers/container.layout';
import { SwitchAccountDialog } from '../dialogs/switch-account-dialog/switch-account-dialog';
import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { SettingsDropdown } from '../settings-dropdown/settings-dropdown';
import { getOnClose } from './get-on-close';
import { getDisplayAddresssBalanceOf, isKnownPopup, showAccountInfo } from './get-popup-header';
import { getTitleFromUrl } from './get-title-from-url';
import { TotalBalance } from './total-balance';

export function Container() {
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
      pathname === RouteUrls.SignIn
    );
  };

  const isPasswordPage = () => {
    return pathname === RouteUrls.Unlock || pathname === RouteUrls.ViewSecretKey;
  };

  // TODO 4370 test RouteUrls.Unlock as not sure what header there, page I guess
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

  const displayHeader = !isLandingPage() && !isGetAddressesPopup && !isPasswordPage();

  // FIXME - this isn't working, only showing BACK!
  const pageOnClose = getOnClose(pathname as RouteUrls);
  // console.log('getOnClose', pageOnClose);

  if (!hasStateRehydrated) return <LoadingSpinner />;

  return (
    <>
      <SwitchAccountDialog />
      <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <ContainerLayout
        header={
          displayHeader ? (
            <Header
              variant={variant}
              onGoBack={
                pageOnClose || isKnownPopup(pathname as RouteUrls) ? undefined : () => navigate(-1)
              }
              onClose={
                pageOnClose
                  ? () => navigate(RouteUrls.Fund ? RouteUrls.FundChooseCurrency : RouteUrls.Home)
                  : undefined
              }
              // PETE could this instead be a slot accepting menu or total balance?
              // sue that to hide menu for some popups
              settingsMenu={
                // disabling settings for all popups for now pending clarification
                // variant !== 'popup' && <SettingsDropdown triggerButton={<HamburgerIcon />} />
                // this logic was not working
                isKnownPopup(pathname as RouteUrls) ? null : (
                  <SettingsDropdown triggerButton={<HamburgerIcon />} />
                )
              }
              networkBadge={
                <NetworkModeBadge
                  isTestnetChain={chain.stacks.chainId === ChainID.Testnet}
                  name={chainName}
                />
              }
              title={getTitleFromUrl(pathname as RouteUrls)}
              // PETE - maybe pass logo here, or account or undefined?
              logo={
                pathname !== RouteUrls.RpcGetAddresses ? (
                  <Logo
                    data-testid={OnboardingSelectors.LogoRouteToHome}
                    onClick={variant !== 'home' ? () => navigate(RouteUrls.Home) : undefined}
                  />
                ) : undefined
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
