import type { Meta, StoryObj } from '@storybook/nextjs';
import { BtnAction } from '@/components/ui/button';

const meta: Meta<typeof BtnAction> = {
  title: 'components/ui/ButtonAction',
  component: BtnAction,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isActive: {
      control: 'boolean',
    },
    wording: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['submit', 'reset', 'button'],
    },
    color: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllAction: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Variants:</h3>
        <div className="flex gap-3 flex-wrap">
          <BtnAction
            isActive={true}
            wording="ยืนยัน"
            type="submit"
            color="#F26529"
            size={{ h: 40, w: 182 }}
          />
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    isActive: true,
    wording: 'Default',
    type: 'button',
  },
};
