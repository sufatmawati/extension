import BigNumber from 'bignumber.js';
import { type FormikErrors, FormikHelpers } from 'formik';

import { HIGH_FEE_AMOUNT_STX } from '@shared/constants';
import { FormErrorMessages } from '@shared/error-messages';
import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { Money } from '@shared/models/money.model';
import { isEmpty } from '@shared/utils';

import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues } from '../../send-form.utils';
import { useStacksCommonSendFormContext } from './stacks-common-send-form-container';

function hasHighTxFeeAndNoOtherFormErrors(errors: FormikErrors<unknown>, fee: number | string) {
  return isEmpty(errors) && new BigNumber(fee).isGreaterThan(HIGH_FEE_AMOUNT_STX);
}

interface UseStacksCommonSendFormArgs {
  symbol: string;
  availableTokenBalance: Money;
}
export function useStacksCommonSendForm({
  symbol,
  availableTokenBalance,
}: UseStacksCommonSendFormArgs) {
  const routeState = useSendFormRouteState();
  const { data: nextNonce } = useNextNonce();
  const currentAccountStxAddress = useCurrentAccountStxAddressState();
  const currentNetwork = useCurrentNetworkState();
  const context = useStacksCommonSendFormContext();

  const initialValues: StacksSendFormValues = createDefaultInitialFormValues({
    hasDismissedHighFeeWarning: false,
    isShowingHighFeeDiaglog: false,
    fee: '',
    feeCurrency: 'STX',
    feeType: FeeTypes[FeeTypes.Unknown],
    memo: '',
    nonce: nextNonce?.nonce,
    recipientBnsName: '',
    symbol,
    ...routeState,
  });

  async function checkFormValidation(
    values: StacksSendFormValues,
    formikHelpers: FormikHelpers<StacksSendFormValues>
  ) {
    const formErrors = await formikHelpers.validateForm();

    if (
      hasHighTxFeeAndNoOtherFormErrors(formErrors, values.fee) &&
      !context.hasBypassedFeeWarning
    ) {
      context.setShowHighFeeWarningDialog(true);
      return false;
    }
    return true;
  }

  return {
    initialValues,
    availableTokenBalance,
    checkFormValidation,
    recipient: stxRecipientValidator(currentAccountStxAddress, currentNetwork),
    memo: stxMemoValidator(FormErrorMessages.MemoExceedsLimit),
    nonce: nonceValidator,
  };
}
