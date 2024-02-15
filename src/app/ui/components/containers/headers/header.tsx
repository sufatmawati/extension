import { ReactNode } from 'react';

import { Flex, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon } from '@app/ui/components/icons/arrow-left-icon';
import { CloseIcon } from '@app/ui/components/icons/close-icon';

import { HeaderActionButton } from './header-action-button';

// TODO 4370 task #4 TEST:
// - Ledger:seems to be the only thing using enableGoBack, isWaitingOnPerformedAction
// - Send summary screens as onClose is now deprecated - action button needs to go Home
export interface HeaderProps {
  variant: 'page' | 'home' | 'onboarding' | 'card'; //TODO add shared types
  // got rid of enableGoBack as in ledger allowUserToGoBack is used to pass undefined /onGoBack to header
  // enableGoBack?: boolean; // seems this is needed in ledger and sendInscription. Would be good to merge it and onGoBack
  isWaitingOnPerformedAction?: boolean; // seems this is needed for ledger - change it to ledgerAction?
  onClose?(): void;
  onGoBack?(): void;
  title?: ReactNode;
  account?: ReactNode;
  totalBalance?: ReactNode;
  settingsMenu?: ReactNode;
  networkBadge?: ReactNode;
  logo?: ReactNode;
}

export function Header({
  variant,
  // enableGoBack,
  isWaitingOnPerformedAction,
  onClose,
  onGoBack,
  account,
  totalBalance,
  settingsMenu,
  networkBadge,
  title,
  logo,
}: HeaderProps) {
  return (
    <styled.header
      px={variant === 'card' ? 'space.04' : { base: 'space.04', md: 'space.07' }}
      py={variant === 'card' ? 'space.04' : { base: 'space.04', md: 'space.05' }}
    >
      <Flex
        width="100%"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        verticalAlign="middle"
        justifyContent="space-between"
        margin={{ base: 0, md: 'auto' }}
      >
        {(onGoBack || logo || account) && (
          <Flex>
            {variant !== 'home' && onGoBack ? (
              <HeaderActionButton
                icon={<ArrowLeftIcon />}
                isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                onAction={onGoBack}
              />
            ) : undefined}
            {account ? account : logo}
          </Flex>
        )}
        {title}
        <HStack alignItems="center" justifyContent="flex-end">
          {networkBadge}
          {totalBalance}
          {variant !== 'onboarding' && settingsMenu}

          {onClose && (
            <HeaderActionButton
              icon={<CloseIcon />}
              isWaitingOnPerformedAction={isWaitingOnPerformedAction}
              onAction={onClose}
            />
          )}
        </HStack>
      </Flex>
    </styled.header>
  );
}
