import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

interface PageProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function Page({ children }: PageProps) {
  return (
    <Box
      bg="ink.background-primary"
      borderRadius={{ base: 'unset', md: 'lg' }}
      width="pageWidth"
      height={{ base: '100%', md: 'fit-content' }}
      // minHeight="435px" PETE check this on Send flow - make sure it doesn't break everything else

      // Make the send flow bhave the same as FUND!
    >
      {children}
    </Box>
  );
}
