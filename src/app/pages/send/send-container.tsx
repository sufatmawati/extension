import { Outlet } from 'react-router-dom';

import { Flex } from 'leather-styles/jsx';

import { whenPageMode } from '@app/common/utils';

export function SendContainer() {
  // FIXME - 4370 implement this as per new design as it looks weird and we don't want whenPageMode anymore - its in a dialog now

  return whenPageMode({
    full: (
      <Flex
        borderRadius={['unset', '16px']}
        height="fit-content"
        maxWidth={['100%', 'pageWidth']}
        minWidth={['100%', 'pageWidth']}
        background="ink.background-primary"
      >
        <Outlet />
      </Flex>
    ),
    popup: (
      <Flex background="ink.background-primary" width="100%">
        <Outlet />
      </Flex>
    ),
  });
}
