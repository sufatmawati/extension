import type { ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

interface FooterProps {
  children: ReactNode;
  variant?: 'page' | 'card';
}
export function Footer({ children, variant = 'page' }: FooterProps) {
  return (
    <styled.footer
      gap="space.05"
      p="space.05"
      bottom={0}
      width="100%"
      maxWidth={variant === 'card' ? '500px' : undefined} // test this then make a card width const
      zIndex={1}
      minHeight="95px" // test this then make a footer height const
      // footer is always white
      backgroundColor="accent.background-primary"
      borderTop={variant === 'page' ? ' default' : undefined}
      position={variant === 'page' ? ' fixed' : 'absolute'}
    >
      {/* seem to need this always apart from password/ ReceiveTokensFooter / signout - probably good to always have it */}
      <Flex flexDirection="column" width="100%" gap="space.04">
        {children}
      </Flex>
    </styled.footer>
  );
}
