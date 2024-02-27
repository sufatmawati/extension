import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { copyToClipboard } from '@app/common/utils/copy-to-clipboard';
import { useBackgroundLocationRedirect } from '@app/routes/hooks/use-background-location-redirect';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { ReceiveTokensLayout } from './components/receive-tokens.layout';

export function ReceiveStxModal() {
  useBackgroundLocationRedirect();
  const currentAccount = useCurrentStacksAccount();
  const analytics = useAnalytics();
  const accountName = useCurrentAccountDisplayName();

  if (!currentAccount) return null;

  return (
    <ReceiveTokensLayout
      address={currentAccount.address}
      accountName={accountName}
      onCopyAddressToClipboard={() => {
        void analytics.track('copy_stx_address_to_clipboard');
        copyToClipboard(currentAccount.address);
      }}
      title="STX"
    />
  );
}
