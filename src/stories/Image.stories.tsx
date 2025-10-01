// src/stories/CustomImage.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import CustomImage from '@/components/ui/custom/CustomImage'; // <-- ปรับ path ตามจริง
import emptyImage from '~/public/empty-product.svg';

const meta: Meta<typeof CustomImage> = {
  title: 'components/ui/CustomImage',
  component: CustomImage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'แหล่งรูปหลัก (URL หรือปล่อยว่างให้ลอง baseImage)',
    },
    baseImage: {
      control: 'text',
      description: 'รูปสำรองลำดับที่สอง (เช่น base CDN)',
    },
    alt: { control: 'text' },
    className: { control: 'text' },
    fill: {
      control: 'boolean',
      description: 'ใช้โหมด fill (ต้องมี wrapper ที่ relative)',
    },
    width: { control: 'number' },
    height: { control: 'number' },
    priority: { control: 'boolean' },
    unoptimized: {
      control: 'boolean',
      description: 'ถ้าใช้ external URL ที่ไม่ whitelist domain แนะนำให้เปิด true',
    },
    fallbackAlt: { control: 'text' },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    decoding: {
      control: 'select',
      options: ['auto', 'async', 'sync'],
    },
    loading: {
      control: 'select',
      options: ['eager', 'lazy'],
    },
  },
  args: {
    alt: 'demo-image',
    width: 220,
    height: 140,
    fill: false,
    unoptimized: true, // ปลอดภัยใน Storybook เวลาใช้ external URL
    objectFit: 'contain',
    fallbackSrc: emptyImage,
    fallbackAlt: 'empty-image',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Basic cases:</h3>
        <div className="grid grid-cols-3 gap-16 items-start">
          {/* 1) โหลดสำเร็จจาก src */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-medium">Valid src</div>
            <CustomImage
              {...args}
              src="https://picsum.photos/id/1003/600/400"
              baseImage=""
              className="rounded-xl border"
            />
          </div>

          {/* 2) src พัง → ใช้ baseImage */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-medium">Broken src → baseImage</div>
            <CustomImage
              {...args}
              src="https://example.com/does-not-exist.jpg"
              baseImage="https://picsum.photos/id/1015/600/400"
              className="rounded-xl border"
            />
          </div>

          {/* 3) src + baseImage พัง → fallback */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm font-medium">Broken both → fallback</div>
            <CustomImage
              {...args}
              src="https://example.com/does-not-exist.jpg"
              baseImage="https://example.com/also-missing.jpg"
              className="rounded-xl border bg-[#F8F9FA]"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">objectFit:</h3>
        <div className="grid grid-cols-4 gap-10">
          {(['contain', 'cover', 'fill', 'scale-down'] as const).map((fit) => (
            <div key={fit} className="flex flex-col items-center gap-2">
              <div className="text-sm font-medium">{fit}</div>
              <div className="w-[220px] h-[140px] border rounded-xl overflow-hidden">
                <CustomImage
                  {...args}
                  src="https://picsum.photos/id/1025/900/600"
                  baseImage=""
                  objectFit={fit}
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const FillMode: Story = {
  render: (args) => {
    // 🔧 สร้าง args ใหม่สำหรับ fill mode (ไม่มี width/height)
    const { width, height, ...fillArgs } = args;

    return (
      <div className="p-8">
        <h3 className="text-lg font-semibold mb-3">Fill layout (no CLS)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ควรห่อด้วย container ที่ <code>relative</code> และกำหนดขนาดชัดเจน (เช่น fixed height หรือ
          aspect-ratio)
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm font-medium mb-2">Contain (card)</div>
            <div className="w-[360px] h-[220px] rounded-2xl border overflow-hidden shadow-sm">
              <CustomImage
                {...fillArgs}
                fill
                src="https://picsum.photos/id/1015/600/400"
                baseImage=""
                objectFit="contain"
                className="rounded-2xl"
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Cover (hero)</div>
            <div className="relative w-[360px] h-[220px] rounded-2xl border overflow-hidden shadow-sm">
              <CustomImage
                {...fillArgs}
                fill
                src="https://picsum.photos/id/1018/1200/800"
                baseImage=""
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    src: 'https://picsum.photos/id/1020/800/600',
    baseImage: '',
    alt: 'Playground image',
    width: 260,
    height: 160,
    fill: false,
    priority: false,
    unoptimized: true,
    objectFit: 'contain',
    decoding: 'async',
    loading: 'lazy',
    className: 'rounded-xl border',
  },
};
