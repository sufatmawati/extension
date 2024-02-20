import { Flex, styled } from 'leather-styles/jsx';

import AccessibleIcon from '@app/ui/components/avatar-icon/accessible-icon';
import { Button } from '@app/ui/components/button/button';

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  icon: React.ReactNode;
  label: string;
}

export function ActionButton({ icon, label, ...rest }: ActionButtonProps) {
  return (
    <Button variant="ghost" key={label} width={['1/4', '', 'unset']} textStyle="label.03" {...rest}>
      <Flex gap="space.01" direction="column" align="center">
        <AccessibleIcon label={label}>{icon}</AccessibleIcon>
        <styled.span px="space.02">{label}</styled.span>
      </Flex>
    </Button>
  );
}
