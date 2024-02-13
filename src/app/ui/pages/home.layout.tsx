import type { ReactNode } from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AccountCard } from '@app/ui/components/account/account.card';

interface HomeLayoutProps {
  name: string;
  balance: string;
  children: ReactNode;
  accountActions: ReactNode;
}

export function HomeLayout({ name, balance, children, accountActions }: HomeLayoutProps) {
  //  TODO refactor this to share with two-col layout
  return (
    <Stack alignItems="center" width="100%" mx={['', 'space.04']}>
      <Stack
        data-testid={HomePageSelectors.HomePageContainer}
        maxWidth={['unset', 'unset', 'fullPageMaxWidth']}
        px={['space.04', 'space.04', 'space.08']}
        width="100%"
        backgroundColor="ink.1"
        borderRadius="lg"
      >
        <AccountCard name={name} balance={balance}>
          {accountActions}
        </AccountCard>
        {children}
      </Stack>
    </Stack>
  );
}
