import { useCallback, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import { AllTransferableCryptoAssetBalances } from '@shared/models/crypto-asset-balance.model';
import { RouteUrls } from '@shared/route-urls';
import { isDefined } from '@shared/utils';

import { useStxCryptoCurrencyAssetBalance } from '@app/common/hooks/balance/stx/use-stx-crypto-currency-asset-balance';
import { useWalletType } from '@app/common/use-wallet-type';
import { CryptoAssetList } from '@app/components/crypto-assets/choose-crypto-asset/crypto-asset-list';
import { useCheckLedgerBlockchainAvailable } from '@app/store/accounts/blockchain/utils';
import { Card } from '@app/ui/layout/card/card';
import { Page } from '@app/ui/layout/page/page.layout';

export function ChooseCryptoAssetToFund() {
  const stxCryptoCurrencyAssetBalance = useStxCryptoCurrencyAssetBalance();

  const { whenWallet } = useWalletType();
  const navigate = useNavigate();

  const checkBlockchainAvailable = useCheckLedgerBlockchainAvailable();

  const filteredCryptoAssetBalances = useMemo(
    () =>
      [stxCryptoCurrencyAssetBalance].filter(isDefined).filter(assetBalance =>
        whenWallet({
          ledger: checkBlockchainAvailable(assetBalance?.blockchain),
          software: true,
        })
      ),
    [stxCryptoCurrencyAssetBalance, checkBlockchainAvailable, whenWallet]
  );

  const navigateToSendForm = useCallback(
    (cryptoAssetBalance: AllTransferableCryptoAssetBalances) => {
      const { asset } = cryptoAssetBalance;

      const symbol = asset.symbol === '' ? asset.contractAssetName : asset.symbol;
      navigate(RouteUrls.Fund.replace(':currency', symbol.toUpperCase()));
    },
    [navigate]
  );

  return (
    <>
      <Page>
        <Card
          header={
            <styled.h1 textStyle="heading.03" p="space.05">
              choose asset to fund
            </styled.h1>
          }
        >
          <CryptoAssetList
            onItemClick={navigateToSendForm}
            cryptoAssetBalances={filteredCryptoAssetBalances}
          />
        </Card>
      </Page>
      <Outlet />
    </>
  );
}
