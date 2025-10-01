import { toast } from 'sonner';
import React from 'react';
import { useRouter } from 'next/navigation';
// import { useDeviceStore } from "@/store/deviceStore";

type Props = {
  title: string;
  text?: string;
  image?: React.ReactNode;
  isRoundedImg?: boolean;
  linkText?: string;
  linkUrl?: string;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
};

type NotSuccessProps = {
  title: string;
  text?: string;
};

export const alertIsSuccess = ({ title, text, image, linkText, linkUrl, position }: Props) => {
  const ToastContent = ({ t }: { t: string | number }) => {
    const router = useRouter();

    const handleLinkClick = () => {
      if (linkUrl) {
        router.push(linkUrl);
        toast.dismiss(t);
      }
    };

    return (
      <div
        className="p-4 bg-[#E9FFFB] w-full rounded shadow font-prompt cursor-pointer"
        onClick={() => toast.dismiss(t)}
      >
        <div className="flex gap-[36px] justify-between">
          <div className="flex">
            <div className="flex items-center gap-3 ">
              {image && image}
              <div className="flex justify-center flex-col">
                <div className="flex justify-between items-center">
                  <div className="font-[600] text-[14px] md:text-[16px] text-[#50C6B2]">
                    {title}
                  </div>
                </div>
                {text && (
                  <div className=" whitespace-nowrap text-[12px] md:text-[14px] text-[#343A40] font-[400]">
                    {text}
                  </div>
                )}
              </div>
            </div>
            {linkText && linkUrl && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleLinkClick();
                }}
                className="w-fit whitespace-nowrap text-[#50C6B2] underline cursor-pointer hover:text-[#3da598] text-[12px] md:text-[14px] font-[500]"
              >
                {linkText}
              </span>
            )}
          </div>

          <button className="self-start mt-0 md:mt-[-2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M12.8346 1.33594L1.16797 13.0026"
                stroke="#343A40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.16797 1.33594L12.8346 13.0026"
                stroke="#343A40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // const deviceInfo = useDeviceStore.getState().deviceInfo;
  toast.custom((t) => <ToastContent t={t} />, {
    position: position || 'top-right',
    // position: position || (deviceInfo?.isMobile ? "top-center" : "top-right"),
  });
};

let indexNotSuccessAlert = 1;
export const alertIsNotSuccess = ({ title, text }: NotSuccessProps) => {
  indexNotSuccessAlert++;
  toast.dismiss();
  toast.custom(
    (t) => (
      <div
        className="p-4 !w-fit bg-[#FADCD9] rounded shadow font-prompt cursor-pointer"
        onClick={() => toast.dismiss(t)}
      >
        <div className="flex justify-between">
          <div className="flex items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M9.18296 3H15.817C16.0823 3 16.3366 3.10536 16.5241 3.29289L21.2071 7.97585C21.3946 8.16339 21.5 8.41774 21.5 8.68296V15.317C21.5 15.5823 21.3946 15.8366 21.2071 16.0241L16.5241 20.7071C16.3366 20.8946 16.0823 21 15.817 21H9.18296C8.91774 21 8.66339 20.8946 8.47585 20.7071L3.79289 16.0241C3.60536 15.8366 3.5 15.5822 3.5 15.317V8.68296C3.5 8.41775 3.60536 8.16339 3.79289 7.97586L8.47586 3.29289C8.66339 3.10536 8.91775 3 9.18296 3Z"
                  fill="#E8523F"
                />
                <path
                  d="M13.5 16C13.5 16.5523 13.0523 17 12.5 17C11.9477 17 11.5 16.5523 11.5 16C11.5 15.4477 11.9477 15 12.5 15C13.0523 15 13.5 15.4477 13.5 16Z"
                  fill="white"
                />
                <path
                  d="M12.5 13L12.5 8"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="px-[14px]">
              <div className="font-[600] text-[14px] md:text-[16px] text-[#E8523F] whitespace-nowrap">
                {title}
              </div>
              {text && (
                <div className="text-[12px] md:text-[14px] text-[#343A40] font-[400]">{text}</div>
              )}
            </div>
          </div>
          <button className="self-start mt-0 md:mt-[-2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
            >
              <path
                d="M12.3337 1.33398L0.666992 13.0007"
                stroke="#E8523F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0.666992 1.33398L12.3337 13.0007"
                stroke="#E8523F"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    {
      id: indexNotSuccessAlert ? `alertNotSuccess-${indexNotSuccessAlert}` : 'alertNotSuccess',
      position: 'top-center', // <== ตั้งค่าตำแหน่งตรงนี้
      duration: 1500,
    }
  );
};
