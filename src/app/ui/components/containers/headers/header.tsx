import { ReactNode } from 'react';

import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

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
  isWaitingOnPerformedAction?: boolean;
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
  const logoItem = onGoBack || logo || account;
  return (
    <styled.header
      p="space.04"
      backgroundColor={{ base: 'accent.background-primary', sm: 'transparent' }}
    >
      <Grid
        gridTemplateColumns="1fr 4fr 1fr"
        width="100%"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        margin={{ base: 0, md: 'auto' }}
      >
        <GridItem>
          {logoItem && (
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
        </GridItem>
        <GridItem margin="auto">{isString(title) ? <Title title={title} /> : title}</GridItem>
        <GridItem>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {totalBalance}
            {variant !== 'onboarding' && settingsMenu}
          </HStack>

          {onClose && (
            <HeaderActionButton
              icon={<CloseIcon />}
              isWaitingOnPerformedAction={isWaitingOnPerformedAction}
              onAction={onClose}
            />
          )}
        </GridItem>
      </Grid>
    </styled.header>
  );
}
