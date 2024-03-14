import type { Meta } from '@storybook/react';
import { Flex } from 'leather-styles/jsx';

import { IconButton } from '@app/ui/components/icon-button/icon-button';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, SwapIcon } from '@app/ui/icons';

import { AccountCard as Component } from './account.card';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/AccountCard',
};

export default meta;

export function AccountCard() {
  return (
    <Component
      name="leather.btc"
      balance="$1,000"
      switchAccount={<></>}
      toggleSwitchAccount={() => null}
    >
      <Flex justify="space-between">
        <IconButton icon={<ArrowUpIcon />} label="Send" />
        <IconButton icon={<ArrowDownIcon />} label="Receive" />
        <IconButton icon={<PlusIcon />} label="Buy" />
        <IconButton icon={<SwapIcon />} label="Swap" />
      </Flex>
    </Component>
  );
}
