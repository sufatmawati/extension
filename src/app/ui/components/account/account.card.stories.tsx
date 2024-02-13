import type { Meta } from '@storybook/react';
import { Flex } from 'leather-styles/jsx';

import { ActionButton } from '@app/ui/components/account/action-button';
import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';
import { PlusIcon } from '@app/ui/components/icons/plus-icon';
import { SwapIcon } from '@app/ui/components/icons/swap-icon';

import { AccountCard as Component } from './account.card';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Design System/Layout/AccountCard',
};

export default meta;

export function AccountCard() {
  return (
    <Component name="leather.btc" balance="$1,000">
      <Flex justify="space-between">
        <ActionButton icon={<ArrowUpIcon />} label="Send" />
        <ActionButton icon={<ArrowDownIcon />} label="Receive" />
        <ActionButton icon={<PlusIcon />} label="Buy" />
        <ActionButton icon={<SwapIcon />} label="Swap" />
      </Flex>
    </Component>
  );
}
