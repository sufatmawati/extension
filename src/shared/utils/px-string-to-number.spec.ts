// TODO update this once monorepo updated
// import { tokens } from '@leather-wallet/tokens';
import { tempTokens as tokens } from '@app/ui/tokens';

import { pxStringToNumber } from './px-string-to-number';

describe('convert px string to number for calculation', () => {
  it('converts standard px string to number', () => {
    const result = pxStringToNumber('10px');
    expect(result).toEqual(10);
  });
  it('converts token px string to number', () => {
    const result = pxStringToNumber(tokens.sizes.dialogHeight.value);
    expect(result).toEqual(600);
  });
});
