import { logger } from '@shared/logger';
import { createMoney } from '@shared/models/money.model';

import { btcToSat } from '@app/common/money/unit-conversion';
import { formFeeRowValue } from '@app/common/send/utils';
import { useGenerateUnsignedNativeSegwitSingleRecipientTx } from '@app/common/transactions/bitcoin/use-generate-bitcoin-tx';
import { OnChooseFeeArgs } from '@app/components/bitcoin-fees-list/bitcoin-fees-list';
import { useSignBitcoinTx } from '@app/store/accounts/blockchain/bitcoin/bitcoin.hooks';

import { useCalculateMaxBitcoinSpend } from '../../family/bitcoin/hooks/use-calculate-max-spend';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useBtcChooseFeeState } from './btc-choose-fee';

export function useBtcChooseFee() {
  const { isSendingMax, txValues, utxos } = useBtcChooseFeeState();
  const sendFormNavigate = useSendFormNavigate();
  const generateTx = useGenerateUnsignedNativeSegwitSingleRecipientTx();
  const calcMaxSpend = useCalculateMaxBitcoinSpend();
  const signTx = useSignBitcoinTx();
  const amountAsMoney = createMoney(btcToSat(txValues.amount).toNumber(), 'BTC');

  return {
    amountAsMoney,

    async previewTransaction({ feeRate, feeValue, time, isCustomFee }: OnChooseFeeArgs) {
      const resp = await generateTx(
        {
          amount: isSendingMax
            ? calcMaxSpend(txValues.recipient, utxos, feeRate).amount
            : amountAsMoney,
          recipient: txValues.recipient,
        },
        feeRate,
        utxos,
        isSendingMax
      );
      const feeRowValue = formFeeRowValue(feeRate, isCustomFee);
      if (!resp) return logger.error('Attempted to generate raw tx, but no tx exists');

      const signedTx = await signTx(resp.psbt);

      if (!signedTx) return logger.error('Attempted to sign tx, but no tx exists');

      signedTx.finalize();

      sendFormNavigate.toConfirmAndSignBtcTransaction({
        tx: signedTx.hex,
        recipient: txValues.recipient,
        fee: feeValue,
        feeRowValue,
        time,
      });
    },
  };
}
