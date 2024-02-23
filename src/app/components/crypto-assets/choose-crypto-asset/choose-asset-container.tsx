import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { whenPageMode } from '@app/common/utils';

export function ChooseAssetContainer({ children }: HasChildren) {
  return whenPageMode({
    full: (
      <Flex
        borderRadius={['unset', 'lg']}
        height="fit-content"
        maxWidth={['100%', 'pageWidth']}
        minWidth={['100%', 'pageWidth']}
        background="ink.background-primary"
      >
        {children}
      </Flex>
    ),
    popup: (
      <Flex background="ink.background-primary" width="100%">
        {children}
      </Flex>
    ),
  });
}
