import type { CryptoAssetBalances } from '@leather-wallet/models';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';

export function parseCryptoAssetBalance(balance: CryptoAssetBalances) {
  const { availableBalance } = balance;

  const amount = ftDecimals(availableBalance.amount, availableBalance.decimals);
  const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
    '{symbol}',
    availableBalance.symbol.toLowerCase()
  );
  const formattedBalance = formatBalance(amount);

  return {
    dataTestId,
    formattedBalance,
  };
}
