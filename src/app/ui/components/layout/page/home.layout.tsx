import type { ReactNode } from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AccountCard } from '@app/ui/components/layout/card/account/account.card';
import { FULLPAGE_MAX_WIDTH } from '@app/ui/constants';

interface HomeLayoutProps {
  name: string;
  balance: string;
  children: ReactNode;
  onClickTrigger(): void;
  accountActions: ReactNode;
}

export function HomeLayout({
  name,
  balance,
  children,
  onClickTrigger,
  accountActions,
}: HomeLayoutProps) {
  return (
    <Stack alignItems="center" width="100%" mx={['', 'space.04']}>
      <Stack
        data-testid={HomePageSelectors.HomePageContainer}
        maxWidth={['unset', 'unset', `${FULLPAGE_MAX_WIDTH}px`]}
        px={['space.04', 'space.04', 'space.08']}
        width="100%"
        backgroundColor="ink.1"
        borderRadius="lg"
      >
        <AccountCard name={name} balance={balance} onClickTrigger={onClickTrigger}>
          {accountActions}
        </AccountCard>
        {children}
      </Stack>
    </Stack>
  );
}
