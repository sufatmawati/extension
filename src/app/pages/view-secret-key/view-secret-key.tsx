import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { RequestPassword } from '@app/components/request-password';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { TwoColumnLayout } from '@app/ui/components/layout/page/two-column.layout';

import { ViewSecretKeyContent } from './components/view-secret-key.content';

// PETe - probably better to refactor this to not mess up heacer?
export function ViewSecretKey() {
  const analytics = useAnalytics();
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  if (showSecretKey) {
    return (
      <TwoColumnLayout
        left={<ViewSecretKeyContent />}
        right={<SecretKeyDisplayer secretKey={defaultWalletSecretKey ?? ''} />}
      />
    );
  }

  return (
    <>
      <RequestPassword onSuccess={() => setShowSecretKey(true)} />
      <Outlet />
    </>
  );
}
