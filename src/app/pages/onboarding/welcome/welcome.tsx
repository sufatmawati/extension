import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { doesBrowserSupportWebUsbApi, isPopupMode, whenPageMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { useHasUserRespondedToAnalyticsConsent } from '@app/store/settings/settings.selectors';
import { WelcomeLayout } from '@app/ui/pages/welcome.layout';

export function WelcomePage() {
  const hasResponded = useHasUserRespondedToAnalyticsConsent();
  const navigate = useNavigate();
  const { decodedAuthRequest } = useOnboardingState();
  const analytics = useAnalytics();
  const keyActions = useKeyActions();

  const [isGeneratingWallet, setIsGeneratingWallet] = useState(false);

  const startOnboarding = useCallback(async () => {
    if (isPopupMode()) {
      openIndexPageInNewTab(RouteUrls.Onboarding);
      closeWindow();
      return;
    }
    setIsGeneratingWallet(true);
    // #4517 signout other tabs on wallet create
    await keyActions.signOut();
    keyActions.generateWalletKey();
    void analytics.track('generate_new_secret_key');
    if (decodedAuthRequest) {
      navigate(RouteUrls.SetPassword);
    }
    navigate(RouteUrls.BackUpSecretKey);
  }, [keyActions, analytics, decodedAuthRequest, navigate]);

  useEffect(() => {
    if (!hasResponded) navigate(RouteUrls.RequestDiagnostics);
    return () => setIsGeneratingWallet(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageModeRoutingAction = (url: string) =>
    whenPageMode({
      full() {
        navigate(url);
      },
      popup() {
        void openIndexPageInNewTab(url);
        closeWindow();
      },
    });

  const supportsWebUsbAction = pageModeRoutingAction(
    RouteUrls.Onboarding + '/' + RouteUrls.ConnectLedgerStart
  );
  const doesNotSupportWebUsbAction = pageModeRoutingAction(
    RouteUrls.Onboarding + '/' + RouteUrls.LedgerUnsupportedBrowser
  );

  const restoreWallet = pageModeRoutingAction(RouteUrls.SignIn);

  const onSelectConnectLedger = useCallback(async () => {
    await keyActions.signOut();
    if (doesBrowserSupportWebUsbApi()) {
      supportsWebUsbAction();
    } else {
      doesNotSupportWebUsbAction();
    }
  }, [doesNotSupportWebUsbAction, keyActions, supportsWebUsbAction]);

  return (
    <>
      <WelcomeLayout
        isGeneratingWallet={isGeneratingWallet}
        onSelectConnectLedger={onSelectConnectLedger}
        onStartOnboarding={() => startOnboarding()}
        onRestoreWallet={() => restoreWallet()}
      />
      <Outlet />
    </>
  );
}
