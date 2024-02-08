import { Route } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { SignOutConfirmDialog } from '@app/pages/sign-out-confirm/sign-out-confirm';

export const settingsRoutes = (
  <Route>
    <Route path={RouteUrls.SignOutConfirm} element={<SignOutConfirmDialog />} />
  </Route>
);
