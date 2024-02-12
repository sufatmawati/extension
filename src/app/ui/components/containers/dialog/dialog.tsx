import { ReactNode, memo } from 'react';

import * as RadixDialog from '@radix-ui/react-dialog';
import { css } from 'leather-styles/css';
import { Box, styled } from 'leather-styles/jsx';

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
    <styled.h1 textStyle="heading.03" maxWidth="270px">
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
// - manual task to sift through all Dialogs and read the props
// - make sure that nothing is missed
// - check LEDGER DIALOGS!!!
export const Dialog = memo(
  ({
    children,
    // header,
    // maybe I need a dialog variant for onboarding
    footer,
    //=> this is needed to block closing of Ledger dialog + some others
    // check useDialog
    isWaitingOnPerformedAction,
    onGoBack,
    onClose,
    title,
    isShowing,
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
                borderRadius: { base: '0', md: 'lg' },
                boxShadow:
                  'hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0 10px 20px -15px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { base: '100vw', md: '90vw' },
                // TODO wait for answer before commiting to this app wide
                // checked FIGMA and seems its always this size now
                height: { base: '100vh', md: 'dialogHeight' },
                maxWidth: { base: '100vw', md: 'pageWidth' },
                maxHeight: { base: '100vh', md: '85vh' },
                animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              })}
            >
              <Box maxHeight="100vh" overflowY="hidden">
                {/*  PETE - now dialogs are always showing a header! - not required 
                
                maybe I need to pass in header instead of title for those? 
                and be able to pass in big/ small text? 
                make them like the receive modal is now
                maybe simpler answer here is to have a dialog variant?

                could need to split between full page and extension headers also 
                */}
                {/* TODO check if this box is even needed now 
                
                  Probably is needed for account selector
                */}
                {/* <Box
        className={css({
          position: 'fixed',
          width: '100%',
          height: '68px',
          padding: '16px',
        })}
      > */}

                {/* //so far header  only passed in my receive-modal + swap-choose 
  and as flavour - 'big-title' - may be able to simplify but is it worth it? 
 */}
                {/* PETE check this for onboarding as the header spacing should be space.04 and not space.05 */}
                {/* {header ? (
                  header
                ) : ( */}
                {title && (
                  <Header
                    variant="page"
                    isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                    onClose={onClose}
                    onGoBack={onGoBack}
                    title={typeof title === 'string' ? <Title title={title} /> : title} // title only used here and passed in by 15 of dialogs
                  />
                )}

                {/* TODO - test this cross browser and remove if repaced by global.ts
                
                  Probably is needed for account selector
                   */}
                <Box
                  className={css({
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
              </Box>
            </RadixDialog.Content>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }
);
