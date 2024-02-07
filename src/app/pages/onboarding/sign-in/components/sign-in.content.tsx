import { styled } from 'leather-styles/jsx';

import { Link } from '@app/ui/components/link/link';

export function SignInContent({
  onClick,
  twentyFourWordMode,
}: {
  onClick(): void;
  twentyFourWordMode: boolean;
}): React.JSX.Element {
  return (
    <>
      <styled.h1 textStyle="heading.03">
        Sign in <br /> with your <br />
        Secret Key
      </styled.h1>
      <styled.p textStyle="label.02">
        Speed things up by pasting your entire Secret Key in one go.
      </styled.p>
      <Link
        onClick={onClick}
        textStyle="label.03"
        width="fit-content"
        variant="text"
        marginTop="space.04"
      >
        {twentyFourWordMode ? 'Have a 12-word Secret Key?' : 'Use 24 word Secret Key'}
      </Link>
    </>
  );
}
