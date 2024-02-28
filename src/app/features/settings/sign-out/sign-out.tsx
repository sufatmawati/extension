import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { useFormik } from 'formik';
import { Flex, HStack, styled } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { Button } from '@app/ui/components/button/button';
import { Callout } from '@app/ui/components/callout/callout';
import { Dialog, DialogProps } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';

interface SignOutDialogProps extends DialogProps {
  onUserDeleteWallet(): void;
}
export function SignOutDialog({ isShowing, onUserDeleteWallet, onClose }: SignOutDialogProps) {
  const { whenWallet, walletType } = useWalletType();
  const form = useFormik({
    initialValues: {
      confirmBackup: whenWallet({ ledger: true, software: false }),
      confirmPasswordDisable: whenWallet({ ledger: true, software: false }),
    },
    onSubmit() {
      onUserDeleteWallet();
    },
  });

  const canSignOut = form.values.confirmBackup && form.values.confirmPasswordDisable;

  return (
    <Dialog
      title="Sign out"
      isShowing={isShowing}
      onClose={onClose}
      footer={
        <Footer flexDirection="row">
          <Button
            color="gray"
            data-testid={SettingsSelectors.BtnSignOutReturnToHomeScreen}
            flexGrow={1}
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="lightModeInk.1"
            _hover={{ background: 'black' }}
            opacity={!canSignOut ? 0.8 : undefined}
            data-testid={SettingsSelectors.BtnSignOutActuallyDeleteWallet}
            flexGrow={1}
            disabled={!canSignOut}
            onClick={() => canSignOut && onUserDeleteWallet()}
            type="submit"
          >
            Sign out
          </Button>
        </Footer>
      }
    >
      <Callout variant="warning" width="100%" title="You'll need your Secret Key to sign in again">
        {whenWallet({
          software:
            "Back up your Secret Key before signing out. You'll be asked for your Secret Key on your next login.",
          ledger:
            "When you sign out, you'll need to reconnect your Ledger to sign back into your wallet.",
        })}
      </Callout>
      <Flex alignItems="center" flexDirection="column" p="space.05">
        <form onChange={form.handleChange} onSubmit={form.handleSubmit}>
          <styled.label alignItems="center" display={walletType === 'software' ? 'flex' : 'none'}>
            <HStack gap="space.03">
              <input
                type="checkbox"
                name="confirmBackup"
                defaultChecked={form.values.confirmBackup}
                data-testid={SettingsSelectors.SignOutConfirmHasBackupCheckbox}
              />

              <styled.p textStyle="caption.01" userSelect="none">
                I have backed up my Secret Key.
              </styled.p>
            </HStack>
          </styled.label>
          <styled.label
            alignItems="center"
            mt="space.05"
            display={walletType === 'software' ? 'flex' : 'none'}
          >
            <HStack gap="space.03">
              <input
                type="checkbox"
                name="confirmPasswordDisable"
                defaultChecked={form.values.confirmPasswordDisable}
                data-testid={SettingsSelectors.SignOutConfirmPasswordDisable}
              />
              <styled.p textStyle="caption.01" userSelect="none">
                I understand that my password will not give me access to my wallet after I sign out.
              </styled.p>
            </HStack>
          </styled.label>
        </form>
      </Flex>
    </Dialog>
  );
}
