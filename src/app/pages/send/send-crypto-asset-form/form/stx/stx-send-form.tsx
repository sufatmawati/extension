import { CryptoCurrencies } from '@shared/models/currencies.model';

import { StxAvatar } from '@app/components/crypto-assets/stacks/components/stx-avatar';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendFiatValue } from '../../components/send-fiat-value';
import { SendMaxButton } from '../../components/send-max-button';
import { StacksCommonSendForm } from '../stacks/stacks-common-send-form';
import { useStxSendForm } from './use-stx-send-form';

const symbol: CryptoCurrencies = 'STX';

export function StxSendForm() {
  const stxMarketData = useCryptoCurrencyMarketData(symbol);

  const {
    availableStxBalance,
    initialValues,
    previewTransaction,
    sendMaxBalance,
    stxFees: fees,
    validationSchema,
    fee,
  } = useStxSendForm();

  const amountField = (
    <AmountField
      balance={availableStxBalance}
      switchableAmount={<SendFiatValue marketData={stxMarketData} assetSymbol={symbol} />}
      bottomInputOverlay={
        <SendMaxButton balance={availableStxBalance} sendMaxBalance={sendMaxBalance.toString()} />
      }
      autoComplete="off"
    />
  );

  const selectedAssetField = (
    <SelectedAssetField icon={<StxAvatar />} name="Stacks" symbol={symbol} />
  );

  return (
    <StacksCommonSendForm
      onSubmit={previewTransaction}
      initialValues={initialValues}
      validationSchema={validationSchema}
      amountField={amountField}
      selectedAssetField={selectedAssetField}
      fees={fees}
      // FIXME 4370 - need to fix this as fee is actually  NumberSchema<number | undefined, AnyObject>; in FeeValidatorFactoryArgs
      // this needs to be the STX fee so it can be validated against HIGH_FEE_AMOUNT_STX
      fee={fee as unknown as string}
      availableTokenBalance={availableStxBalance}
    />
  );
}
