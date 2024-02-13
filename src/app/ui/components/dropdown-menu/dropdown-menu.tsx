import { ReactNode, forwardRef } from 'react';

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { css } from 'leather-styles/css';

import { itemBaseStyles, itemInteractiveStyles } from '../item/item-interactive';

export interface DropdownMenuItem {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  label: string;
}

const Root = RadixDropdownMenu.Root;

const dropdownTriggerStyles = css({
  // TODO 4370 check this is OK with FARA - better to not set so the page BG dictates it
  // bg: 'accent.background-primary',
  borderRadius: 'xs',
  fontWeight: 500,
  maxWidth: 'fit-content',
  maxHeight: 'fit-content',
  px: 'space.04',
  py: 'space.03',
  textStyle: 'label.02',

  '&[data-state=open]': {
    bg: 'accent.component-background-pressed',
  },
});
const Trigger: typeof RadixDropdownMenu.Trigger = forwardRef((props, ref) => (
  <RadixDropdownMenu.Trigger className={dropdownTriggerStyles} ref={ref} {...props} />
));

const Portal = RadixDropdownMenu.Portal;

const dropdownContentStyles = css({
  alignItems: 'center',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--base-menu-padding': '0px',
  bg: 'accent.background-primary',
  borderRadius: 'xs',
  boxShadow:
    '0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08)',
  minWidth: '256px',
  p: 'space.02',
  willChange: 'transform, opacity',
  zIndex: 999,

  '&[data-side=bottom]': {
    animationName: 'slideUpAndFade',
  },
});
const Content: typeof RadixDropdownMenu.Content = forwardRef((props, ref) => (
  <RadixDropdownMenu.Content className={dropdownContentStyles} ref={ref} {...props} />
));

const Group = RadixDropdownMenu.Group;

const dropdownMenuLabelStyles = css({
  color: 'accent.text-subdued',
  height: 'auto',
  px: 'space.03',
  py: 'space.02',
  textStyle: 'body.02',
  width: '100%',
});
const Label: typeof RadixDropdownMenu.Label = forwardRef((props, ref) => (
  <RadixDropdownMenu.Label className={dropdownMenuLabelStyles} ref={ref} {...props} />
));

const Item: typeof RadixDropdownMenu.Item = forwardRef((props, ref) => (
  <RadixDropdownMenu.Item
    className={css(itemBaseStyles, itemInteractiveStyles)}
    ref={ref}
    {...props}
  />
));

const dropdownMenuSeparatorStyles = css({
  bg: 'accent.background-primary',
  color: 'accent.border-default',
  mx: '0px',
  my: 'space.03',
});
const Separator: typeof RadixDropdownMenu.Separator = forwardRef((props, ref) => (
  <RadixDropdownMenu.Separator className={dropdownMenuSeparatorStyles} ref={ref} {...props} />
));

export const DropdownMenu = {
  Root,
  Trigger,
  Portal,
  Content,
  Group,
  Label,
  Item,
  Separator,
};
