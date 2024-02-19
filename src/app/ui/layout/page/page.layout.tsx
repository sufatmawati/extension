import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

interface PageProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function Page({ children }: PageProps) {
  return (
    <Box
      backgroundColor="accent.background-primary"
      borderRadius="xs"
      width="pageWidth"
      height={{ base: '100vh', md: 'auto' }}
      minHeight="435px"
    >
      {children}
    </Box>
  );
}
