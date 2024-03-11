import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { Stack } from 'leather-styles/jsx';

import { FormAddressDisplayer } from '@app/components/address-displayer/form-address-displayer';
import {
  InfoCard,
  InfoCardAssetValue,
  InfoCardFooter,
  InfoCardRow,
  InfoCardSeparator,
} from '@app/components/info-card/info-card';
import { Button } from '@app/ui/components/button/button';
import { Callout } from '@app/ui/components/callout/callout';

interface SendFormConfirmationProps {
  recipient: string;
  fee?: string;
  totalSpend: string;
  arrivesIn: string;
  symbol: string;
  txValue: string | number;
  sendingValue: string;
  txFiatValue?: string;
  txFiatValueSymbol?: string;
  nonce: string;
  memoDisplayText: string;
  isLoading: boolean;
  feeWarningTooltip?: React.ReactNode;
  onBroadcastTransaction(): void;
}
export function SendFormConfirmation({
  txValue,
  txFiatValue,
  txFiatValueSymbol,
  recipient,
  fee,
  totalSpend,
  sendingValue,
  arrivesIn,
  isLoading,
  onBroadcastTransaction,
  nonce,
  memoDisplayText,
  symbol,
  feeWarningTooltip,
}: SendFormConfirmationProps) {
  return (
    <InfoCard
      data-testid={SendCryptoAssetSelectors.ConfirmationDetails}
      pb={{ base: '120px', md: '0' }}
    >
      <InfoCardAssetValue
        data-testid={SendCryptoAssetSelectors.ConfirmationDetailsAssetValue}
        fiatSymbol={txFiatValueSymbol}
        fiatValue={txFiatValue}
        mb="space.05"
        mt={['unset', 'space.05']}
        px="space.05"
        symbol={symbol}
        value={Number(txValue)}
      />

      <Callout variant="info" title="Sending to an exchange?" px="space.03" mb="space.05">
        {`Make sure you include the memo so the exchange can credit the ${symbol} to your account`}
      </Callout>

      <Stack pb="space.06" px="space.06" width="100%">
        <InfoCardRow
          title="To"
          value={<FormAddressDisplayer address={recipient} />}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsRecipient}
        />
        <InfoCardSeparator />
        <InfoCardRow title="Total spend" value={totalSpend} />
        <InfoCardRow title="Sending" value={sendingValue} />
        <InfoCardRow
          title="Fee"
          value={fee}
          titleAdditionalElement={feeWarningTooltip}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsFee}
        />
        <InfoCardRow
          title="Memo"
          value={memoDisplayText}
          data-testid={SendCryptoAssetSelectors.ConfirmationDetailsMemo}
        />
        <InfoCardRow title="Nonce" value={nonce} />
        <InfoCardRow title="Estimated confirmation time" value={arrivesIn} />
      </Stack>

      <InfoCardFooter>
        <Button
          aria-busy={isLoading}
          data-testid={SendCryptoAssetSelectors.ConfirmSendTxBtn}
          onClick={onBroadcastTransaction}
          width="100%"
        >
          Confirm and send transaction
        </Button>
      </InfoCardFooter>
    </InfoCard>
  );
}
