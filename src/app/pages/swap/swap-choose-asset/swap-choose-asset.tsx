import { useLocation, useNavigate } from 'react-router-dom';

import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { Box } from 'leather-styles/jsx';
import get from 'lodash.get';

import { BigTitle, Dialog } from '@app/ui/components/containers/dialog/dialog';

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
    <Dialog isShowing title={<BigTitle title={title} />} onClose={() => navigate(-1)}>
      <Box data-testid={SwapSelectors.ChooseAssetList} mx="space.06">
        <SwapAssetList assets={isFromList ? swappableAssetsFrom : swappableAssetsTo} />
      </Box>
    </Dialog>
  );
}
