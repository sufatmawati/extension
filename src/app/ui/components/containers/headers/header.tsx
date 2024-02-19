import { ReactNode } from 'react';

import { Flex, HStack, styled } from 'leather-styles/jsx';

import { isString } from '@shared/utils';

import { ArrowLeftIcon, CloseIcon } from '@app/ui/icons';

import { HeaderActionButton } from './header-action-button';

function Title({ title }: { title: string }) {
  return (
    <styled.span margin="auto" textStyle="heading.05">
      {title}
    </styled.span>
  );
}

export function BigTitle({ title }: { title: string }) {
  return (
    <styled.h1
      textStyle="heading.03"
      maxWidth="bigTitleWidth"
      height="bigTitleHeight"
      // padding applied here to avoid specific header variant
      padding="space.01"
    >
      {title}
    </styled.h1>
  );
}

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
      p="space.04"
      backgroundColor={{ base: 'accent.background-primary', sm: 'transparent' }}
    >
      <Flex
        width="100%"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        verticalAlign="middle"
        justifyContent="space-between"
        margin={{ base: 0, md: 'auto' }}
      >
        {(onGoBack || logo || account) && (
          <Flex py={{ base: 0, md: 'space.01' }} px={{ base: 0, md: 'space.02' }}>
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
        {isString(title) ? <Title title={title} /> : title}
        <HStack alignItems="center" justifyContent="flex-end">
          {networkBadge}
          {totalBalance}
          {variant !== 'onboarding' && settingsMenu}
        </HStack>
        {/*  TODO test all dialogs and if needed re-write this as a grid. Also to avoid pasing logo space*/}
        {onClose && (
          <HeaderActionButton
            icon={<CloseIcon />}
            isWaitingOnPerformedAction={isWaitingOnPerformedAction}
            onAction={onClose}
          />
        )}
      </Flex>
    </styled.header>
  );
}
