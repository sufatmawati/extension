import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Stack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { capitalize } from '@app/common/utils';
import { CryptoAssetItemLayout } from '@app/components/crypto-asset-item/crypto-asset-item.layout';
import { BitcoinNativeSegwitAccountLoader } from '@app/components/loaders/bitcoin-account-loader';
import { BtcCryptoAssetLoader } from '@app/components/loaders/btc-crypto-asset-loader';
import { CurrentStacksAccountLoader } from '@app/components/loaders/stacks-account-loader';
import { StxCryptoAssetLoader } from '@app/components/loaders/stx-crypto-asset-loader';
import { StxCryptoAssetItem } from '@app/features/asset-list/stacks/stx-crypo-asset-item/stx-crypto-asset-item';
import type { AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';
import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { Card } from '@app/ui/layout/card/card';
import { Page } from '@app/ui/layout/page/page.layout';

export function ChooseCryptoAssetToFund() {
  const navigate = useNavigate();

  const navigateToFund = useCallback(
    (asset: AccountCryptoAssetWithDetails) =>
      navigate(RouteUrls.Fund.replace(':currency', asset.info.symbol)),
    [navigate]
  );

  return (
    <>
      <Page>
        <Card
          header={
            <styled.h1 textStyle="heading.03" p="space.05">
              choose asset <br /> to fund
            </styled.h1>
          }
        >
          <Stack pb="space.04" px="space.05">
            <BitcoinNativeSegwitAccountLoader current>
              {signer => (
                <BtcCryptoAssetLoader address={signer.address}>
                  {(asset, isLoading) => (
                    <CryptoAssetItemLayout
                      asset={asset}
                      icon={<BtcAvatarIcon />}
                      isLoading={isLoading}
                      name={capitalize(asset.info.name)}
                      onClick={() => navigateToFund(asset)}
                    />
                  )}
                </BtcCryptoAssetLoader>
              )}
            </BitcoinNativeSegwitAccountLoader>

            <CurrentStacksAccountLoader>
              {account => (
                <StxCryptoAssetLoader address={account.address}>
                  {(asset, isInitialLoading) => (
                    <StxCryptoAssetItem
                      asset={asset}
                      isLoading={isInitialLoading}
                      onClick={() => navigateToFund(asset)}
                    />
                  )}
                </StxCryptoAssetLoader>
              )}
            </CurrentStacksAccountLoader>
          </Stack>
        </Card>
      </Page>
      <Outlet />
    </>
  );
}
