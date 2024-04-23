import { useEffect, useState } from 'react';

import { Box } from 'leather-styles/jsx';

import { useViewportMinWidth } from '@app/common/hooks/use-media-query';
import { useOnResizeListener } from '@app/common/hooks/use-on-resize-listener';

interface VirtuosoWrapper {
  children: React.ReactNode;
  hasFooter?: boolean;
}

function vhToPixels(vh: string) {
  const numericHeight = +vh.replace('vh', '');
  return (numericHeight * window.innerHeight) / 100;
}

export function VirtuosoWrapper({ children, hasFooter }: VirtuosoWrapper) {
  const isAtLeastSm = useViewportMinWidth('sm');
  //   const virtualHeight = isAtLeastSm ? '70vh' : '100vh';
  // 400 should be passed in from above and 'dialog' id not used here
  //   const [dynamicHeight, setDynamicHeight] = useState(vhToPixels(virtualHeight));
  const [dynamicHeight, setDynamicHeight] = useState(0);
  useEffect(() => {
    const virtualHeight = isAtLeastSm ? '70vh' : '100vh';
    setDynamicHeight(vhToPixels(virtualHeight));
  }, [isAtLeastSm]);

  const headerHeight = 75;
  // on sm footer is 100
  const footerHeight = hasFooter ? 100 : 0;
  const heightOffset = headerHeight + footerHeight;
  //   const height = vhToPixels(virtualHeight) - heightOffset;
  console.log('dynamicHeight:', dynamicHeight);
  //   const dialogHeight = document?.getElementById('dialog')?.clientHeight;
  //   const dynamicHeight = dialogHeight ? dialogHeight - heightOffset : 100;
  //   console.log(dialogHeight);
  const onResize = () => {
    const dialogHeight = document?.getElementById('dialog')?.clientHeight;
    // debugger;
    // console.log(
    //   'dialogHeight: ',
    //   dialogHeight,
    //   'heightOffset: ',
    //   heightOffset,
    //   'dynamicHeight:',
    //   dynamicHeight
    // );
    if (!dialogHeight) return;
    if (dialogHeight < 400) {
      //   setDynamicHeight(400);
      return;
    } else {
      const height = dialogHeight - heightOffset > 400 ? 400 : dialogHeight - heightOffset;
      setDynamicHeight(height);
    }
  };

  useOnResizeListener(onResize);
  if (dynamicHeight === 0) return null;

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

// WIP improved but still not great as when creating new account  height not set properly
