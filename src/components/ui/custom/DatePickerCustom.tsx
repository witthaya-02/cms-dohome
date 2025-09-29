'use client';

import React, { useEffect, useMemo, useState } from 'react';
// import { ChevronDownIcon } from "lucide-react";
// import { CalendarIcon } from "lucide-react";

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
// import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '../input';

type Props = {
  emitUpdate: (date: string | undefined, time: string | undefined, language: string) => void;
  id: string;
  name: string;
  label: string;
  selected?: string;
  disable?: boolean;
  uiError?: boolean;
};
const DatePickerCustom: React.FC<Props> = ({
  emitUpdate,
  label,
  selected,
  id,
  name,
  disable,
  uiError,
}) => {
  const [open, setOpen] = useState(false);
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('00:00:00');

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(dateValue);
  useEffect(() => {
    if (selected) {
      const [date, time] = selected.split(' ');
      if (date) {
        setDateValue(new Date(date));
      }
      if (time) {
        setTime(time);
      }
    }
  }, [selected]);

  const labelDate = useMemo(() => {
    if (dateValue) {
      return selected;
    } else {
      return label;
    }
  }, [dateValue, selected, label]);

  const formatDate = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    return date.toISOString(); // ส่งออกในรูปแบบ 2025-06-05T17:00:00.000Z
  };
  // en-US | th-TH | en-GB
  const language = 'en-GB';
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            name={name}
            className={`
              w-full h-full justify-between font-normal text-[14px] 
              ${disable ? 'bg-[#EFEFEF]' : ''} 
              ${uiError ? 'border border-[#D62828]' : open ? 'border border-orange' : ''}
            `}
          >
            <div className={`${disable && 'text-[#B9B9B9]'}`}>{labelDate}</div>

            {/* <CalendarIcon className="size-3.5" /> */}
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M1 3.62196C1 2.76285 1.69645 2.06641 2.55556 2.06641H13.4444C14.3036 2.06641 15 2.76285 15 3.62196V13.7331C15 14.5922 14.3036 15.2886 13.4444 15.2886H2.55556C1.69645 15.2886 1 14.5922 1 13.7331V3.62196Z"
                  stroke="#4D4D4F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.5 6.17969H15"
                  stroke="#4D4D4F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.1113 1.28906V2.84462"
                  stroke="#4D4D4F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.88867 1.28906V2.84462"
                  stroke="#4D4D4F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          {!disable && (
            <div className="">
              <Calendar
                mode="single"
                // selected={dateValue}
                selected={date}
                captionLayout="dropdown"
                id={id}
                // name={name}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date: Date | undefined) => {
                  setDate(date);
                  emitUpdate(formatDate(date), time, language);
                  setDateValue(date);
                  // setOpen(false);
                }}
                disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')}
              />
              {date && (
                <div className="flex flex-col gap-3 p-[10px]">
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    onChange={(e) => {
                      setTime(e.target.value);
                      emitUpdate(formatDate(date), e.target.value, language);
                    }}
                    value={time}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DatePickerCustom };
