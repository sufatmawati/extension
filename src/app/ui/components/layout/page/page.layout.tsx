import { type ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

import { Header } from '@app/ui/components/containers/headers/header';
import { Logo } from '@app/ui/components/logo';

// import { PAGE_WIDTH } from '@app/ui/constants';

// > read this - https://storybook.js.org/docs/writing-stories/build-pages-with-storybook

// >finish 2 col layout fast
// > fix settings menu bugs
// > clean PR and test
/* 
    This layout to replace two-column layout + add new single page layour for set-password
    Make a new sotrybook sorty - page that accepts variant of 2 column / ` column and also possibly the welcome layout
     - then can add visual regression fot that
*/

interface PageProps {
  children: ReactNode;
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
      <Header logo={<Logo />} variant="card" />
      {children}
    </Box>
  );
}
