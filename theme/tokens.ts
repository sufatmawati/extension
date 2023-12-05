import { tokens as leatherTokens } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  ...leatherTokens,

  sizes: {
    ...leatherTokens.sizes,
    // 4370 TODO - update in monorepo and deprecate - centeredPageFullWidth
    pageWidth: { value: '500px' },
    twoColumnPageWidth: { value: '500px' },
    fullPageMaxWidth: { value: '882px' },
    dialogHeight: { value: '600px' },
    headerHeight: { value: '80px' },
    headerHeightSm: { value: '68px' },
    footerHeight: { value: '95px' },
  },
});
