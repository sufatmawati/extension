import { FormEvent, useCallback, useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { styled } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useKeyActions } from '@app/common/hooks/use-key-actions';
import { buildEnterKeyEvent } from '@app/common/hooks/use-modifier-key';
import { WaitingMessages, useWaitingMessage } from '@app/common/utils/use-waiting-message';
import { Button } from '@app/ui/components/button/button';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Card } from '@app/ui/components/layout/card/card';
import { Page } from '@app/ui/components/layout/page/page.layout';
import { Link } from '@app/ui/components/link/link';

import { ErrorLabel } from './error-label';

const waitingMessages: WaitingMessages = {
  '2': 'Verifying password…',
  '10': 'Still working…',
  '20': 'Almost there',
};

interface RequestPasswordProps {
  onSuccess(): void;
}
export function RequestPassword({ onSuccess }: RequestPasswordProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unlockWallet } = useKeyActions();
  const analytics = useAnalytics();
  const [isRunning, waitingMessage, startWaitingMessage, stopWaitingMessage] =
    useWaitingMessage(waitingMessages);

  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    startWaitingMessage();
    setError('');
    try {
      await unlockWallet(password);
      onSuccess?.();
    } catch (error) {
      setError('The password you entered is invalid');
    }
    stopWaitingMessage();
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [analytics, startWaitingMessage, stopWaitingMessage, unlockWallet, password, onSuccess]);

  // if (sessionLocked) {
  // TODO #4370 revisit and test this screen with set-password

  // have to not show main header for this pagfe h

  // PETE - extract this to a full card layout container

  // Finish this soon
  // - get spacing right
  // implement 2 column + storybook s

  return (
    <Page marginTop={{ base: '0', md: '80px' }}>
      <Card
        title="Enter your password"
        text="Your password is used to secure your Secret Key and is only used locally on your device."
        action={
          <Footer variant="card">
            <Button
              data-testid={SettingsSelectors.UnlockWalletBtn}
              disabled={isRunning || !!error}
              aria-busy={isRunning}
              onClick={submit}
            >
              Continue
            </Button>
          </Footer>
        }
      >
        <styled.input
          _focus={{ border: 'focus' }}
          autoCapitalize="off"
          autoComplete="off"
          autoFocus
          border="active"
          borderRadius="sm"
          data-testid={SettingsSelectors.EnterPasswordInput}
          disabled={isRunning}
          height="64px"
          onChange={(e: FormEvent<HTMLInputElement>) => {
            setError('');
            setPassword(e.currentTarget.value);
          }}
          onKeyUp={buildEnterKeyEvent(submit)}
          p="space.04"
          placeholder="Enter your password"
          ring="none"
          type="password"
          textStyle="body.02"
          value={password}
          width="100%"
        />
        {error && <ErrorLabel width="100%">{error}</ErrorLabel>}
        {isRunning && waitingMessage && (
          <styled.p
            textStyle={{ base: 'label.01', md: 'heading.05' }}
            mb="space.06"
            textAlign="left"
          >
            {waitingMessage}
          </styled.p>
        )}
        {/*  TODO add max width to <Link */}
        <Link maxWidth="fit-content">Forgot password?</Link>
      </Card>
    </Page>
  );
}
