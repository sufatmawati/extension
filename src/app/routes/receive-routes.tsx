import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { ReceiveBtcModal } from '@app/pages/receive/receive-btc';
import { ReceiveDialog } from '@app/pages/receive/receive-dialog';
import { ReceiveOrdinalModal } from '@app/pages/receive/receive-ordinal';
import { ReceiveStxModal } from '@app/pages/receive/receive-stx';

export const receiveRoutes = (
  <Route>
    <Route path={RouteUrls.Receive} element={<ReceiveDialog />} />
    <Route path={RouteUrls.ReceiveStx} element={<ReceiveStxModal />} />
    <Route path={RouteUrls.ReceiveBtc} element={<ReceiveBtcModal />} />
    <Route path={RouteUrls.ReceiveBtcStamp} element={<ReceiveBtcModal type="btc-stamp" />} />
    <Route path={RouteUrls.ReceiveCollectible} element={<ReceiveDialog type="collectible" />} />
    <Route path={RouteUrls.ReceiveCollectibleOrdinal} element={<ReceiveOrdinalModal />} />
  </Route>
);
