import { ReactNode } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { AccountNameLayout } from '@app/components/account/account-name';
import { Link } from '@app/ui/components/link/link';
import { SkeletonLoader } from '@app/ui/components/skeleton-loader/skeleton-loader';
import { ChevronDownIcon } from '@app/ui/icons';

interface AccountCardProps {
  name: string;
  balance: string;
  children: ReactNode;
  // switchAccount: ReactNode;
  toggleSwitchAccount(): void;
  isLoadingBnsName: boolean;
  isLoadingBalance: boolean;
}

export function AccountCard({
  name,
  balance,
  // switchAccount,
  toggleSwitchAccount,
  children,
  isLoadingBnsName,
  isLoadingBalance,
}: AccountCardProps) {
  return (
    <Flex
      direction="column"
      border={{ base: 'active', sm: 'unset' }}
      rounded="md"
      px={{ base: 'space.05', sm: '0' }}
      pt={{ base: 'space.05', md: '0' }}
    >
      <Link
        _before={{ bg: 'transparent' }}
        _hover={{ color: 'ink.action-primary-hover' }}
        data-testid={SettingsSelectors.SwitchAccountTrigger}
        onClick={toggleSwitchAccount}
        variant="text"
      >
        <Flex>
          <AccountNameLayout
            isLoading={isLoadingBnsName}
            data-testid={SettingsSelectors.CurrentAccountDisplayName}
            textStyle="label.01"
          >
            {name}
          </AccountNameLayout>

          <Box mt="space.01" ml="space.02">
            <ChevronDownIcon variant="small" />
          </Box>
        </Flex>
      </Link>
      <Flex flexDir={{ base: 'column', md: 'row' }} justify="space-between">
        <Box mb="space.05" mt="space.04">
          <SkeletonLoader width="200px" height="38px" isLoading={isLoadingBalance}>
            <styled.h1 textStyle="heading.02">{balance}</styled.h1>
          </SkeletonLoader>
        </Box>
        {/* {switchAccount} */}
        {children}
      </Flex>
    </Flex>
  );
}
