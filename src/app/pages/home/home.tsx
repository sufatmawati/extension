import { Route, useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { ActivityList } from '@app/features/activity-list/activity-list';
import { AssetsList } from '@app/features/asset-list/asset-list';
import { FeedbackButton } from '@app/features/feedback-button/feedback-button';
import { InAppMessages } from '@app/features/hiro-messages/in-app-messages';
import { homePageModalRoutes } from '@app/routes/app-routes';
import { ModalBackgroundWrapper } from '@app/routes/components/modal-background-wrapper';

import { HomeLayout } from '../../ui/components/containers/home.layout';
import { CurrentAccount } from './components/account-area';
import { HomeTabs } from './components/home-tabs';

export function Home() {
  const { decodedAuthRequest } = useOnboardingState();

  const navigate = useNavigate();

  useOnMount(() => {
    if (decodedAuthRequest) navigate(RouteUrls.ChooseAccount);
  });

  return (
    <HomeLayout currentAccount={<CurrentAccount />}>
      {/* TODO 4370 InAppMessages remove if un-necessary */}
      <InAppMessages />
      <FeedbackButton />
      <HomeTabs>
        <ModalBackgroundWrapper>
          <Route index element={<AssetsList />} />
          <Route path={RouteUrls.Activity} element={<ActivityList />}>
            {homePageModalRoutes}
          </Route>
          {homePageModalRoutes}
        </ModalBackgroundWrapper>
      </HomeTabs>
    </HomeLayout>
  );
}
