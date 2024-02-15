import { styled } from 'leather-styles/jsx';

import { LeatherIcon } from '@app/ui/components/icons/leather-icon';

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
      <LeatherIcon width="logoWidth" height="logoHeight" />
    </styled.button>
  );
}
