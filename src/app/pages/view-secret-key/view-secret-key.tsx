import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Stack, styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { RequestPassword } from '@app/components/request-password';
import { SecretKeyDisplayer } from '@app/features/secret-key-displayer/secret-key-displayer';
import { useDefaultWalletSecretKey } from '@app/store/in-memory-key/in-memory-key.selectors';
import { TwoColumnLayout } from '@app/ui/components/layout/page/two-column.layout';

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
        left={
          <Stack gap="space.04">
            <styled.h1 textStyle="heading.03">
              Your <br /> Secret Key
            </styled.h1>
            <styled.p textStyle="label.02">
              These 24 words are your Secret Key. They create your account, and you sign in on
              different devices with them. Make sure to save these somewhere safe.
            </styled.p>

            <styled.p textStyle="label.02">
              If you lose these words, you lose your account.
            </styled.p>
          </Stack>
        }
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
