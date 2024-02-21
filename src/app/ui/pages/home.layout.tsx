import type { ReactNode } from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Box, Stack } from 'leather-styles/jsx';

import { AccountCard } from '@app/ui/components/account/account.card';

interface HomeLayoutProps {
  name: string;
  balance: string;
  children: ReactNode;
  accountActions: ReactNode;
}

export function HomeLayout({ name, balance, children, accountActions }: HomeLayoutProps) {
  return (
    <Stack
      data-testid={HomePageSelectors.HomePageContainer}
      maxWidth={{ base: 'unset', md: 'fullPageMaxWidth' }}
      px={{ base: 0, md: 'space.04' }}
      py={{ base: 0, md: 'space.07' }}
      gap={{ base: 0, md: 'space.06' }}
      width="100%"
      backgroundColor="ink.1"
      borderRadius="lg"
      animation="fadein"
      animationDuration="500ms"
    >
      <Box px={{ base: 'space.05', md: 0 }} paddingBottom={{ base: 'space.05', md: 0 }}>
        <AccountCard name={name} balance={balance}>
          {accountActions}
        </AccountCard>
      </Box>
      {children}
    </Stack>
  );
}
