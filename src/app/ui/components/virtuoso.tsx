import type React from 'react';

import { Box } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';

interface VirtuosoWrapper {
  children: React.ReactNode;
  hasFooter?: boolean;
}

function vhToPixels(vh: string) {
  const numericHeight = +vh.replace('vh', '');
  return (numericHeight * window.innerHeight) / 100;
}

export function VirtuosoWrapper({ children, hasFooter }: VirtuosoWrapper) {
  const isAtLeastMd = useViewportMinWidth('md');
  const virtualHeight = isAtLeastMd ? '70vh' : '100vh';
  const headerHeight = 75;
  const footerHeight = hasFooter ? 125 : 0;
  const heightOffset = headerHeight + footerHeight;
  const height = vhToPixels(virtualHeight) - heightOffset;

  return (
    <Box
      style={{
        height: height,
        overflow: 'hidden',
        marginBottom: hasFooter ? '100px' : '10px',
      }}
    >
      {children}
    </Box>
  );
}
