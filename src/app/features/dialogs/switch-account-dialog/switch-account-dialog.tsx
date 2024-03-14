import { memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useWalletType } from '@app/common/use-wallet-type';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { Button } from '@app/ui/components/button/button';
import { Dialog, DialogProps, getHeightOffset } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Header } from '@app/ui/components/containers/headers/header';
import { virtuosoHeight, virtuosoStyles } from '@app/ui/shared/virtuoso';

import { AccountListUnavailable } from './components/account-list-unavailable';
import { SwitchAccountListItem } from './components/switch-account-list-item';

export const SwitchAccountDialog = memo(({ isShowing, onClose }: DialogProps) => {
  const currentAccountIndex = useCurrentAccountIndex();
  const createAccount = useCreateAccount();
  const { whenWallet } = useWalletType();
  const isLedger = useHasLedgerKeys();

  const stacksAccounts = useStacksAccounts();
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  const onCreateAccount = () => {
    createAccount();
    onClose();
  };

  if (isShowing && stacksAddressesNum === 0 && btcAddressesNum === 0) {
    return <AccountListUnavailable />;
  }
  // #4370 SMELL without this early return the wallet crashes on new install with
  // : Wallet is neither of type `ledger` nor `software`
  // FIXME remove this when adding Create Account to Ledger in #2502 #4983
  if (!isShowing) return null;

  const accountNum = stacksAddressesNum || btcAddressesNum;

  return (
    <Dialog
      header={<Header variant="dialog" title="Select account" />}
      isShowing={isShowing}
      onClose={onClose}
      footer={whenWallet({
        software: (
          <Footer>
            <Button fullWidth onClick={() => onCreateAccount()}>
              Create new account
            </Button>
          </Footer>
        ),
        ledger: null,
      })}
    >
      <Virtuoso
        height={virtuosoHeight}
        style={{
          ...virtuosoStyles,
          height: `calc(${virtuosoHeight * accountNum}px + ${getHeightOffset(true, !isLedger)}px)`,
        }}
        initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
        totalCount={stacksAddressesNum || btcAddressesNum}
        itemContent={index => (
          <Box key={index} my="space.05" px="space.05">
            <SwitchAccountListItem
              handleClose={onClose}
              currentAccountIndex={currentAccountIndex}
              index={index}
            />
          </Box>
        )}
      />
    </Dialog>
  );
});
