import { FormikHelpers } from 'formik';

import { FormErrorMessages } from '@shared/error-messages';
import { FeeTypes } from '@shared/models/fees/fees.model';
import { StacksSendFormValues } from '@shared/models/form.model';
import { Money } from '@shared/models/money.model';

import { stxMemoValidator } from '@app/common/validation/forms/memo-validators';
import { stxRecipientValidator } from '@app/common/validation/forms/recipient-validators';
import { nonceValidator } from '@app/common/validation/nonce-validators';
import { useNextNonce } from '@app/query/stacks/nonce/account-nonces.hooks';
import { useCurrentAccountStxAddressState } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { useStacksHighFeeWarningContext } from '../../../../../features/stacks-high-fee-warning/stacks-high-fee-warning-container';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues } from '../../send-form.utils';

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
  const highFeeWarningContext = useStacksHighFeeWarningContext();

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

    if (highFeeWarningContext.isHighFeeWithNoFormErrors(formErrors, values.fee)) {
      highFeeWarningContext.setShowHighFeeWarningDialog(true);
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
