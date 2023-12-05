import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { Button } from '@app/ui/components/button/button';
import { LeatherIcon } from '@app/ui/components/icons/leather-icon';
import { LeatherLettermarkIcon } from '@app/ui/components/icons/leather-lettermark-icon';
import { Link } from '@app/ui/components/link/link';

interface WelcomeLayoutProps {
  isGeneratingWallet: boolean;
  onSelectConnectLedger(): void;
  onStartOnboarding(): void;
  onRestoreWallet(): void;
}
export function WelcomeLayout({
  isGeneratingWallet,
  onStartOnboarding,
  onSelectConnectLedger,
  onRestoreWallet,
}: WelcomeLayoutProps): React.JSX.Element {
  // On this page 'theme' is used to set specific colours and bypass automatic theming
  const { theme } = useThemeSwitcher();

  const actionLinkColour = theme === 'light' ? 'darkModeInk.12' : 'lightModeInk.12';

  const primaryActionButton = {
    bg: {
      base: theme === 'light' ? 'darkModeInk.12' : 'lightModeInk.1',
      md: theme === 'light' ? 'lightModeInk.1' : 'lightModeInk.12',
    },
    color: {
      base: theme === 'light' ? 'lightModeInk.12' : 'darkModeInk.1',
      md: theme === 'light' ? 'darkModeInk.1' : 'lightModeInk.1',
    },

    _hover: {
      /* TODO 4370 - design check hover + text color on md */
      bg: 'accent.action-primary-hover',
      color: theme === 'light' ? 'lightModeInk.1' : 'darkModeInk.1',
    },
  };
  const secondaryActionButton = {
    color: 'darkModeInk.12',
    borderColor: 'darkModeInk.12',
    _hover: {
      /* TODO 4370 - design check hover + text color on sm */
      bg: 'accent.action-primary-hover',
      color: theme === 'light' ? 'darkModeInk.12' : 'lightModeInk.12',
    },
  };

  const tagline = 'Bitcoin for the rest of us';
  const taglineExtended = 'The bitcoin wallet for the rest of us';
  const subheader =
    'Leather is the only Bitcoin wallet you need to tap into the emerging Bitcoin economy';

  return (
    <Flex flexDir={{ base: 'column-reverse', md: 'row' }} minW="100vw" minH="100vh">
      <Flex
        flexDir="column"
        bg={{ base: 'darkModeInk.1', md: 'ink.12' }}
        color={{ base: 'lightModeInk.1', md: 'ink.12' }}
        flex={{ base: 1, md: 2 }}
        p="space.05"
      >
        <Flex
          flexDir="column"
          flex={{ base: 1, md: 0 }}
          justifyContent={{ base: 'end', md: 'flex-start' }}
          color={{ base: 'lightModeInk.1', md: 'ink.2' }}
        >
          <styled.h1 hideBelow="md" textStyle="display.01" maxWidth="880px">
            {tagline}
          </styled.h1>
          <styled.h1 hideFrom="md" textStyle="heading.03" maxWidth="880px">
            {taglineExtended}
          </styled.h1>

          <styled.h2
            textStyle={{ base: 'label.01', md: 'heading.04' }}
            mt={{ base: 'space.02', md: 'space.07' }}
            maxW="556px"
          >
            {subheader}
          </styled.h2>
        </Flex>
        <Flex flexDir={{ base: 'column', md: 'row' }} gap="space.05" mt="space.07">
          <Button
            onClick={onStartOnboarding}
            data-testid={OnboardingSelectors.SignUpBtn}
            aria-busy={isGeneratingWallet}
            css={primaryActionButton}
          >
            Create new wallet
          </Button>

          <Flex gap="space.05" alignItems="flex-start">
            {/* Links for size 'md' and up */}
            <Link
              paddingTop="space.02"
              hideBelow="md"
              color={actionLinkColour}
              data-testid={OnboardingSelectors.SignInLink}
              onClick={onRestoreWallet}
              size="lg"
            >
              Use existing key
            </Link>
            <Link
              paddingTop="space.02"
              hideBelow="md"
              color={actionLinkColour}
              onClick={onSelectConnectLedger}
              size="lg"
            >
              Use Ledger
            </Link>
            {/* Buttons for size 'sm' and up */}
            <Button
              hideFrom="md"
              variant="outline"
              flex={1}
              data-testid={OnboardingSelectors.SignInLink}
              onClick={onRestoreWallet}
              css={secondaryActionButton}
            >
              Use existing key
            </Button>
            <Button
              hideFrom="md"
              variant="outline"
              flex={1}
              onClick={onSelectConnectLedger}
              css={secondaryActionButton}
            >
              Use Ledger
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        p="space.05"
        bg={{ base: 'darkModeInk.1', md: 'accent.background-primary' }}
        color={{ base: 'lightModeInk.1', md: 'ink.12' }}
        flexDir="column"
        justifyContent="space-between"
        flex={{ base: 0, md: 1 }}
      >
        <Flex justifyContent="space-between">
          <LeatherIcon width="150px" height="34px" />
          <Link href="https://leather.io/" hideBelow="md">
            leather.io
          </Link>
        </Flex>
        <LeatherLettermarkIcon hideBelow="md" width="100%" />
      </Flex>
    </Flex>
  );
}
