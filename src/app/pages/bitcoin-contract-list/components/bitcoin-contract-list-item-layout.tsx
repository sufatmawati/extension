import { useCallback } from 'react';

import { Flex, HStack, styled } from 'leather-styles/jsx';

import { createMoneyFromDecimal } from '@shared/models/money.model';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { Flag } from '@app/ui/components/flag/flag';
import { Caption } from '@app/ui/components/typography/caption';
import { BitcoinContractIcon } from '@app/ui/icons/bitcoin-contract-icon';

interface BitcoinContractListItemLayoutProps {
  id: string;
  state: string;
  collateralAmount: string;
  txid: string;
}
export function BitcoinContractListItemLayout({
  id,
  state,
  collateralAmount,
  txid,
}: BitcoinContractListItemLayoutProps) {
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), bitcoinMarketData)
      ),
    [bitcoinMarketData]
  );

  return (
    <Flex
      mb="15px"
      onClick={() =>
        handleOpenTxLink({
          txid,
        })
      }
    >
      <Flag img={<BitcoinContractIcon />} spacing="space.04" width="100%">
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <styled.span textStyle="body.01">{id}</styled.span>
          <styled.span fontVariantNumeric="tabular-nums" textAlign="right" textStyle="body.01">
            {satToBtc(parseInt(collateralAmount)).toString()}
          </styled.span>
        </HStack>
        <HStack height="1.25rem" alignItems="center" justifyContent="space-between" width="100%">
          <Caption>{state}</Caption>
          <Caption>{getFiatValue(satToBtc(parseInt(collateralAmount)).toString())}</Caption>
        </HStack>
      </Flag>
    </Flex>
  );
}
