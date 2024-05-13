import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';

import { logger } from '@shared/logger';
import { type Money } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';
import { noop } from '@shared/utils';

import { useOnMount } from '@app/common/hooks/use-on-mount';
import { useWalletType } from '@app/common/use-wallet-type';
import {
  btcAddressNetworkValidator,
  btcAddressValidator,
} from '@app/common/validation/forms/address-validators';
import { tokenAmountValidator } from '@app/common/validation/forms/amount-validators';
import { currencyAmountValidator } from '@app/common/validation/forms/currency-validators';
import { useUpdatePersistedSendFormValues } from '@app/features/popup-send-form-restoration/use-update-persisted-send-form-values';
import { useCurrentNativeSegwitUtxos } from '@app/query/bitcoin/address/utxos-by-address.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentNetwork } from '@app/store/networks/networks.selectors';

import { createDefaultInitialFormValues } from '../../send-form.utils';

interface Brc20SendFormValues {
  recipient: string;
  amount: string;
  symbol: string;
}

interface UseBrc20SendFormArgs {
  balance: Money;
  ticker: string;
  holderAddress: string;
}

export function useBrc20SendForm({ balance, ticker, holderAddress }: UseBrc20SendFormArgs) {
  const formRef = useRef<FormikProps<Brc20SendFormValues>>(null);
  const { whenWallet } = useWalletType();
  const navigate = useNavigate();
  const currentNetwork = useCurrentNetwork();
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const { data: utxos = [], refetch } = useCurrentNativeSegwitUtxos();

  // Forcing a refetch to ensure UTXOs are fresh
  useOnMount(() => refetch());

  // TODO: change recipient to that one user iputs
  const initialValues = createDefaultInitialFormValues({
    recipient: nativeSegwitSigner.address,
    amount: '',
    symbol: ticker,
  });

  const validationSchema = yup.object({
    amount: yup.number().concat(currencyAmountValidator()).concat(tokenAmountValidator(balance)),
    recipient: yup
      .string()
      .concat(btcAddressValidator())
      .concat(btcAddressNetworkValidator(currentNetwork.chain.bitcoin.bitcoinNetwork)),
  });
  const { onFormStateChange } = useUpdatePersistedSendFormValues();

  async function chooseTransactionFee(
    values: Brc20SendFormValues,
    formikHelpers: FormikHelpers<Brc20SendFormValues>
  ) {
    logger.debug('btc form values', values);
    // Validate and check high fee warning first
    await formikHelpers.validateForm();
    whenWallet({
      software: () =>
        navigate(RouteUrls.SendBrc20ChooseFee.replace(':ticker', ticker), {
          state: { ...values, ticker, utxos, holderAddress, hasHeaderTitle: true },
        }),
      ledger: noop,
    })();
  }

  return {
    initialValues,
    chooseTransactionFee,
    validationSchema,
    formRef,
    onFormStateChange,
  };
}
