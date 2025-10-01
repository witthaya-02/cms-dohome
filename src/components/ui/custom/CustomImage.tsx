'use client';

import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import emptyImage from '~/public/empty-product.svg';

type StringSrc = string;

interface CustomImageProps {
  /** แหล่งรูปหลัก (เช่น URL จาก backend) */
  src?: StringSrc | null;
  /** คำอธิบายรูปเพื่อ accessibility */
  alt?: string;
  /** รูปสำรองลำดับที่สอง (เช่น base CDN) */
  baseImage?: StringSrc | null;
  /** class ของ wrapper ถ้าใช้ fill หรือ class ของรูปถ้าไม่ใช้ fill */
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  /** โหลดรูปเร็วขึ้นสำหรับ above-the-fold */
  priority?: boolean;
  /** ใช้โหลดรูป external โดยไม่ต้อง whitelist domain ใน next.config */
  unoptimized?: boolean;
  /** ปรับแต่งรูป fallback เอง (รองรับ static import หรือ string) */
  fallbackSrc?: StaticImageData | StringSrc;
  /** คำอธิบายรูป fallback */
  fallbackAlt?: string;
  /** ปรับแต่งการแสดงผลรูป (cover/contain ฯลฯ) */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** ตั้งค่า decoding สำหรับประสิทธิภาพ */
  decoding?: 'auto' | 'async' | 'sync';
  /** ตั้งค่า loading เมื่อไม่ใช้ priority */
  loading?: 'eager' | 'lazy';
  style?: React.CSSProperties;
}

const isNonEmpty = (v?: string | null): v is string => typeof v === 'string' && v.trim() !== '';

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt = 'image',
  baseImage,
  className = '',
  fill = true,
  width = 300,
  height = 300,
  priority = false,
  unoptimized = false,
  fallbackSrc = emptyImage,
  fallbackAlt = 'empty-image',
  objectFit = 'contain',
  decoding = 'async',
  loading = 'lazy',
  style: customStyle,
}) => {
  /**
   * กำหนดลำดับรูปที่จะลองโหลด:
   * 1) src (ถ้ามี)
   * 2) baseImage (ถ้ามี)
   * 3) fallbackSrc (ปิดท้ายเสมอ)
   */
  const candidates = useMemo<(StaticImageData | StringSrc)[]>(() => {
    const list: (StaticImageData | StringSrc)[] = [];
    if (isNonEmpty(src)) list.push(src);
    if (isNonEmpty(baseImage)) list.push(baseImage);
    list.push(fallbackSrc);
    return list;
  }, [src, baseImage, fallbackSrc]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [src, baseImage, fallbackSrc]);

  const current = candidates[Math.min(idx, candidates.length - 1)];
  const isAtFallback = idx >= candidates.length - 1;

  const handleError = () => {
    // ไปตัวถัดไป ถ้าสุดลิสต์แล้วก็อยู่รูป fallback ต่อ
    setIdx((prev) => Math.min(prev + 1, candidates.length - 1));
  };

  // ถ้าใช้ fill ต้องมี wrapper ที่ position: relative และมีขนาด
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    fill ? (
      <div className={`relative w-full h-full ${className}`}>{children}</div>
    ) : (
      <>{children}</>
    );

  // เลือก props ของ <Image> ตามโหมด fill vs width/height
  const sizeProps = fill
    ? { fill: true as const }
    : {
        width: width ?? 300,
        height: height ?? 300,
      };

  // ปรับ style objectFit ให้ consistent
  const style: React.CSSProperties = { 
    objectFit: objectFit,
    ...customStyle,
  };

  /**
   * หมายเหตุ:
   * - ถ้า current เป็น string และไม่ได้ whitelist domain ใน next.config,
   *   ให้ส่ง `unoptimized` = true เพื่อหลีกเลี่ยง error และให้ Next ส่ง <img> ใต้ hood
   * - สำหรับรูป fallback ที่เป็น static import จะได้ประโยชน์จาก image optimization เต็มที่
   */
  const isStringCurrent = typeof current === 'string';

  return (
    <Wrapper>
      <Image
        src={current}
        alt={isAtFallback ? fallbackAlt : alt}
        {...sizeProps}
        priority={priority}
        unoptimized={isStringCurrent ? unoptimized : false}
        onError={handleError}
        className={fill ? '' : className}
        style={style}
        decoding={decoding}
        loading={priority ? undefined : loading}
      />
    </Wrapper>
  );
};

export default CustomImage;
