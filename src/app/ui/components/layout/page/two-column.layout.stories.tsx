import type { Meta } from '@storybook/react';
import { Box } from 'leather-styles/jsx';

import { TwoColumnLayout as Component } from './two-column.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Design System/Layout/TwoColumnLayout',
};

export default meta;

export function TwoColumnLayout() {
  return (
    <Component title={<>Hello world</>} content={<p>lorem ipsum </p>} action={<>some action</>}>
      <Box width="100%" height="600px" backgroundColor="lightModeRed.300" />
    </Component>
  );
}
