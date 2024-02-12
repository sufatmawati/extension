import { Stack } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { FOOTER_HEIGHT, HEADER_HEIGHT } from '@app/ui/constants';

export function PopupCard({ children }: HasChildren) {
  return (
    <Stack
      alignItems="center"
      // #4140 = maxHeight needs to consider header + footer - get calc working!
      // maxHeight={`calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`}
      maxHeight="calc(100vh - 167px)"
      overflowY="auto"
      px="space.05"
      gap="space.02"
      width="100%"
    >
      {children}
    </Stack>
  );
}
