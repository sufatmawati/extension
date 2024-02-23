import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

import { Header } from '@app/ui/components/containers/headers/header';
import { Logo } from '@app/ui/components/logo';

interface PageProps {
  children: ReactNode;
  showLogo?: boolean;
}

export function Page({ children, showLogo = false }: PageProps) {
  return (
    <Box
      bg="ink.background-primary"
      borderRadius="xs"
      width="pageWidth"
      height={{ base: '100vh', md: 'auto' }}
      minHeight="435px"
    >
      {showLogo && <Header logo={<Logo />} variant="card" />}
      {children}
    </Box>
  );
}
