import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { useFormik } from 'formik';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { useWalletType } from '@app/common/use-wallet-type';
import { Button } from '@app/ui/components/button/button';
import { Dialog, DialogProps } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Flag } from '@app/ui/components/flag/flag';
import { ErrorIcon } from '@app/ui/icons/error-icon';

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
          {/* FIXME - need to fix and style this button properly */}
          <Button
            // _hover={{ opacity: 0.8 }}
            // background="red.action-primary-default"
            color="lightModeInk.1"
            // _disabled={{ color: 'ink.non-interactive' }}
            _hover={{ background: 'black' }}
            background="red.action-primary-default"
            // color={theme === 'light' ? 'ink.background-primary' : 'ink.text-primary'}
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
      <Flex
        alignItems="center"
        flexDirection="column"
        pb={{ base: 'space.05', md: 'space.08' }}
        px="space.08"
      >
        <form onChange={form.handleChange} onSubmit={form.handleSubmit}>
          <styled.p textStyle="label.02">
            When you sign out,
            {whenWallet({
              software: ` you'll need your Secret Key to sign back in. Only sign out if you've backed up your Secret Key.`,
              ledger: ` you'll need to reconnect your Ledger to sign back into your wallet.`,
            })}
          </styled.p>
          <styled.div mt="space.05" textStyle="label.02">
            {whenWallet({
              software: (
                <Flag img={<ErrorIcon />} spacing="space.02">
                  If you haven't backed up your Secret Key, you will lose all your funds.
                </Flag>
              ),
              ledger: <></>,
            })}
          </styled.div>
          <styled.label
            alignItems="center"
            mt="space.05"
            display={walletType === 'software' ? 'flex' : 'none'}
          >
            <Box mr="space.03">
              <input
                type="checkbox"
                name="confirmBackup"
                defaultChecked={form.values.confirmBackup}
                data-testid={SettingsSelectors.SignOutConfirmHasBackupCheckbox}
              />
            </Box>
            <styled.p textStyle="caption.01" userSelect="none">
              I've backed up my Secret Key
            </styled.p>
          </styled.label>
          <styled.label
            alignItems="center"
            mt="space.02"
            display={walletType === 'software' ? 'flex' : 'none'}
          >
            <Box mr="space.03">
              <input
                type="checkbox"
                name="confirmPasswordDisable"
                defaultChecked={form.values.confirmPasswordDisable}
                data-testid={SettingsSelectors.SignOutConfirmPasswordDisable}
              />
            </Box>
            <styled.p textStyle="caption.01" userSelect="none">
              I understand my password will no longer work for accessing my wallet upon signing out
            </styled.p>
          </styled.label>
        </form>
      </Flex>
    </Dialog>
  );
}
