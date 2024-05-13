import { useMemo } from 'react';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { STX_DECIMALS } from '@shared/constants';
import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';

import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import {
  stxAmountValidator,
  stxAvailableBalanceValidator,
} from '@app/common/validation/forms/amount-validators';
import { stxFeeValidator } from '@app/common/validation/forms/fee-validators';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useStacksValidateFeeByNonce } from '@app/query/stacks/mempool/mempool.hooks';
import {
  useGenerateStxTokenTransferUnsignedTx,
  useStxTokenTransferUnsignedTxState,
} from '@app/store/transactions/token-transfer.hooks';

import { useStacksCommonSendForm } from '../../family/stacks/use-stacks-common-send-form';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';

export function useStxSendForm() {
  const unsignedTx = useStxTokenTransferUnsignedTxState();
  const { data: stxFees } = useCalculateStacksTxFees(unsignedTx);
  const generateTx = useGenerateStxTokenTransferUnsignedTx();
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  const sendFormNavigate = useSendFormNavigate();
  const { changeFeeByNonce } = useStacksValidateFeeByNonce();

  const { availableBalance: availableStxBalance } = useStxBalance();

  const sendMaxBalance = useMemo(
    () =>
      convertAmountToBaseUnit(
        availableStxBalance.amount.minus(stxFees?.estimates[1].fee.amount || 0),
        STX_DECIMALS
      ),
    [availableStxBalance, stxFees]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol: 'STX',
    availableTokenBalance: availableStxBalance,
  });

  // FIXME - I don't this this is the fee, should be value.fee or something from the form
  const fee = stxFeeValidator(availableStxBalance);

  return {
    availableStxBalance,
    initialValues,
    onFormStateChange,
    sendMaxBalance,
    stxFees,
    fee,

    validationSchema: yup.object({
      amount: stxAmountValidator(availableStxBalance).concat(
        stxAvailableBalanceValidator(availableStxBalance)
      ),
      fee: stxFeeValidator(availableStxBalance),
      recipient,
      memo,
      nonce,
    }),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      console.log('Submitting the fomr, ', values);
      const isFormValid = await checkFormValidation(values, formikHelpers);
      console.log({ isFormValid });
      if (!isFormValid) return;
      const initialFee = values.fee;
      values.fee = changeFeeByNonce({
        nonce: Number(values.nonce),
        fee: Number(values.fee),
      });

      // if fee has changed, show info message
      const showFeeChangeWarning = initialFee !== values.fee;

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      sendFormNavigate.toConfirmAndSignStxTransaction(tx, showFeeChangeWarning);
    },
  };
}
