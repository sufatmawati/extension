import { ReactNode, useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Divider, Flex, styled } from 'leather-styles/jsx';

import { SwitchAccountDialog } from '@app/features/dialogs/switch-account-dialog/switch-account-dialog';
import { ChevronDownIcon } from '@app/ui/components/icons/chevron-down-icon';
import { Link } from '@app/ui/components/link/link';

interface AccountCardProps {
  name: string;
  balance: string;
  children: ReactNode;
}

export function AccountCard({ name, balance, children }: AccountCardProps) {
  const [isShowingSwitchAccount, setIsShowingSwitchAccount] = useState(false);
  return (
    <>
      <SwitchAccountDialog
        isShowing={isShowingSwitchAccount}
        onClose={() => setIsShowingSwitchAccount(false)}
      />
      <Flex
        direction="column"
        bgColor={{ base: 'accent.background-secondary', sm: 'unset' }}
        rounded="sm"
        px={{ base: 'space.05', sm: '0' }}
        pt={{ base: 'space.05', md: '0' }}
        pb={{ base: 'space.02', md: '0' }}
      >
        <Link
          _before={{ bg: 'transparent' }}
          _hover={{ color: 'accent.action-primary-hover' }}
          data-testid={SettingsSelectors.SwitchAccountTrigger}
          onClick={() => setIsShowingSwitchAccount(!isShowingSwitchAccount)}
        >
          <Flex>
            <styled.p
              data-testid={SettingsSelectors.CurrentAccountDisplayName}
              textStyle="label.01"
            >
              {name}
            </styled.p>
            <Box mt="space.01" ml="space.02">
              <ChevronDownIcon />
            </Box>
          </Flex>
        </Link>
        <Flex flexDir={{ base: 'column', md: 'row' }} justify="space-between">
          <styled.h1 textStyle="heading.02" mb="space.05" mt="space.04">
            {balance}
          </styled.h1>
          <Divider
            position="relative"
            color="accent.border-default"
            right="space.05"
            width="calc(100% + 48px)"
            mb="space.02"
            hideFrom="sm"
          />

          {children}
        </Flex>
      </Flex>
    </>
  );
}
