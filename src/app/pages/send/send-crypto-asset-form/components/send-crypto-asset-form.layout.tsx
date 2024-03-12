import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { HasChildren } from '@app/common/has-children';

export function SendCryptoAssetFormLayout({ children }: HasChildren) {
  return (
    <Flex
      alignItems="center"
      data-testid={SendCryptoAssetSelectors.SendForm}
      flexDirection="column"
      p="space.05"
      pt="space.06"
      width="100%"
      overflowY="auto"
      style={{ marginBottom: token('sizes.footerHeight') }}
      maxHeight={{ base: '70vh', md: '80vh' }}
    >
      {children}
    </Flex>
  );
}
