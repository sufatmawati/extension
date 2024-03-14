import { ReactNode } from 'react';

import { SharedComponentsSelectors } from '@tests/selectors/shared-component.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { CloseIcon } from '@app/ui/icons';

import { HeaderActionButton } from './header-action-button';

interface BigTitleHeaderProps {
  onClose?(): void;
  title?: ReactNode;
}

export function BigTitleHeader({ onClose, title }: BigTitleHeaderProps) {
  return (
    <Flex justifyContent="space-between" mt={{ base: 'space.05', md: 'unset' }}>
      <styled.h3 textStyle="heading.03">{title}</styled.h3>
      {onClose && (
        <HeaderActionButton
          icon={<CloseIcon hideBelow="md" />}
          dataTestId={SharedComponentsSelectors.HeaderCloseBtn}
          onAction={onClose}
        />
      )}
    </Flex>
  );
}
