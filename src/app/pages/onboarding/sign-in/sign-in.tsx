import { useEffect, useState } from 'react';

import { createNullArrayOfLength } from '@app/common/utils';
import { MnemonicForm } from '@app/pages/onboarding/sign-in/mnemonic-form';
import { TwoColumnLayout } from '@app/ui/components/layout/page/two-column.layout';

import { SignInContent } from './components/sign-in.content';

export function SignIn() {
  const [twentyFourWordMode, setTwentyFourWordMode] = useState(true);
  const [mnemonic, setMnemonic] = useState<(string | null)[]>([]);

  useEffect(() => {
    const emptyMnemonicArray = twentyFourWordMode
      ? createNullArrayOfLength(24)
      : createNullArrayOfLength(12);
    setMnemonic(emptyMnemonicArray);
  }, [twentyFourWordMode]);

  return (
    <>
      <TwoColumnLayout
        left={
          <SignInContent
            onClick={() => setTwentyFourWordMode(!twentyFourWordMode)}
            twentyFourWordMode={twentyFourWordMode}
          />
        }
        right={
          <MnemonicForm
            mnemonic={mnemonic}
            setMnemonic={setMnemonic}
            twentyFourWordMode={twentyFourWordMode}
          />
        }
      />
    </>
  );
}
