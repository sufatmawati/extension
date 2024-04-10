import { HStack, styled } from 'leather-styles/jsx';

import { whenPageMode } from '@app/common/utils';
import { ChevronsRightIcon } from '@app/ui/icons/chevrons-right-icon';

interface IncreaseFeeButtonProps {
  isEnabled?: boolean;
  isSelected: boolean;
  onIncreaseFee(): void;
}
export function IncreaseFeeButton(props: IncreaseFeeButtonProps) {
  const { isEnabled, isSelected, onIncreaseFee } = props;
  const isActive = isEnabled && !isSelected;

  return (
    <styled.button
      _hover={{ color: 'ink.text-subdued' }}
      bg="ink.background-primary"
      maxWidth="110px"
      ml="auto"
      onClick={e => {
        onIncreaseFee();
        e.stopPropagation();
      }}
      opacity={!isActive ? 0 : 1}
      pointerEvents={!isActive ? 'none' : 'all'}
      position="relative"
      px="space.02"
      py="space.01"
      rounded="xs"
      type="button"
      zIndex={999}
    >
      <HStack gap="space.01">
        <ChevronsRightIcon color="stacks" variant="small" />
        <styled.span textStyle="label.03">
          {whenPageMode({
            popup: 'Fee',
            full: 'Increase fee',
          })}
        </styled.span>
      </HStack>
    </styled.button>
  );
}
