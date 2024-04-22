import { useState } from 'react';

import { Box } from 'leather-styles/jsx';

import { useOnResizeListener } from '@app/common/hooks/use-on-resize-listener';

// import { useViewportMinWidth } from '@app/common/hooks/use-media-query';

interface VirtuosoWrapper {
  children: React.ReactNode;
  hasFooter?: boolean;
  parentHeight?: number;
}

// function vhToPixels(vh: string) {
//   const numericHeight = +vh.replace('vh', '');
//   return (numericHeight * window.innerHeight) / 100;
// }

export function VirtuosoWrapper({ children, hasFooter, parentHeight }: VirtuosoWrapper) {
  //   const isAtLeastMd = useViewportMinWidth('md');
  //   const virtualHeight = isAtLeastMd ? '70vh' : '100vh';
  // 400 should be passed in from above and 'dialog' id not used here
  const [dynamicHeight, setDynamicHeight] = useState(parentHeight);
  const headerHeight = 75;
  // on sm footer is 100
  const footerHeight = hasFooter ? 100 : 0;
  const heightOffset = headerHeight + footerHeight;
  //   const height = vhToPixels(virtualHeight) - heightOffset;

  //   const dialogHeight = document?.getElementById('dialog')?.clientHeight;
  //   const dynamicHeight = dialogHeight ? dialogHeight - heightOffset : 100;
  //   console.log(dialogHeight);
  const onResize = () => {
    // const dialogHeight = document?.getElementById('dialog')?.clientHeight;
    // debugger;
    console.log(
      'parentHeight: ',
      parentHeight,
      'heightOffset: ',
      heightOffset,
      'dynamicHeight:',
      dynamicHeight
    );
    if (!parentHeight) return;
    if (parentHeight < 400) {
      setDynamicHeight(parentHeight);
    } else {
      //   const height = dialogHeight - heightOffset > 400 ? 400 : dialogHeight - heightOffset;
      setDynamicHeight(parentHeight - heightOffset);
    }
  };

  useOnResizeListener(onResize);

  // seems to work really well until you make window really small in height then big again
  // it just keeps making it smaller then???

  return (
    <Box
      style={{
        height: dynamicHeight,
        overflow: 'hidden',
        marginBottom: hasFooter ? '100px' : '10px',
      }}
    >
      {children}
    </Box>
  );
}
