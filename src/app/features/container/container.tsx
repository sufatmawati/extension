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
import { ContainerLayout } from '@app/ui/components/containers/container.layout';
import { NetworkModeBadge } from '@app/ui/components/containers/headers/components/network-mode-badge';
import { Header } from '@app/ui/components/containers/headers/header';
import { Flag } from '@app/ui/components/flag/flag';
import { HamburgerIcon } from '@app/ui/components/icons/hamburger-icon';
import { Logo } from '@app/ui/components/logo';

import { SwitchAccountDialog } from '../dialogs/switch-account-dialog/switch-account-dialog';
import { useRestoreFormState } from '../popup-send-form-restoration/use-restore-form-state';
import { Settings } from '../settings/settings';
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
      pathname === RouteUrls.SignIn ||
      pathname === RouteUrls.ViewSecretKey
    );
  };

  // > lint errors
  // > update PR description
  // > onClose removal
  // > scroll behaviour
  // > settings
  // > storybook

  // const isPasswordPage = () => {
  //   return pathname === RouteUrls.Unlock || pathname === RouteUrls.ViewSecretKey;
  //   // maybe add a <Header /> inside the two column routes?
  //   // thats messeir. headers should be here
  //   //ViewSecretKey is wrong but needs to be on another request password page
  //   // view-secret-key page only shows header logo IF show password true, uses the same route :D
  // };

  // TODO 4370 test RouteUrls.Unlock as not sure what header there, page I guess
  // PETe - need to show Settings menu on unlock screen
  const getVariant = () => {
    if (isHomePage()) return 'home';
    if (isOnboardingPage()) return 'onboarding';
    return 'page';
  };

  const variant = getVariant();
  // console.log('variant', variant);
  // ? messing with headers for 2 columns. just sort the ui , headers later
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
  // Settings menu needs to show here if session locked
  // just show the F-ing header here to keep it simple
  //  && !isPasswordPage(); // && !isSessionLocked;

  // FIXME - this isn't working, only showing BACK!
  // > onClose is now depreacted so get rid of this code
  // > fix hacky code around showing logo or not - get rid of placeholder etc
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
              // on /fund/:currency goBack doesn't make sense as it re-opens popup.
              // Need to test everywhere and add custom logic
              onGoBack={
                isSessionLocked || pageOnClose || isKnownPopup(pathname as RouteUrls)
                  ? undefined
                  : () => navigate(-1)
              }
              onClose={
                pageOnClose
                  ? () => navigate(RouteUrls.Fund ? RouteUrls.FundChooseCurrency : RouteUrls.Home)
                  : undefined
              }
              settingsMenu={
                // disabling settings for all popups for now pending clarification
                // variant !== 'popup' && <Settings triggerButton={<HamburgerIcon />} />
                // this logic was not working
                isKnownPopup(pathname as RouteUrls) ? null : (
                  <Settings triggerButton={<HamburgerIcon />} />
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
                  <Logo
                    data-testid={OnboardingSelectors.LogoRouteToHome}
                    onClick={variant !== 'home' ? () => navigate(RouteUrls.Home) : undefined}
                  />
                ) : (
                  // <>Pete this hides the logo but moves the menu to the left! </>
                  // fix this hack
                  <div width="102px" height="32px"></div>
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
