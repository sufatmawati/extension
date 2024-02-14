import { ReactNode, memo } from 'react';

import * as RadixDialog from '@radix-ui/react-dialog';
import { css } from 'leather-styles/css';
import { Box, styled } from 'leather-styles/jsx';

import { isString } from '@shared/utils';

import { Header } from '@app/ui/components/containers/headers/header';

function Title({ title }: { title: string }) {
  return (
    <styled.span margin="auto" textStyle="heading.05">
      {title}
    </styled.span>
  );
}

export function BigTitle({ title }: { title: string }) {
  return (
    <styled.h1 textStyle="heading.03" maxWidth="bigTitleWidth" height="bigTitleHeight">
      {title}
    </styled.h1>
  );
}

export interface DialogProps {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  isShowing: boolean;
  isWaitingOnPerformedAction?: boolean;
  onGoBack?(): void;
  onClose?(): void;
  pauseOnClickOutside?: boolean; // FIXME - seem to have lost what this does in useDrawer() I think it blocked close on click outside?
  title?: ReactNode;
  // waitingOnPerformedActionMessage?: string;
}

//  TODO 4370 task #1
// - manual task to sift through all Dialogs and read the props - make sure that nothing is missed
// - fix styling of dialog overflow and BigTitles
// - test  LEDGER DIALOGS
export const Dialog = memo(
  ({ children, footer, isWaitingOnPerformedAction, onClose, title, isShowing }: DialogProps) => {
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
                borderRadius: { base: '0', md: 'lg' },
                boxShadow:
                  'hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0 10px 20px -15px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { base: '100vw', md: '90vw' },
                height: { base: '100vh', md: '100%' },
                maxWidth: { base: '100vw', md: 'pageWidth' },
                maxHeight: { base: '100vh', md: '50vh' },
                animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              })}
            >
              {/* PETE check this for onboarding as the header spacing should be space.04 and not space.05 */}
              {/* {header ? (
                  header
                ) : ( */}

              {title && (
                <Header
                  variant="page"
                  isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                  onClose={onClose}
                  // onGoBack={onGoBack}
                  title={isString(title) ? <Title title={title} /> : title}
                />
              )}

              {/* TODO - test this cross browser and remove if repaced by global.ts
                
                  Probably is needed for account selector
                   */}
              <Box
                className={css({
                  // height: '520px',
                  // maxHeight: 'fit-content',
                  height: 'dialogContentHeight',
                  maxHeight: 'dialogContentHeight',
                  // overflowY: 'scroll',
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
