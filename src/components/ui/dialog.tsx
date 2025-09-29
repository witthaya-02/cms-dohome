'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
// import { XIcon } from "lucide-react"

import { cn } from '@/lib/utils';

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      {/* <DialogOverlay /> */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* กล่องกลาง (บังคลิก) */}
        <div
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 pointer-events-auto"
          // onClick={() => console.log("blocked area clicked")}
        />
      </div>
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200',
          className
        )}
        {...props}
      >
        <DialogPrimitive.Description className="sr-only"></DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}
import Image from 'next/image';
import Loading from './custom/Loading';
// import { useCookieConsentStore } from "@/store/cookieConsentStore";

type DialogDemoProps = {
  isOpen: boolean;
  children: React.ReactNode;
  title?: {
    display: string | React.ReactNode;
    center?: boolean;
    width?: number;
    color?: string;
  };
  back?: { hide: boolean; func: () => void };
  closePopup?: () => void;
  loading?: boolean;
  className?: string;
  titleClass?: string;
};

const Popup: React.FC<DialogDemoProps> = ({
  isOpen,
  children,
  title,
  back,
  closePopup,
  loading,
  className,
  titleClass,
}) => {
  const handleWidthMax = React.useMemo(
    () => (title?.width ? `sm:max-w-[780px]` : 'sm:max-w-[425px]'),
    [title?.width]
  );
  const titleColor = title?.color ? title?.color : 'text-primary-hover';

  // const { showPopupAlertCookie, height } = useCookieConsentStore();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} modal={false}>
      {/* sm:max-w-[425px] */}
      <DialogContent
        // className={`${
        //   showPopupAlertCookie
        //     ? "md:max-h-[70vh] md:translate-y-[-65%] lg:translate-y-[-50%]"
        //     : "md:max-h-screen"
        // } w-full h-full max-h-screen pb-[200px] md:pb-0 flex flex-col overflow-y-scroll ${handleWidthMax} sm:h-auto mx-auto z-50 overflow-auto ${
        //   className || ""
        // }`}
        className={`md:max-h-screen w-full h-full max-h-screen pb-[200px] md:pb-0 flex flex-col overflow-y-scroll ${handleWidthMax} sm:h-auto mx-auto z-50 overflow-auto ${
          className || ''
        }`}
      >
        <DialogTitle className="sr-only"></DialogTitle> {/* hidden */}
        <div
          className={`sticky top-0 z-100 bg-white pt-6 pb-6 px-6 md:static flex justify-between h-fit md:pb-0 ${
            className || ''
          }`}
        >
          {!back?.hide && back?.func ? (
            <Image
              src="/icons/ic-back-popup.svg"
              alt="ic-close-popup"
              width={24}
              height={24}
              className="object-contain cursor-pointer"
              onClick={back.func}
            />
          ) : (
            <div className={`${title?.center && title.center}`}>{/* space space */}</div>
          )}

          {title && (
            <div
              className={`text-[18px] font-[500] ${titleColor} h-fit w-full ${
                title.center && title.center === true && 'text-center'
              } ${titleClass}`}
            >
              {title.display}
            </div>
          )}
          {closePopup ? (
            <Image
              src="/icons/ic-close-popup.svg"
              alt="ic-close-popup"
              width={24}
              height={24}
              className="object-contain cursor-pointer"
              onClick={closePopup}
            />
          ) : (
            <div className="w-[15px]">{/* space space */}</div>
          )}
        </div>
        <>
          {children}
          {/* {showPopupAlertCookie && (
            <div
              style={{ minHeight: `${height}px` }}
              className="block md:hidden"
            ></div>
          )} */}
          {loading && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[999] flex items-center justify-center pointer-events-auto">
              <Loading />
            </div>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Popup,
};
