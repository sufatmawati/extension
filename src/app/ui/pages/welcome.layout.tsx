import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { useThemeSwitcher } from '@app/common/theme-provider';
import { Button } from '@app/ui/components/button/button';
import { Link } from '@app/ui/components/link/link';
import { LettermarkIcon } from '@app/ui/icons/lettermark-icon';
import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

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

  const oldColours = {
    'lightModeInk.1': '#FFFFFF',
    'lightModeInk.12': '#12100F',
    'darkModeInk.12': '#F5F1ED',
  };

  const actionLinkColour = 'ink.background-secondary';
  // theme === 'light' ? oldColours['darkModeInk.12'] : oldColours['lightModeInk.12'];

  const primaryActionButton = {
    bg: {
      base: theme === 'light' ? oldColours['darkModeInk.12'] : oldColours['lightModeInk.1'],
      md: theme === 'light' ? oldColours['lightModeInk.1'] : oldColours['lightModeInk.12'],
    },
    color: {
      base: oldColours['lightModeInk.12'],
      md: theme === 'light' ? oldColours['lightModeInk.12'] : oldColours['lightModeInk.1'],
    },

    _hover: {
      bg: 'ink.action-primary-hover',
      color: theme === 'light' ? oldColours['lightModeInk.1'] : oldColours['lightModeInk.12'],
    },
  };
  const secondaryActionButton = {
    color: oldColours['darkModeInk.12'],
    borderColor: oldColours['darkModeInk.12'],
    _hover: {
      /* TODO 4370 - design check hover + text color on sm */
      bg: 'ink.action-primary-hover',
      color: 'ink.background-secondary',
      //theme === 'light' ? oldColours['darkModeInk.12'] : oldColours['lightModeInk.12'],
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
        bg={{ base: oldColours['lightModeInk.12'], md: 'ink.text-primary' }}
        color={{ base: oldColours['lightModeInk.1'], md: 'ink.text-primary' }}
        flex={{ base: 1, md: 2 }}
        p="space.05"
      >
        <Flex
          flexDir="column"
          flex={{ base: 1, md: 0 }}
          justifyContent={{ base: 'end', md: 'flex-start' }}
          color="ink.background-primary"
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
              pt="space.02"
              hideBelow="md"
              color={actionLinkColour}
              data-testid={OnboardingSelectors.SignInLink}
              onClick={onRestoreWallet}
              size="lg"
            >
              Use existing key
            </Link>
            <Link
              pt="space.02"
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
        bg={{ base: oldColours['lightModeInk.12'], md: 'ink.background-primary' }}
        color={{ base: oldColours['lightModeInk.1'], md: 'ink.text-primary' }}
        flexDir="column"
        justifyContent="space-between"
        flex={{ base: 0, md: 1 }}
      >
        <Flex justifyContent="space-between">
          <LogomarkIcon width="150px" height="34px" />
          <Link href="https://leather.io/" hideBelow="md" variant="text">
            leather.io
          </Link>
        </Flex>

        <LettermarkIcon hideBelow="md" height="auto" width="100%" />
      </Flex>
    </Flex>
  );
}
