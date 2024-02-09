import type { ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';
import { FOOTER_HEIGHT, PAGE_WIDTH } from '@app/ui/constants';

interface FooterProps {
  children: ReactNode;
  variant?: 'page' | 'card';
  flexDirection?: 'column' | 'row';
}

export function Footer({ children, variant = 'page', flexDirection = 'column' }: FooterProps) {
  return (
    <styled.footer
      gap="space.05"
      p="space.05"
      bottom={0}
      width="100vw"
      maxWidth={variant === 'card' ? `${PAGE_WIDTH}px` : undefined}
      zIndex={1}
      minHeight={`${FOOTER_HEIGHT}px`}
      // footer is always white
      backgroundColor="accent.background-primary"
      borderTop={variant === 'page' ? ' default' : undefined}
      position={{ base: 'fixed', md: variant === 'card' ? ' absolute' : 'fixed' }}
    >
      <Flex flexDirection={flexDirection} width="100%" gap="space.04">
        {children}
      </Flex>
    </styled.footer>
  );
}
