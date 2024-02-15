import { ReactNode, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { css } from 'leather-styles/css';

import { useWalletType } from '@app/common/use-wallet-type';

import { SwitchAccountListItem } from './switch-account-list-item';

interface SwitchAccountListProps {
  handleClose(): void;
  currentAccountIndex: number;
  addressesNum: number;
  footer?: ReactNode;
}
export const SwitchAccountList = memo(
  ({ currentAccountIndex, handleClose, addressesNum }: SwitchAccountListProps) => {
    const { whenWallet } = useWalletType();

    //  TODO 4370 task #1 - test  LEDGER DIALOGS
    return (
      // <Box
      //   css={{
      //     // PETE try this just being 'auto' to fix windows problems also
      //     // only allow scroll if more than 6 accounts
      //     overflowY: addressesNum > 6 ? 'scroll' : 'hidden',
      //     // PETE check this with new structure on Ledger
      //     // fill space on ledger as no create account button
      //     maxHeight: whenWallet({ ledger: '100vh', software: '' }),
      //   }}
      // >
      <Virtuoso
        className={css({
          marginX: 'space.05',
        })}
        useWindowScroll
        initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
        totalCount={addressesNum}
        itemContent={index => (
          <SwitchAccountListItem
            key={index}
            handleClose={handleClose}
            currentAccountIndex={currentAccountIndex}
            index={index}
          />
        )}
      />
      // </Box>
    );
  }
);
