import { ReactNode } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Flex, HStack, styled } from 'leather-styles/jsx';

import { ArrowLeftIcon } from '@app/ui/components/icons/arrow-left-icon';
import { CloseIcon } from '@app/ui/components/icons/close-icon';
import { LeatherLogo } from '@app/ui/components/leather-logo';

import { HeaderActionButton } from './header-action-button';

// Ledger:
// seems to be the only thing using enableGoBack, isWaitingOnPerformedAction

export interface HeaderProps {
  variant: 'home' | 'page' | 'onboarding';
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
  showLogo?: boolean;
}

export function Header({
  variant = 'page',
  // enableGoBack,
  isWaitingOnPerformedAction,
  onClose,
  onGoBack,
  account,
  totalBalance,
  settingsMenu,
  networkBadge,
  title, // should make this a consistent string and also have an option for bigTitle? a different variant perhaps?
  showLogo = true,
}: HeaderProps) {
  return (
    <styled.header
      px={{ base: 'space.04', md: 'space.07' }}
      py={{ base: 'space.04', md: 'space.05' }}
    >
      <Flex
        width="100%"
        maxWidth={{ base: '392px', md: '882px' }}
        verticalAlign="middle"
        justifyContent="space-between"
        margin={{ base: 0, md: 'auto' }}
      >
        {(onGoBack || showLogo || account) && (
          <Flex>
            {(variant === 'onboarding' || variant === 'page') && onGoBack ? (
              <HeaderActionButton
                icon={<ArrowLeftIcon />}
                isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                onAction={onGoBack}
              />
            ) : undefined}
            {showLogo && !account && (
              <LeatherLogo
                data-testid={OnboardingSelectors.LeatherLogoRouteToHome}
                // 4370 TODO - asess if we need these other props
                // width="72px"
                // verticalAlign="middle"
                // onClick={variant !== 'home' ? () => navigate(RouteUrls.Home) : undefined}
              />
            )}
            {account}
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
