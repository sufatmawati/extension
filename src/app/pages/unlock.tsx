import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from 'leather-styles/jsx';

import { WALLET_ENVIRONMENT } from '@shared/environment';
import { RouteUrls } from '@shared/route-urls';
import { closeWindow } from '@shared/utils';

import { isFullPageMode, isPopupMode } from '@app/common/utils';
import { openIndexPageInNewTab } from '@app/common/utils/open-in-new-tab';
import { RequestPassword } from '@app/components/request-password';
import { useNewBrandApprover } from '@app/store/settings/settings.selectors';

export function Unlock() {
  const navigate = useNavigate();

  const { hasApprovedNewBrand } = useNewBrandApprover();

  useEffect(() => {
    if (!hasApprovedNewBrand && isPopupMode() && WALLET_ENVIRONMENT !== 'testing') {
      openIndexPageInNewTab('/unlock/we-have-a-new-name');
      closeWindow();
    }
    if (!hasApprovedNewBrand && isFullPageMode()) {
      navigate('./we-have-a-new-name');
    }
  }, [hasApprovedNewBrand, navigate]);

  const handleSuccess = () => navigate(RouteUrls.Home);

  return (
    <>
      {/* Hide the logo when user hasn't consented yet */}
      {/*  TODO 4370 refactor this to not show brand in the header if not approved rather than add an empty box */}
      {!hasApprovedNewBrand && (
        <Box bg="ink.background-secondary" position="fixed" w="200px" h="60px" top={0} left={0} />
      )}

      <RequestPassword onSuccess={handleSuccess} />
      <Outlet />
    </>
  );
}
