import { ReactNode, memo } from 'react';

import * as RadixDialog from '@radix-ui/react-dialog';
import { css } from 'leather-styles/css';
import { Box } from 'leather-styles/jsx';

import { Header } from '@app/ui/components/containers/headers/header';

export interface DialogProps {
  children?: ReactNode;
  footer?: ReactNode;
  isShowing: boolean;
  isWaitingOnPerformedAction?: boolean;
  onGoBack?(): void;
  onClose(): void;
  canClose?: boolean;
  pauseOnClickOutside?: boolean; // FIXME - seem to have lost what this does in useDrawer() I think it blocked close on click outside?
  title?: ReactNode;
  // waitingOnPerformedActionMessage?: string;
}

//  TODO 4370 task #1
// - manual task to sift through all Dialogs and read the props - make sure that nothing is missed
// - fix styling of dialog overflow and BigTitles
// - test  LEDGER DIALOGS
export const Dialog = memo(
  ({
    children,
    footer,
    isWaitingOnPerformedAction,
    onClose,
    title,
    isShowing,
    canClose = true,
  }: DialogProps) => {
    if (!isShowing) return null;

    return (
      <RadixDialog.Root open>
        <RadixDialog.Portal>
          <RadixDialog.Overlay
            className={css({
              backgroundColor: 'overlay',
              position: 'fixed',
              inset: 0,
              animation: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            })}
          >
            <RadixDialog.Content
              onPointerDownOutside={onClose}
              className={css({
                backgroundColor: 'accent.background-primary',
                // remove borderRadius on small to give impression of full page
                borderRadius: { base: '0', md: 'md' },
                boxShadow:
                  'hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0 10px 20px -15px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { base: '100vw', md: '90vw' },
                // try to refactor this onClose so that its big for onBoarding and not others .
                // Of course test everything
                // in popup card doing 167px not 150px - try make it consistent
                //
                // FIXME - get this to calc using footerHeight + headerHeight?
                // maxHeight="calc(100vh - (headerHeight + footerHeight ))"

                // height: { base: '100vh', md: !onClose ? '50vh' : 'calc(50vh - 150px)' },
                // this !onClose stuff breaks select account . Need to just make custom for Allow Diag using a specific flag
                // height: { base: '100vh', md: !onClose ? '50vh' : 'calc(50vh - 150px)' },
                height: { base: '100%', md: '50vh' },
                // minHeight: { base: '100vh', md: '20vh' },
                maxWidth: { base: '100vw', md: 'pageWidth' },
                // maxHeight: { base: '100vh', md: '50vh' },

                // maxHeight="calc(50vh - (footerHeight ))"
                // maxHeight: { base: '100vh', md: 'calc(50vh - 150px)' },
                // TODO need work on height here to make it consistent

                // need to do work on height when on smaller browser heights as some modal content are overflowing outside
                // could need an overflow <Box inside the dialog

                maxHeight: { base: '100%', md: '50vh' },
                animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              })}
            >
              {/* {title && ( */}
              <Header
                variant="page"
                isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                onClose={canClose ? onClose : undefined}
                title={title}
              />
              {/* )} */}

              <Box
                className={css({
                  // PEte need to add this padding directly to children instead
                  // try dataProp / prop for autoPadd here
                  // this is so tabs can be full width in receive
                  // check when reviewing all dialogs
                  // paddingX: 'space.05',
                  // need to tweak this to alter if no header / footer
                  // check LEDGER + SWAP and improve. Pass title as <JSX again to help?
                  height: footer ? 'dialogContentHeight' : 'dialogHeight',
                  maxHeight: footer ? 'dialogContentHeight' : 'dialogHeight',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                })}
              >
                {children}
              </Box>
              {footer}
            </RadixDialog.Content>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }
);
