import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { RequestPassword } from '@app/components/request-password';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { TwoColumnLayout } from '@app/ui/components/containers/two-column.layout';

import { ViewSecretKeyContent } from './components/view-secret-key.content';

export function ViewSecretKey() {
  const analytics = useAnalytics();
  const defaultWalletSecretKey = useDefaultWalletSecretKey();
  const [showSecretKey, setShowSecretKey] = useState(false);

  // FIXME 4370 task #10  - fix this as flow is totally crashing for some reason

  useEffect(() => {
    void analytics.page('view', '/save-secret-key');
  }, [analytics]);

  if (showSecretKey) {
    return (
      <TwoColumnLayout
        leftColumn={<ViewSecretKeyContent />}
        rightColumn={<SecretKeyDisplayer secretKey={defaultWalletSecretKey ?? ''} />}
      />
    );
  }

  return (
    <>
      <RequestPassword
        title={
          <>
            View
            <br />
            Secret Key
          </>
        }
        caption="Enter the password you set on this device"
        onSuccess={() => setShowSecretKey(true)}
      />
      <Outlet />
    </>
  );
}
