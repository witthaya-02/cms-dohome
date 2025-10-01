import { Switch } from '@/components/ui/switch';
import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

const meta: Meta<typeof Switch> = {
  title: 'Components/ui/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    onCheckedChange: { action: 'checkedChange' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Playground: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [checked, setChecked] = React.useState(args.defaultChecked ?? false);
    return (
      <div className="flex items-center gap-2">
        <Switch {...args} defaultChecked={checked} onCheckedChange={setChecked} />
        <span>{checked ? 'On' : 'Off'}</span>
      </div>
    );
  },
  args: {
    defaultChecked: false,
  },
};
