"use client";

import * as React from "react";
// import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  // CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Image from "next/image";
import cleanInputIcon from "~/public/icons/ic-clean-input.svg";

// import { useMaster } from "@/hooks/api/useMaster";
import { StringOptional } from "@/lib/api/types/common-types";
// import { Input } from "../input";
// import { AddressType } from "@/enums/enums";


type ItemOption = { display: StringOptional; value: StringOptional };
type PropsDropdownMenuCustom = {
  items?: ItemOption[];
  currentValue: string | undefined;
  disable?: boolean;
  loading?: boolean;
  uiError?: boolean;
  // eslint-disable-next-line no-unused-vars
  emit: (value: ItemOption) => void;
  remove?: () => void;
  label?:string;
  class?:string;
};
const DropdownMenuCustom: React.FC<PropsDropdownMenuCustom> = ({
  ...Props
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelectEmit = (value: ItemOption) => {
    if (Props.emit) {
      Props.emit(value);
    }
  };

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current?.offsetWidth]);

  return (
    <Popover
      modal={true}
      open={open}
      onOpenChange={(nextOpen) => {
        if (!Props.disable) {
          setOpen(nextOpen);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className={cn(
            "relative w-full flex gap-[10px] border px-[12px] py-[10px] items-center rounded-[7px] text-[12px]",
            Props.disable ? "bg-[#EFEFEF]" : "bg-white",
            Props.uiError
              ? "border-[#D62828]"
              : open
              ? " border-orange"
              : "border-[#D6D6D7]",
              Props.class
          )}
        >
          {Props.currentValue ? (
            <div>
              {(Props.items ?? []).find(
                (value) => Props.currentValue === value.value
              )?.display ?? Props.currentValue}
            </div>
          ) : (
            <div className="text-[#B9B9B9]"> {Props.label ? Props.label : "กรุณาเลือก"} </div>
          )}
          {!Props.disable && Props.currentValue && Props.remove ? (
            <Image
              src={cleanInputIcon}
              alt="ic-clean-input"
              width={14}
              height={14}
              onClick={() => {
                if (Props.remove) Props.remove();
              }}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer"
            />
          ) : (
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="7"
                viewBox="0 0 11 7"
                fill="none"
              >
                <path
                  d="M10.5 0.789062L5.5 5.78906L0.5 0.789062"
                  stroke="#343A40"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`${!width && "w-full"} max-h-[300px] overflow-y-auto p-0`}
        style={width ? { width: `${width}px` } : undefined}
      >
        <Command>
          <CommandList>
            {Props.loading ? (
              <CommandEmpty>loading...</CommandEmpty>
            ) : (Props.items ?? []).length === 0 ? (
              <CommandEmpty>ไม่พบ</CommandEmpty>
            ) : (
              <CommandGroup>
                {(Props.items ?? []).map((item) => {
                  return (
                    <CommandItem
                      className="text-[12px]"
                      key={item.value}
                      value={item.value ?? ""}
                      onSelect={(currentValue) => {
                        if (currentValue) {
                          const findOption = Props.items?.find(
                            (option) => option.value === currentValue
                          );
                          if (findOption) {
                            handleSelectEmit(findOption);
                            setOpen(false);
                          }
                        }
                      }}
                    >
                      <div
                        className={`${
                          item.value === Props.currentValue && "text-orange"
                        } px-[5px] py-[5px]`}
                      >
                        {item.display}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { DropdownMenuCustom };
