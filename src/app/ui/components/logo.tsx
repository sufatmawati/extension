import { styled } from 'leather-styles/jsx';

import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

interface LogoProps {
  onClick?(): void;
}
export function Logo({ onClick }: LogoProps) {
  return (
    <styled.button
      _hover={onClick && { color: 'accent.action-primary-hover' }}
      color="accent.text-primary"
      cursor={onClick ? 'pointer' : 'unset'}
      onClick={onClick ? onClick : undefined}
    >
      <LogomarkIcon width="logoWidth" height="logoHeight" />
    </styled.button>
  );
}
