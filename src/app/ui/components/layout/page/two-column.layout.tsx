import { Flex, Stack } from 'leather-styles/jsx';

import { FULLPAGE_MAX_WIDTH } from '@app/ui/constants';

interface TwoColumnLayoutProps {
  left: React.JSX.Element;
  right: React.JSX.Element;
}

// FIXME 4370 task #4 - finish the TwoColumn improvements and add demo to storybook along with other pages = homepage, standard page etc.
export function TwoColumnLayout({ left, right }: TwoColumnLayoutProps): React.JSX.Element {
  return (
    <Flex
      flexDirection={{ base: 'column', md: 'row' }}
      paddingTop="space.06"
      px={{ base: 'space.05', md: 'space.00' }}
      mx={{ base: 'auto', md: 'space.03', lg: 'space.06' }}
      gap="space.05"
      width={{ base: '100vw', md: 'unset' }}
      maxWidth={`${FULLPAGE_MAX_WIDTH}px`}
      // maxWidth='882px'
    >
      <Flex
        // alignItems={['center', 'center', 'center', 'flex-start']}
        // textAlign={['center', 'center', 'center', 'left']}
        flexDirection="column"
        gap="space.04"
      >
        {left}
      </Flex>

      <Flex
        gap="space.05"
        flexDirection="column"
        // PETE - view secret key etc. has a width of 600px so could break that restricting it here
        px={{ base: 'space.00', md: 'space.10', lg: 'space.02' }}
        width={{ base: '100%', md: '600px' }} // this 600 should be 500px for password screen but consistent is better?
      >
        <Stack
          px={{ base: 'space.00', md: 'space.05' }}
          pt={{ base: 'space.02', md: 'space.05' }}
          pb={{ base: 'space.02', md: 'space.05' }}
          gap="space.04"
          backgroundColor="accent.background-primary"
          borderRadius="xs"
          width="100%"
          minWidth="600px" // for setPassword need to get this right
          flex="1"
        >
          {right}
        </Stack>
      </Flex>
    </Flex>
  );
}
