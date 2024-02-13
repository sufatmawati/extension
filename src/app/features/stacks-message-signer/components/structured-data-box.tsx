import { useEffect, useState } from 'react';

import { ClarityValue } from '@stacks/transactions';
import { Box, Divider, HStack, Stack, styled } from 'leather-styles/jsx';

import { StructuredMessageDataDomain } from '@shared/signature/signature-types';

import {
  chainIdToDisplay,
  cvToDisplay,
  deriveStructuredMessageHash,
} from '@app/features/ledger/flows/stacks-message-signing/message-signing.utils';
import { HashDialog } from '@app/features/message-signer/hash-dialog';

import { ClarityValueListDisplayer } from './clarity-value-list';

export function StructuredDataBox(props: {
  message: ClarityValue;
  domain: StructuredMessageDataDomain;
}) {
  const { message, domain } = props;

  const [hash, setHash] = useState<string | undefined>();
  const [domainName, setDomainName] = useState<string | undefined>();
  const [domainVersion, setDomainVersion] = useState<string | undefined>();
  const [domainChainName, setDomainChainName] = useState<string | undefined>();

  useEffect(() => {
    setHash(deriveStructuredMessageHash({ message, domain }));
  }, [message, domain]);

  useEffect(() => {
    setDomainName(cvToDisplay(domain.data.name));
    setDomainVersion(cvToDisplay(domain.data.version));
    setDomainChainName(chainIdToDisplay(domain.data['chain-id']));
  }, [domain]);

  if (!message) return null;

  return (
    <Box minHeight="260px">
      <Stack
        border="active"
        paddingBottom="space.02"
        borderColor="accent.border-default"
        borderRadius="sm"
      >
        <Box background="white" borderRadius="lg" overflowX="scroll" py="space.05">
          <Box fontSize="14px" lineHeight="1.7" px="space.05">
            <HStack alignItems="center" justifyContent="space-between">
              <styled.h2 textStyle="label.01">{domainName}</styled.h2>
              <styled.span lineHeight="1.5" textStyle="caption.02">
                {domainVersion} {domainChainName}
              </styled.span>
            </HStack>
            <Divider py="space.01" />
            <Box>
              <ClarityValueListDisplayer val={message} encoding={'tryAscii'} />
            </Box>
          </Box>
        </Box>
        {hash ? <HashDialog hash={hash} /> : null}
      </Stack>
    </Box>
  );
}
