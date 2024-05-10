import { useMemo } from 'react';

import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';

import { convertAmountToBaseUnit } from '@app/common/money/calculate-money';
import { getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { stacksFungibleTokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { useCalculateStacksTxFees } from '@app/query/stacks/fees/fees.hooks';
import { useSip010CryptoAsset } from '@app/query/stacks/sip010/sip010-tokens.hooks';
import {
  useFtTokenTransferUnsignedTx,
  useGenerateFtTokenTransferUnsignedTx,
} from '@app/store/transactions/token-transfer.hooks';

import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
import { useStacksCommonSendForm } from '../stacks/use-stacks-common-send-form';

interface UseSip10SendFormArgs {
  contractId: string;
  symbol: string;
}
export function useSip10SendForm({ contractId, symbol }: UseSip10SendFormArgs) {
  const asset = useSip010CryptoAsset(contractId);
  const generateTx = useGenerateFtTokenTransferUnsignedTx(asset);

  const sendFormNavigate = useSendFormNavigate();

  const unsignedTx = useFtTokenTransferUnsignedTx(asset);
  const { data: stacksFtFees } = useCalculateStacksTxFees(unsignedTx);

  const availableTokenBalance = asset?.balance.availableBalance;
  const sendMaxBalance = useMemo(
    () => convertAmountToBaseUnit(availableTokenBalance),
    [availableTokenBalance]
  );

  const { initialValues, checkFormValidation, recipient, memo, nonce } = useStacksCommonSendForm({
    symbol,
    availableTokenBalance,
  });

  function createFtAvatar() {
    return {
      avatar: asset.info.contractId,
      imageCanonicalUri: getSafeImageCanonicalUri(asset.info.imageCanonicalUri, asset.info.name),
    };
  }

  return {
    availableTokenBalance,
    initialValues,
    sendMaxBalance,
    stacksFtFees,
    symbol,
    decimals: asset.info.decimals,
    marketData: asset.marketData,
    avatar: createFtAvatar(),
    validationSchema: yup.object({
      amount: stacksFungibleTokenAmountValidator(availableTokenBalance),
      recipient,
      memo,
      nonce,
    }),

    async previewTransaction(
      values: StacksSendFormValues,
      formikHelpers: FormikHelpers<StacksSendFormValues>
    ) {
      const isFormValid = await checkFormValidation(values, formikHelpers);
      if (!isFormValid) return;

      const tx = await generateTx(values);
      if (!tx) return logger.error('Attempted to generate unsigned tx, but tx is undefined');

      sendFormNavigate.toConfirmAndSignStacksSip10Transaction({
        decimals: asset.info.decimals,
        name: asset.info.name,
        tx,
      });
    },
  };
}
