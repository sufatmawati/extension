import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';

import { StacksBalanceListItemLayout } from './stacks-balance-list-item.layout';

interface StacksBalanceListItemProps {
  address: string;
}
export function StacksBalanceListItem({ address }: StacksBalanceListItemProps) {
  const balanceDetails = useStxBalance();
  return (
    <StacksBalanceListItemLayout
      address={address}
      isInitialLoading={balanceDetails.stxBalanceQuery.isInitialLoading}
      {...balanceDetails}
    />
  );
}
