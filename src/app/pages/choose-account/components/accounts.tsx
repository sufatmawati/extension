import { Suspense, memo, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { Box, FlexProps, HStack, styled } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useFinishAuthRequest } from '@app/common/authentication/use-finish-auth-request';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useCreateAccount } from '@app/common/hooks/account/use-create-account';
import { useWalletType } from '@app/common/use-wallet-type';
import { slugify } from '@app/common/utils';
import { AccountTotalBalance } from '@app/components/account-total-balance';
import { AcccountAddresses } from '@app/components/account/account-addresses';
import { AccountListItemLayout } from '@app/components/account/account-list-item.layout';
import { usePressable } from '@app/components/item-hover';
import { useNativeSegwitAccountIndexAddressIndexZero } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { StacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.models';
import { AccountAvatar } from '@app/ui/components/account/account-avatar/account-avatar';
import { PlusIcon } from '@app/ui/icons/plus-icon';

interface AccountTitlePlaceholderProps {
  account: StacksAccount;
}
function AccountTitlePlaceholder({ account }: AccountTitlePlaceholderProps) {
  const name = `Account ${account?.index + 1}`;
  return <styled.span>{name}</styled.span>;
}

interface ChooseAccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  isLoading: boolean;
  account: StacksAccount;
  onSelectAccount(index: number): void;
}
const ChooseAccountItem = memo(
  ({ account, isLoading, onSelectAccount }: ChooseAccountItemProps) => {
    const name = useAccountDisplayName(account);
    const btcAddress = useNativeSegwitAccountIndexAddressIndexZero(account.index);

    const accountSlug = useMemo(() => slugify(`Account ${account?.index + 1}`), [account?.index]);

    return (
      // Padding required on outer element to prevent jumpy virtualized list
      <Box pb="space.05">
        <AccountListItemLayout
          accountAddresses={<AcccountAddresses index={account.index} />}
          accountName={
            <Suspense fallback={<AccountTitlePlaceholder account={account} />}>
              <styled.span textStyle="label.01">{name}</styled.span>
            </Suspense>
          }
          avatar={
            <AccountAvatar
              index={account.index}
              publicKey={account.stxPublicKey}
              name={name}
              flexGrow={0}
            />
          }
          balanceLabel={
            <AccountTotalBalance stxAddress={account.address} btcAddress={btcAddress} />
          }
          data-testid={`account-${accountSlug}-${account.index}`}
          index={account.index}
          isLoading={isLoading}
          isSelected={false}
          onSelectAccount={() => onSelectAccount(account.index)}
        />
      </Box>
    );
  }
);

const AddAccountAction = memo(() => {
  const [component, bind] = usePressable(true);
  const createAccount = useCreateAccount();

  const onCreateAccount = () => {
    createAccount();
  };

  return (
    <Box mb="space.05" px="space.03" py="space.02" onClick={onCreateAccount} {...bind}>
      <HStack alignItems="center">
        <PlusIcon />
        Generate new account
      </HStack>
      {component}
    </Box>
  );
});

export const ChooseAccountsList = memo(() => {
  const finishSignIn = useFinishAuthRequest();
  const { whenWallet } = useWalletType();
  const accounts = useStacksAccounts();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const signIntoAccount = async (index: number) => {
    setSelectedAccount(index);
    await whenWallet({
      async software() {
        await finishSignIn(index);
      },
      async ledger() {
        navigate(RouteUrls.ConnectLedger, { state: { index } });
      },
    })();
  };

  if (!accounts) return null;

  return (
    <Box mt="space.05" width="100%">
      {whenWallet({ software: <AddAccountAction />, ledger: <></> })}
      <Virtuoso
        useWindowScroll
        data={accounts}
        itemContent={(index, account) => (
          <ChooseAccountItem
            account={account}
            isLoading={whenWallet({ software: selectedAccount === index, ledger: false })}
            onSelectAccount={signIntoAccount}
          />
        )}
      />
    </Box>
  );
});
