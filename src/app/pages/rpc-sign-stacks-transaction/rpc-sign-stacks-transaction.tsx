import { StacksTransactionSigner } from '@app/features/stacks-transaction-request/stacks-transaction-signer';
import { useRpcSignStacksTransaction } from '@app/pages/rpc-sign-stacks-transaction/use-rpc-sign-stacks-transaction';
import { useBreakOnNonCompliantEntity } from '@app/query/common/compliance-checker/compliance-checker.query';

export function RpcSignStacksTransaction() {
  const {
    onSignStacksTransaction,
    onCancel,
    disableFeeSelection,
    stacksTransaction,
    disableNonceSelection,
    isMultisig,
    txSender,
  } = useRpcSignStacksTransaction();

  useBreakOnNonCompliantEntity(txSender);

  return (
    <StacksTransactionSigner
      onSignStacksTransaction={onSignStacksTransaction}
      onCancel={onCancel}
      isMultisig={isMultisig}
      stacksTransaction={stacksTransaction}
      disableFeeSelection={disableFeeSelection}
      disableNonceSelection={disableNonceSelection}
    />
  );
}
