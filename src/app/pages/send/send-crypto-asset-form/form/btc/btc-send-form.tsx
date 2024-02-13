import { Outlet } from 'react-router-dom';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Form, Formik } from 'formik';
import { Box } from 'leather-styles/jsx';

import { HIGH_FEE_WARNING_LEARN_MORE_URL_BTC } from '@shared/constants';
import { CryptoCurrencies } from '@shared/models/currencies.model';

import { formatMoney } from '@app/common/money/format-money';
import { HighFeeDialog } from '@app/features/dialogs/high-fee-dialog/high-fee-dialog';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { Button } from '@app/ui/components/button/button';
import { AvailableBalance } from '@app/ui/components/containers/footers/available-balance';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { BtcIcon } from '@app/ui/components/icons/btc-icon';

import { AmountField } from '../../components/amount-field';
import { SelectedAssetField } from '../../components/selected-asset-field';
import { SendCryptoAssetFormLayout } from '../../components/send-crypto-asset-form.layout';
import { SendFiatValue } from '../../components/send-fiat-value';
import { BitcoinRecipientField } from '../../family/bitcoin/components/bitcoin-recipient-field';
import { BitcoinSendMaxButton } from '../../family/bitcoin/components/bitcoin-send-max-button';
import { TestnetBtcMessage } from '../../family/bitcoin/components/testnet-btc-message';
import { useSendFormRouteState } from '../../hooks/use-send-form-route-state';
import { createDefaultInitialFormValues, defaultSendFormFormikProps } from '../../send-form.utils';
import { useBtcSendForm } from './use-btc-send-form';

const symbol: CryptoCurrencies = 'BTC';

export function BtcSendForm() {
  const routeState = useSendFormRouteState();
  const btcMarketData = useCryptoCurrencyMarketData(symbol);

  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const btcBalance = useNativeSegwitBalance(nativeSegwitSigner.address);

  const {
    calcMaxSpend,
    chooseTransactionFee,
    currentNetwork,
    formRef,
    isSendingMax,
    onFormStateChange,
    onSetIsSendingMax,
    utxos,
    validationSchema,
  } = useBtcSendForm();

  return (
    <Box width="100%" pb="space.04">
      <Formik
        initialValues={createDefaultInitialFormValues({
          ...routeState,
          recipientBnsName: '',
          symbol,
        })}
        onSubmit={chooseTransactionFee}
        validationSchema={validationSchema}
        innerRef={formRef}
        {...defaultSendFormFormikProps}
      >
        {props => {
          onFormStateChange(props.values);
          const sendMaxCalculation = calcMaxSpend(props.values.recipient, utxos);

          return (
            <Form>
              <SendCryptoAssetFormLayout>
                <AmountField
                  autoComplete="off"
                  balance={btcBalance.balance}
                  bottomInputOverlay={
                    <BitcoinSendMaxButton
                      balance={btcBalance.balance}
                      isSendingMax={isSendingMax}
                      onSetIsSendingMax={onSetIsSendingMax}
                      sendMaxBalance={sendMaxCalculation.spendableBitcoin.toString()}
                      sendMaxFee={sendMaxCalculation.spendAllFee.toString()}
                    />
                  }
                  onSetIsSendingMax={onSetIsSendingMax}
                  isSendingMax={isSendingMax}
                  switchableAmount={
                    <SendFiatValue marketData={btcMarketData} assetSymbol={symbol} />
                  }
                />
                <SelectedAssetField
                  icon={<BtcIcon />}
                  name={btcBalance.asset.name}
                  symbol={symbol}
                />
                <BitcoinRecipientField />
                {currentNetwork.chain.bitcoin.bitcoinNetwork === 'testnet' && <TestnetBtcMessage />}
              </SendCryptoAssetFormLayout>

              <Footer>
                <Button
                  data-testid={SendCryptoAssetSelectors.PreviewSendTxBtn}
                  onClick={() => props.handleSubmit()}
                  type="submit"
                >
                  Continue
                </Button>
                <AvailableBalance balance={formatMoney(btcBalance.balance)} />
              </Footer>
              <HighFeeDialog learnMoreUrl={HIGH_FEE_WARNING_LEARN_MORE_URL_BTC} />
              <Outlet />

              {/* This is for testing purposes only, to make sure the form is ready to be submitted. */}
              {calcMaxSpend(props.values.recipient, utxos).spendableBitcoin.toNumber() > 0 ? (
                <Box data-testid={SendCryptoAssetSelectors.SendPageReady}></Box>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
