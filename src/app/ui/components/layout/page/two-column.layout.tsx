import { Flex, Stack } from 'leather-styles/jsx';

import { FULLPAGE_MAX_WIDTH } from '@shared/constants';

interface TwoColumnLayoutProps {
  leftColumn: React.JSX.Element;
  rightColumn: React.JSX.Element;
}

// FIXME 4370 task #4 - finish the TwoColumn improvements and add demo to storybook along with other pages = homepage, standard page etc.
export function TwoColumnLayout({
  leftColumn,
  rightColumn,
}: TwoColumnLayoutProps): React.JSX.Element {
  return (
    <Flex
      flexDirection={{ base: 'column', md: 'row' }}
      paddingTop="space.06"
      px={{ base: 'space.05', md: 'space.00' }}
      mx={{ base: 'auto', md: 'space.03', lg: 'space.06' }}
      gap="space.05"
      width={{ base: '100vw', md: 'unset' }}
      maxWidth={`${FULLPAGE_MAX_WIDTH}px`}
    >
      <Flex
        alignItems={['center', 'center', 'center', 'flex-start']}
        textAlign={['center', 'center', 'center', 'left']}
        flexDirection="column"
        gap="space.04"
      >
        {/* check this 250 width. Box should be 250 but allow right padding if space 
        
          Maybe need to pass in this dimenstions with leftColumn?????
        */}

        {/* <styled.div minWidth="250px" textAlign="left"> */}
        {leftColumn}
        {/* </styled.div> */}
      </Flex>

      <Flex
        gap="space.05"
        // alignItems={['center', 'center', 'center', 'flex-start']}
        alignItems={{ base: 'center', lg: 'flex-start' }}
        flexDirection="column"
        // px={['space.00', 'space.10', 'space.10', 'space.02']}
        // PETE - view secret key etc. has a width of 600px so could break that restricting it here
        px={{ base: 'space.00', md: 'space.10', lg: 'space.02' }}
        width={{ base: '100%', md: '600px' }} // this 600 should be 500px for password screen but consistent is better?
        // maxWidth={POPUP_WIDTH}
      >
        <Stack
          px={['space.00', 'space.05']}
          pt={['space.02', 'space.05']}
          pb={['space.02', 'space.05']}
          gap="space.04"
          backgroundColor="accent.background-primary"
          borderRadius="xs"
          width="100%"
          minWidth="600px" // for setPassword need to get this right
          flex="1"
        >
          {rightColumn}
        </Stack>
      </Flex>
    </Flex>
  );
}
