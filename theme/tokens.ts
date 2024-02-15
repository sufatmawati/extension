import { tokens as leatherTokens } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

import { tempTokens } from '@app/ui/tokens';

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  ...leatherTokens,

  sizes: {
    ...leatherTokens.sizes,
    ...tempTokens.sizes,
  },
});
