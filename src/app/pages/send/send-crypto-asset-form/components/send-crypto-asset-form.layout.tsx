import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Flex } from 'leather-styles/jsx';

interface SendCryptoAssetFormLayoutProps {
  children: React.ReactNode;
}
export function SendCryptoAssetFormLayout({ children }: SendCryptoAssetFormLayoutProps) {
  return (
    <Flex
      alignItems="center"
      data-testid={SendCryptoAssetSelectors.SendForm}
      flexDirection="column"
      maxHeight={['calc(100vh - 116px)', 'calc(85vh - 116px)']}
      height={['calc(100vh - 116px)', 'calc(85vh - 116px)']}
      //TODO 4370 task #1
      // need to fix this for STX send and ideally in Page and remove this component
      // minHeight={{ base: '100vh', md: 'dialogHeight' }}
      // height="100vh"
      p={{ base: 'space.04', md: 'space.08' }}
      overflowY="auto"
    >
      {children}
    </Flex>
  );
}
