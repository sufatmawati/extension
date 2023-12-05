import { ReactNode, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { css } from 'leather-styles/css';
import { Box } from 'leather-styles/jsx';

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

    {
      /* // TODO check Kyrans margin needed */
    }
    return (
      <Virtuoso
        className={css({
          marginX: 'space.05',
        })}
        useWindowScroll
        initialTopMostItemIndex={whenWallet({ ledger: 0, software: currentAccountIndex })}
        totalCount={addressesNum}
        itemContent={index => (
          <Box key={index} my="space.05" px="space.05">
            <SwitchAccountListItem
              handleClose={handleClose}
              currentAccountIndex={currentAccountIndex}
              index={index}
            />
          </Box>
        )}
      />
    );
  }
);
