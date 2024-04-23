import { Profiler, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Box } from 'leather-styles/jsx';

import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useWalletType } from '@app/common/use-wallet-type';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useFilteredBitcoinAccounts } from '@app/store/accounts/blockchain/bitcoin/bitcoin.ledger';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { Button } from '@app/ui/components/button/button';
import { Dialog, DialogProps } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Header } from '@app/ui/components/containers/headers/header';
import { VirtuosoWrapper } from '@app/ui/components/virtuoso';

import { AccountListUnavailable } from './components/account-list-unavailable';
import { SwitchAccountListItem } from './components/switch-account-list-item';

export function SwitchAccountDialog({ isShowing, onClose }: DialogProps) {
  const currentAccountIndex = useCurrentAccountIndex();
  const createAccount = useCreateAccount();
  const { whenWallet } = useWalletType();
  // const isLedger = useHasLedgerKeys();
  const stacksAccounts = useStacksAccounts();
  const bitcoinAccounts = useFilteredBitcoinAccounts();
  const btcAddressesNum = bitcoinAccounts.length / 2;
  const stacksAddressesNum = stacksAccounts.length;

  const onCreateAccount = useCallback(() => {
    createAccount();
    onClose();
  }, [createAccount, onClose]);

  // PETE - key underlying issue is why this re-renders so many times
  // try and fix that so it doesn't render so much and that we set the height only when it has finished
  // then it won't be so jumpy

  // Probably worth opening my other PR for review in the meantime so that can get released

  // if (isShowing && stacksAddressesNum === 0 && btcAddressesNum === 0) {
  //   return <AccountListUnavailable />;
  // }
  const accountNum = stacksAddressesNum || btcAddressesNum;
  // #4370 SMELL without this early return the wallet crashes on new install with
  // : Wallet is neither of type `ledger` nor `software`
  // FIXME remove this when adding Create Account to Ledger in #2502 #4983
  if (!isShowing) {
    console.log('dynamic render switch not showing', accountNum);
    return null;
  }
  // debugger;
  console.log('dynamic render switch account', accountNum);

  const logTimes = (id, phase, actualTime, baseTime, startTime, commitTime) => {
    console.log(`${id}'s ${phase} phase:`);
    console.log(`Actual time: ${actualTime}`);
    console.log(`Base time: ${baseTime}`);
    console.log(`Start time: ${startTime}`);
    console.log(`Commit time: ${commitTime}`);
  };
  return (
    <Profiler id="StockChart" onRender={logTimes}>
      <Dialog
        header={<Header variant="dialog" title="Select account" />}
        isShowing={isShowing}
        onClose={onClose}
        wrapChildren={false}
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
        // footer={
        //   isLedger ? null : (
        //     <Footer>
        //       <Button fullWidth onClick={() => onCreateAccount()}>
        //         Create new account
        //       </Button>
        //     </Footer>
        //   )
        // }
      >
        <VirtuosoWrapper hasFooter={whenWallet({ ledger: false, software: true })}>
          {/* <VirtuosoWrapper hasFooter={isLedger ? false : true}> */}
          <Virtuoso
            style={{
              height: '100%',
            }}
            // initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
            // initialTopMostItemIndex={isLedger ? 0 : currentAccountIndex}
            totalCount={accountNum}
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
        </VirtuosoWrapper>
      </Dialog>
    </Profiler>
  );
}
