import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Header } from '@app/ui/components/containers/headers/header';

import { AccountListItem } from './account-list-item';

export const RecipientAccountsDialog = memo(() => {
  const stacksAccounts = useStacksAccounts();
  const navigate = useNavigate();

  const onGoBack = useCallback(() => navigate('..', { replace: true }), [navigate]);
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  if (stacksAddressesNum === 0 && btcAddressesNum === 0) return null;
  return (
    <Dialog
      header={<Header variant="dialog" title="My accounts" />}
      isShowing
      onClose={onGoBack}
      wrapChildren={false}
    >
      <Box
        height="100%"
        maxHeight={{ base: 'calc(100vh - 75px)', md: 'calc(90vh - 75px)' }}
        overflowY="auto"
      >
        <Virtuoso
          useWindowScroll
          itemContent={index => (
            <Box key={index} my="space.05" px="space.05">
              <AccountListItem
                stacksAccount={stacksAccounts[index]}
                onClose={onGoBack}
                index={index}
              />
            </Box>
          )}
          totalCount={stacksAddressesNum || btcAddressesNum}
        />
      </Box>
    </Dialog>
  );
});
