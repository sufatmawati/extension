import { useCallback } from 'react';

import { useHasCurrentBitcoinAccount } from './bitcoin/bitcoin.hooks';
import { useHasStacksLedgerKeychain } from './stacks/stacks.hooks';

// TODO: Asset refactor: remove if determined unnecessary
// ts-unused-exports:disable-next-line
export function useCheckLedgerBlockchainAvailable() {
  const hasBitcoinLedgerKeys = useHasCurrentBitcoinAccount();
  const hasStacksLedgerKeys = useHasStacksLedgerKeychain();

  return useCallback(
    (symbol: string) => {
      if (symbol === 'bitcoin') {
        return hasBitcoinLedgerKeys;
      }
      if (symbol === 'stacks') {
        return hasStacksLedgerKeys;
      }
      return false;
    },
    [hasBitcoinLedgerKeys, hasStacksLedgerKeys]
  );
}
