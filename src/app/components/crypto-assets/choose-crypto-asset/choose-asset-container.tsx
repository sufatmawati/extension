import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function ChooseAssetContainer({ children }: HasChildren) {
  return (
    <Flex
      borderRadius={{ base: 'unset', md: 'lg' }}
      height="fit-content"
      maxWidth={{ base: '100%', md: 'pageWidth' }}
      minWidth={{ base: '100%', md: 'pageWidth' }}
      background="ink.background-primary"
    >
      {children}
    </Flex>
  );
}
