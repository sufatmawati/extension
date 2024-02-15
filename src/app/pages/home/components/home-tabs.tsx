import { Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/ui/components/tabs/tabs';

interface HomeTabsProps {
  children: React.ReactNode;
}

export function HomeTabs({ children }: HomeTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack>
      <Tabs.Root onValueChange={slug => navigate(slug)} defaultValue={location.pathname}>
        <Tabs.List>
          <Tabs.Trigger data-testid="tab-assets" value={RouteUrls.Home}>
            Assets
          </Tabs.Trigger>
          <Tabs.Trigger data-testid="tab-activity" value={`${RouteUrls.Home}${RouteUrls.Activity}`}>
            {/* TODO - do we also want to update the route to history? */}
            History
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Suspense fallback={<LoadingSpinner pb="72px" />}>
        <Box px={{ base: 'space.04', md: 0 }} width="100%">
          {children}
        </Box>
      </Suspense>
    </Stack>
  );
}
