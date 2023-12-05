import { useLocation, useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';
import get from 'lodash.get';

import { RouteUrls } from '@shared/route-urls';

import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Header } from '@app/ui/components/containers/headers/header';

import { useSwapContext } from '../swap.context';
import { SwapAssetList } from './components/swap-asset-list';

export function useSwapChooseAssetState() {
  const location = useLocation();
  const swapListType = get(location.state, 'swap') as string;
  return { swapListType };
}

export function SwapChooseAsset() {
  const { swappableAssetsFrom, swappableAssetsTo } = useSwapContext();
  const { swapListType } = useSwapChooseAssetState();
  const navigate = useNavigate();

  const isFromList = swapListType === 'from';

  const title = isFromList ? 'Choose asset to swap' : 'Choose asset to receive';

  return (
    <Dialog
      isShowing
      onClose={() => navigate(RouteUrls.Swap)}
      header={
        <Header
          variant="receive"
          onGoBack={() => navigate(RouteUrls.Swap)}
          title={<styled.h1 textStyle="heading.03">{title}</styled.h1>}
        />
      }
    >
      <SwapAssetList assets={isFromList ? swappableAssetsFrom : swappableAssetsTo} />
    </Dialog>
  );
}
