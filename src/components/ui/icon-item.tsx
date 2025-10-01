'use client';

import React from 'react';
import CustomImage from '@/components/ui/custom/CustomImage';
import { IconName } from '@/lib/icons';

interface IconItemProps {
  /** ชื่อ icon จาก Icons enum */
  name: IconName;
  /** คำอธิบายรูปเพื่อ accessibility */
  alt?: string;
  /** ขนาดของ icon (ใช้ทั้ง width และ height) */
  size?: number;
  /** class สำหรับปรับแต่งเพิ่มเติม */
  className?: string;
  color?: string;
}

const IconItem: React.FC<IconItemProps> = ({
  name,
  alt,
  size = 24,
  className = '',
  color,
}) => {
  const iconPath = `/${name}.svg`;
  
  return (
    <CustomImage
      src={iconPath}
      alt={alt || `${name.split('/').pop()?.replace('ic-', '') || 'icon'}`}
      fill={false}
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      unoptimized
      fallbackSrc=""
      fallbackAlt="icon placeholder"
      objectFit="contain"
    />
  );
};

export default IconItem;