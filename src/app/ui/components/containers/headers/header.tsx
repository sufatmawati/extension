import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, Grid, GridItem, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon, CloseIcon } from '@app/ui/icons';

import { BigTitleHeader } from './components/big-title-header';
import { HeaderActionButton } from './components/header-action-button';

type HeaderVariants = 'page' | 'home' | 'onboarding' | 'dialog' | 'bigTitle';

export interface HeaderProps {
  variant: HeaderVariants;
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
      p={variant === 'bigTitle' ? 'space.05' : 'space.04'}
      bg={{ base: 'ink.background-primary', sm: 'transparent' }}
    >
      <Grid
        gridTemplateColumns="1fr 4fr 1fr"
        gridAutoFlow="column"
        width="100%"
        maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
        margin={{ base: 0, md: 'auto' }}
        hideFrom={variant === 'bigTitle' ? 'md' : undefined}
      >
        <GridItem justifySelf="start">
          {logoItem && (
            <Flex py={{ base: 0, md: 'space.01' }}>
              {variant !== 'home' && onGoBack ? (
                <HeaderActionButton
                  icon={<ArrowLeftIcon />}
                  isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                  onAction={onGoBack}
                  dataTestId={SharedComponentsSelectors.HeaderBackBtn}
                />
              ) : undefined}
              {account ? account : logo}
            </Flex>
          )}
        </GridItem>
        <GridItem margin="auto" hideBelow={variant === 'bigTitle' ? 'md' : undefined}>
          {title && <styled.span textStyle="heading.05">{title}</styled.span>}
        </GridItem>
        <GridItem hideBelow={variant === 'bigTitle' ? 'md' : undefined}>
          <HStack alignItems="center" justifyContent="flex-end">
            {networkBadge}
            {totalBalance}
            {variant !== 'onboarding' && settingsMenu}
            {onClose && (
              <HeaderActionButton
                icon={<CloseIcon />}
                dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
                isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                onAction={onClose}
              />
            )}
          </HStack>
        </GridItem>
      </Grid>
      {variant === 'bigTitle' && <BigTitleHeader title={title} onClose={onClose} />}
    </styled.header>
  );
}
