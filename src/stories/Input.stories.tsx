import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'components/ui/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
      ],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8 w-96">
      <div>
        <h3 className="text-lg font-semibold mb-3">Input Types:</h3>
        <div className="flex flex-col gap-3">
          <Input type="text" placeholder="Text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input type="number" placeholder="Number input" />
          <Input type="tel" placeholder="Phone input" />
          <Input type="url" placeholder="URL input" />
          <Input type="search" placeholder="Search input" />
          <Input type="date" />
          <Input type="time" />
          <Input type="datetime-local" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">States:</h3>
        <div className="flex flex-col gap-3">
          <Input placeholder="Default" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="Read only" readOnly value="Read only text" />
          <Input placeholder="With value" defaultValue="Hello World" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Validation States:</h3>
        <div className="flex flex-col gap-3">
          <Input placeholder="Valid input" />
          <Input placeholder="Invalid input" aria-invalid="true" />
          <Input placeholder="Required field" required />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">File Input:</h3>
        <div className="flex flex-col gap-3">
          <Input type="file" />
          <Input type="file" accept="image/*" />
          <Input type="file" multiple />
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
    disabled: false,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" type="email" placeholder="example@email.com" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input className="h-8 text-sm" placeholder="Small input" />
      <Input placeholder="Default input" />
      <Input className="h-12 text-base" placeholder="Large input" />
    </div>
  ),
};
