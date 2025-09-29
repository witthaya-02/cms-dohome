import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

type Props = {
  isActive: boolean;
  wording: string;
  type: 'submit' | 'reset' | 'button';
  size?: { h?: number; w?: number };
  color?: string;
  uiBorder?: boolean;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
};

const BtnAction: React.FC<Props> = ({
  isActive,
  wording,
  type,
  size,
  color,
  uiBorder,
  icon,
  onClick,
  className,
}) => {
  const styleOverride = isActive && color ? { backgroundColor: color } : {};

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) return;
    onClick?.(e);
  };
  return (
    <button
      type={type}
      disabled={!isActive}
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-[10px]',
        isActive
          ? `cursor-pointer ${
              uiBorder ? 'shadow-[0_0_0_1px_#F26529] text-[#f26529]' : 'bg-[#f26529] text-white'
            }`
          : `${
              uiBorder ? 'shadow-[0_0_0_1px_#B8B8B8] text-[#B8B8B8]' : 'bg-[#B8B8B8] text-[#FFFFFF]'
            }`,
        size?.w ? '' : 'w-full px-[18px]',
        size?.h ? '' : 'h-fit',
        className
      )}
      {...(size?.w || size?.h
        ? {
            style: {
              ...styleOverride,
              width: size?.w,
              height: size?.h,
            },
          }
        : {})}
    >
      {icon && icon}
      {wording}
    </button>
  );
};

export default BtnAction;
export { Button, buttonVariants, BtnAction };
