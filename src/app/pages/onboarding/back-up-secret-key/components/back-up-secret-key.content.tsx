import { HStack, Stack, styled } from 'leather-styles/jsx';

import { EyeSlashIcon } from '@app/ui/components/icons/eye-slash-icon';
import { LockIcon } from '@app/ui/components/icons/lock-icon';
import { RotateLeftIcon } from '@app/ui/components/icons/rotate-left-icon';

export function BackUpSecretKeyContent(): React.JSX.Element {
  return (
    <>
      <styled.h1 textStyle="heading.03" mt="space.00" mb="space.04">
        Back up your Secret Key
      </styled.h1>
      <styled.p textStyle="label.02" mb="space.08">
        You'll need it to access your wallet on a new device, or this one if you lose your password
        — so back it up somewhere safe!
      </styled.p>

      <Stack gap="space.05">
        <HStack alignItems="center">
          <RotateLeftIcon />
          <styled.span textStyle="caption.01">
            Your Secret Key gives access to your wallet
          </styled.span>
        </HStack>
        <HStack alignItems="center">
          <EyeSlashIcon />
          <styled.span textStyle="caption.01">Never share your Secret Key with anyone</styled.span>
        </HStack>
        <HStack alignItems="center">
          <LockIcon />
          <styled.span textStyle="caption.01">
            Store it somewhere 100% private and secure
          </styled.span>
        </HStack>
      </Stack>
    </>
  );
}
