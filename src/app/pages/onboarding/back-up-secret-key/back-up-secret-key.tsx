import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { TwoColumnLayout } from '@app/ui/components/layout/page/two-column.layout';

import { BackUpSecretKeyContent } from './components/back-up-secret-key.content';

export const BackUpSecretKeyPage = memo(() => {
  const secretKey = useDefaultWalletSecretKey();
  const navigate = useNavigate();

  useEffect(() => {
    if (!secretKey) navigate(RouteUrls.Onboarding);
  }, [navigate, secretKey]);

  if (!secretKey) return null;

  return (
    <TwoColumnLayout
      left={<BackUpSecretKeyContent />}
      right={<SecretKeyDisplayer secretKey={secretKey} />}
    />
  );
});
