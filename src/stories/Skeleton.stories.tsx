import type { Meta, StoryObj } from '@storybook/nextjs';
import { Skeleton } from '@/components/ui/skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'components/ui/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    className: 'w-32 h-12',
  },
};
