import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'components/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Variants:</h3>
        <div className="flex gap-3 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Sizes:</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🔔</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">States:</h3>
        <div className="flex gap-3 flex-wrap">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};
