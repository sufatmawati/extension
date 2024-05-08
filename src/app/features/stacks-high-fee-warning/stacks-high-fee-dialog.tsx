import { useFormikContext } from 'formik';
import { HStack, Stack } from 'leather-styles/jsx';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Button } from '@app/ui/components/button/button';
import { Dialog } from '@app/ui/components/containers/dialog/dialog';
import { Footer } from '@app/ui/components/containers/footers/footer';
import { Header } from '@app/ui/components/containers/headers/header';
import { Link } from '@app/ui/components/link/link';
import { Caption } from '@app/ui/components/typography/caption';
import { Title } from '@app/ui/components/typography/title';
import { ErrorIcon } from '@app/ui/icons';

import { useStacksHighFeeWarningContext } from './stacks-high-fee-warning-container';

interface HighFeeDialogProps {
  learnMoreUrl: string;
}
export function HighFeeDialog({ learnMoreUrl }: HighFeeDialogProps) {
  const { handleSubmit, values } = useFormikContext();
  const context = useStacksHighFeeWarningContext();

  return (
    <Dialog
      header={<Header variant="dialog" />}
      isShowing={context.showHighFeeWarningDialog}
      onClose={() => context.setShowHighFeeWarningDialog(false)}
      footer={
        <Footer flexDirection="row">
          <Button
            onClick={() => context.setShowHighFeeWarningDialog(false)}
            variant="outline"
            flexGrow={1}
          >
            Edit fee
          </Button>
          <Button
            onClick={() => {
              context.setHasBypassedFeeWarning(true);
              handleSubmit();
            }}
            type="submit"
            flexGrow={1}
          >
            Yes, I'm sure
          </Button>
        </Footer>
      }
    >
      <Stack px="space.05" gap="space.05" pb="space.06">
        <HStack>
          <ErrorIcon color="red.action-primary-default" width="md" />
          <Title>
            Are you sure you want to pay {(values as any).fee} {(values as any).feeCurrency} in fees
            for this transaction?
          </Title>
        </HStack>
        <Caption>
          This action cannot be undone. The fees won't be returned, even if the transaction fails.
          <Link onClick={() => openInNewTab(learnMoreUrl)} size="sm" ml="space.01">
            Learn more
          </Link>
        </Caption>
      </Stack>
    </Dialog>
  );
}
