import type { Meta, StoryObj } from '@storybook/nextjs';
import IconItem from '@/components/ui/icon-item';
import { Icons, iconNames } from '@/lib/icons';

const meta: Meta<typeof IconItem> = {
  title: 'components/IconItem',
  component: IconItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Icon component สำหรับแสดง SVG icons จาก public folder',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: 'ชื่อ icon จาก Icons enum',
    },
    size: {
      control: { type: 'number', min: 16, max: 128, step: 8 },
      description: 'ขนาดของ icon',
    },
    alt: {
      control: 'text',
      description: 'คำอธิบายรูปเพื่อ accessibility',
    },
    className: {
      control: 'text',
      description: 'CSS class เพิ่มเติม',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Icon Gallery - แสดง icons ทั้งหมด
export const IconGallery: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Icon Gallery</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {iconNames.map((iconName) => (
          <div
            key={iconName}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IconItem name={iconName} size={32} />
            <span className="text-xs text-center text-gray-600 break-all">
              {iconName.split('/').pop()?.replace('ic-', '').replace(/-/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">All Icons:</h3>
        <div className="flex gap-4 flex-wrap items-center">
          {iconNames.map((iconName) => (
            <div key={iconName} className="flex flex-col items-center gap-2">
              <IconItem name={iconName} className="bg-gray-200" />
              <span className="text-xs text-gray-600">
                {iconName.split('/').pop()?.replace('ic-', '').replace(/-/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Sizes:</h3>
        <div className="flex gap-4 items-center flex-wrap">
          {[16, 24, 32, 48, 64].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <IconItem name={iconNames[0]} size={size} />
              <span className="text-xs text-gray-600">{size}px</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">With Custom Styles:</h3>
        <div className="flex gap-4 flex-wrap items-center">
          <IconItem name={iconNames[0]} size={32} className="opacity-50" />
          <IconItem name={iconNames[0]} size={32} className="hover:opacity-80 cursor-pointer" />
          <IconItem name={iconNames[0]} size={32} className="rounded-full bg-gray-100 p-2" />
          <IconItem name={iconNames[0]} size={32} className="bg-blue-100 p-2 rounded" />
          <IconItem name={iconNames[0]} size={32} className="bg-green-100 p-2 rounded" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Interactive Examples:</h3>
        <div className="flex gap-4 flex-wrap items-center">
          {iconNames.slice(0, 3).map((iconName) => (
            <IconItem
              key={iconName}
              name={iconName}
              size={32}
              className="hover:scale-110 transition-transform cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    name: iconNames[0],
    size: 24,
    alt: 'icon',
  },
};

export const Small: Story = {
  args: {
    name: iconNames[0],
    size: 16,
  },
};

export const Medium: Story = {
  args: {
    name: iconNames[1],
    size: 32,
  },
};

export const Large: Story = {
  args: {
    name: iconNames[2],
    size: 48,
  },
};

export const WithCustomClass: Story = {
  args: {
    name: iconNames[0],
    size: 32,
    className: 'hover:rotate-90 transition-transform cursor-pointer',
  },
};
