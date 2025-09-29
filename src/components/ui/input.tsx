import * as React from 'react';

import { cn } from '@/lib/utils';
import cleanInputIcon from '~/public/icons/ic-clean-input.svg';
import eyeOpenIcon from '~/public/icons/ic-eye-open.svg';
import eyeCloseIcon from '~/public/icons/ic-eye-close.svg';
import Image from 'next/image';
import { Skeleton } from './skeleton';
import '@/app/customStyle.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  loading?: boolean;
};

function Input({ className, type, value, loading, onFocus, onBlur, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = (type === 'password' && showPassword) || type === 'numberOnly' ? 'text' : type;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="relative w-full">
      <style jsx>{`
        input[type='password']::-ms-reveal,
        input[type='password']::-ms-clear {
          display: none;
        }
      `}</style>

      {loading ? (
        <Skeleton className="w-full h-[40px]" />
      ) : (
        <input
          type={inputType}
          data-slot="input"
          autoComplete="off" // history suggestion of browser
          autoCorrect="off"
          // autoCapitalize="off"
          // spellCheck={false}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            if (type === 'numberOnly') {
              input.value = input.value.replace(/[^0-9]/g, '');
            }
            if (props.name === 'taxId') {
              input.value = input.value.toUpperCase();
              // ตัดภาษาไทยออก
              input.value = input.value.replace(/[\u0E00-\u0E7F]/g, '');
              // ตัดทุกอย่างที่ไม่ใช่ a-z, A-Z, 0-9
              input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
            }

            if (type === 'password') {
              // ตัดภาษาไทยออก
              input.value = input.value.replace(/[\u0E00-\u0E7F]/g, '');
            }
          }}
          onKeyDown={(e) => {
            // console.log(type, props.name)
            const blockKeys = [' ', 'Tab']; // keys ที่ไม่อนุญาต ให้เว้นวรรค
            if (
              (type === 'email' || type === 'password' || props.name === 'taxId') &&
              blockKeys.includes(e.key)
            ) {
              e.preventDefault();
            }

            if (type === 'password' || props.name === 'taxId') {
              // block ภาษาไทย
              if (/[\u0E00-\u0E7F]/.test(e.key)) {
                e.preventDefault();
              }
            }
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData('text');
            if (type === 'email' || type === 'password' || props.name === 'taxId') {
              if (/\s/.test(pastedText)) {
                e.preventDefault();
              }
            }
            if (props.name === 'taxId') {
              // block ภาษาไทย
              if (/[\u0E00-\u0E7F]/.test(pastedText)) {
                e.preventDefault();
              }
              // block ทุกอย่างที่ไม่ใช่ a-z, A-Z, 0-9
              if (/[^a-zA-Z0-9]/.test(pastedText)) {
                e.preventDefault();
              }
            }

            if (type === 'password') {
              // block ภาษาไทย
              if (/[\u0E00-\u0E7F]/.test(pastedText)) {
                e.preventDefault();
              }
            }
          }}
          inputMode={type === 'numberOnly' ? 'numeric' : undefined}
          pattern={type === 'numberOnly' ? '[0-9]*' : undefined}
          {...props}
          className={cn(
            props.disabled &&
              'disabled:bg-[#EFEFEF] disabled:text-gray-400 disabled:border-[0.5px] disabled:border-[#D6D6D7]',
            'text-[20px] text-[#343A40]',
            'placeholder:text-[#B9B9B9]',
            'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            'file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30  flex h-full w-full min-w-0 rounded-md border border-[#E0E0E3] bg-transparent px-[12px] py-[9px] text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm',
            'focus-visible:border-orange focus-visible:ring-orange/50 focus-visible:ring-[1px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            'shadow-none',
            className
          )}
        />
      )}

      {!props.disabled && value !== '' && type !== 'password' && isFocused && (
        <Image
          onMouseDown={(e) => {
            e.preventDefault(); // ป้องกัน blur
            props.onChange?.({
              target: { value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          src={cleanInputIcon}
          alt="ic-clean-input"
          width={14}
          height={14}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
        />
      )}
      {!props.disabled && value && type === 'password' && (
        <Image
          src={showPassword ? eyeOpenIcon : eyeCloseIcon}
          alt="toggle password visibility"
          width={16}
          height={16}
          onClick={togglePassword}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
        />
      )}
    </div>
  );
}

export { Input };
