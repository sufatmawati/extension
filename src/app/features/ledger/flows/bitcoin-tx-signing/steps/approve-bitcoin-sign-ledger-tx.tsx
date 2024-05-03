import * as btc from '@scure/btc-signer';

import { getPsbtTxInputs, getPsbtTxOutputs } from '@shared/crypto/bitcoin/bitcoin.utils';
import { getBitcoinInputValue } from '@shared/crypto/bitcoin/bitcoin.utils';
import { isDefined } from '@shared/utils';

import { useLedgerTxSigningContext } from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import { ApproveLedgerOperationLayout } from '@app/features/ledger/generic-steps/approve-ledger-operation/approve-ledger-operation.layout';
import { useHasApprovedOperation } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { useUpdateLedgerSpecificNativeSegwitUtxoHexForAdddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

async function DoTheHustle(psbt, nativeSegwitInputsToSign) {
  const addNativeSegwitUtxoHexLedgerProps =
    useUpdateLedgerSpecificNativeSegwitUtxoHexForAdddressIndexZero();
  try {
    await addNativeSegwitUtxoHexLedgerProps(psbt, nativeSegwitInputsToSign);
  } catch (e) {}
}

export function ApproveSignLedgerBitcoinTx() {
  const hasApprovedOperation = useHasApprovedOperation();

  const context = useLedgerTxSigningContext();

  console.log(
    'context.transaction',
    context
    // 'addNativeSegwitUtxoHexLedgerProps'
    // addNativeSegwitUtxoHexLedgerProps
  );

  //   > Pete come on !

  //   you can do this

  //   - - try create a Psbt here
  // - do what Dani said to learn this

  /// danis hex has a `nonWitnessUtxo` here

  function transactionContainsNonWitness(transaction: any) {
    return transaction.inputs.map((input: any) => 'nonWitnessUtxo' in input);
  }

  // function getInputAmount(index: number, input: any) {
  //   debugger;
  //   input.witnessUtxo ? input.witnessUtxo?.amount?.toString() : getBitcoinInputValue(index, input);
  // }
  console.log(
    'getPsbtTxInputs',
    getPsbtTxInputs(context.transaction as unknown as btc.Transaction).map((input, i) =>
      // `Input ${i + 1}`,
      // input.witnessUtxo?.amount?.toString() + ' sats', // here dani is getting undefined 'sats'
      getBitcoinInputValue(isDefined(input.index) ? input.index : 0, input)
    ),
    'transactionContainsNonWitness',
    transactionContainsNonWitness(context.transaction)
  );

  // Kyran nonWitness should work. Better solution is to lookup the amount using the API

  // nonWitnessUtxo doesn't have an amount

  // Maybe even have a different component here for nonWitnessUtxo?

  // does nonWitness even work?? https://github.com/bitcoinjs/bitcoinjs-lib/issues/1894
  return (
    <ApproveLedgerOperationLayout
      description="Verify the transaction details on your Ledger"
      details={
        [
          ...getPsbtTxInputs(context.transaction as unknown as btc.Transaction).map((input, i) => {
            console.log('input', input);
            return [
              `Input ${i + 1}`,
              // input.witnessUtxo?.amount?.toString() + ' sats', // here dani is getting undefined 'sats'
              // this seems  to fix the display issue but not sure if the amount is correct
              getBitcoinInputValue(isDefined(input.index) ? input.index : 0, input) + ' sats',
            ];
          }),
          ...getPsbtTxOutputs(context.transaction as unknown as btc.Transaction).map(
            (output, i) => [`Output ${i + 1}`, output.amount?.toString() + ' sats']
          ),
        ] as [string, string][]
      }
      status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
    />
  );
}
//  getBitcoinInputValue(i needs to be input index of previous transaction
// input - tx_id + output index spending
