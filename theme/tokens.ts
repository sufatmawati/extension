import { tokens as leatherTokens } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

const tempTokens = {
  sizes: {
    // 4370 TODO - update in monorepo and deprecate - centeredPageFullWidth
    pageWidth: { value: '500px' },
    twoColumnPageWidth: { value: '500px' },
    fullPageMaxWidth: { value: '882px' },
    // FIXME - audit dialogHeight
    dialogHeight: { value: '600px' },
    dialogContentHeight: { value: '500px' },
    headerHeight: { value: '80px' },
    footerHeight: { value: '95px' },
    // #4250 setting consistent dimensions of extension + popup to match mobile
    popupWidth: { value: '390px' },
    popupHeight: { value: '756px' },
    popupHeaderHeight: { value: '68px' },
    bigTitleHeight: { value: '70px' },
    bigTitleWidth: { value: '270px' },
    logoHeight: { value: '32px' },
    logoWidth: { value: '86px' },
  },
};

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  ...leatherTokens,

  sizes: {
    ...leatherTokens.sizes,
    ...tempTokens.sizes,
  },
});
