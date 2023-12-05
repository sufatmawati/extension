import type { Meta } from '@storybook/react';
import { Box, Flex, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { ArrowDownIcon } from '@app/ui/components/icons/arrow-down-icon';
import { ArrowUpIcon } from '@app/ui/components/icons/arrow-up-icon';
import { PlusIcon } from '@app/ui/components/icons/plus-icon';
import { SwapIcon } from '@app/ui/components/icons/swap-icon';
import { ActionButton } from '@app/ui/components/layout/card/account/action-button';
import { Tabs } from '@app/ui/components/tabs/tabs';

import { HomeLayout as Component } from './home.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Design System/Pages/Home',
};

export default meta;

export function HomeLayout() {
  return (
    <Component
      name="leather.btc"
      balance="$1,000"
      accountActions={
        // TODO don't repeat this, compose story
        <Flex justify="space-between">
          <ActionButton icon={<ArrowUpIcon />} label="Send" />
          <ActionButton icon={<ArrowDownIcon />} label="Receive" />
          <ActionButton icon={<PlusIcon />} label="Buy" />
          <ActionButton icon={<SwapIcon />} label="Swap" />
        </Flex>
      }
    >
      <Stack flexGrow={1} mt="space.05" gap="space.06">
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger data-testid="tab-assets" value={RouteUrls.Home}>
              Assets
            </Tabs.Trigger>
            <Tabs.Trigger
              data-testid="tab-activity"
              value={`${RouteUrls.Home}${RouteUrls.Activity}`}
            >
              Activity
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Box width="100%" height="400px" backgroundColor="lightModeRed.300" />
      </Stack>
    </Component>
  );
}
