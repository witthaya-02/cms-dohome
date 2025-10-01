'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '../input';
import { DateRange } from 'react-day-picker';

// Single Date Picker Props
type DatePickerProps = {
  // eslint-disable-next-line no-unused-vars
  emitUpdate: (date: string | undefined, time: string | undefined, language: string) => void;
  id: string;
  name: string;
  label: string;
  selected?: string;
  disable?: boolean;
  uiError?: boolean;
};

// Date Range Picker Props
type DateRangePickerProps = {
  emitUpdate: (
    // eslint-disable-next-line no-unused-vars
    startDate: string | undefined,
    // eslint-disable-next-line no-unused-vars
    startTime: string | undefined,
    // eslint-disable-next-line no-unused-vars
    endDate: string | undefined,
    // eslint-disable-next-line no-unused-vars
    endTime: string | undefined,
    // eslint-disable-next-line no-unused-vars
    language: string
  ) => void;
  id: string;
  name: string;
  selectedStart?: string;
  selectedEnd?: string;
  disable?: boolean;
  uiError?: boolean;
  className?: string;
};

// Single Date Picker Component
const DatePickerCustom: React.FC<DatePickerProps> = ({
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
        setDate(new Date(date));
      }
      if (time) {
        setTime(time);
      }
    }
  }, [selected]);

  const formatDisplayDate = (date: Date | undefined, time: string): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year} ${time}`;
  };

  const labelDate = useMemo(() => {
    if (dateValue) {
      return formatDisplayDate(dateValue, time);
    } else {
      return label;
    }
  }, [dateValue, time, label]);

  const formatDate = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    return date.toISOString();
  };

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
            <div>
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                id={id}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date: Date | undefined) => {
                  setDate(date);
                  emitUpdate(formatDate(date), time, language);
                  setDateValue(date);
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

// Date Range Picker Component
const DateRangePickerCustom: React.FC<DateRangePickerProps> = ({
  emitUpdate,
  selectedStart,
  selectedEnd,
  id,
  name,
  disable,
  uiError,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('00:00:00');
  const [endTime, setEndTime] = useState<string>('23:59:59');
  const [month, setMonth] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (selectedStart || selectedEnd) {
      const range: DateRange = {
        from: undefined,
      };

      if (selectedStart) {
        const [date, time] = selectedStart.split(' ');
        if (date) {
          range.from = new Date(date);
        }
        if (time) {
          setStartTime(time);
        }
      }

      if (selectedEnd) {
        const [date, time] = selectedEnd.split(' ');
        if (date) {
          range.to = new Date(date);
        }
        if (time) {
          setEndTime(time);
        }
      }

      setDateRange(range);
    }
  }, [selectedStart, selectedEnd]);

  const formatDisplayDate = (date: Date | undefined, time: string): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${time}`;
  };

  const labelDate = useMemo(() => {
    if (dateRange?.from) {
      if (dateRange.to) {
        const fromStr = formatDisplayDate(dateRange.from, startTime);
        const toStr = formatDisplayDate(dateRange.to, endTime);
        return { from: fromStr, to: toStr };
      }
      return { from: formatDisplayDate(dateRange.from, startTime), to: '' };
    }
    return { from: '', to: '' };
  }, [dateRange, startTime, endTime]);

  const formatDate = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    return date.toISOString();
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    emitUpdate(formatDate(range?.from), startTime, formatDate(range?.to), endTime, 'en-GB');
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    emitUpdate(formatDate(dateRange?.from), time, formatDate(dateRange?.to), endTime, 'en-GB');
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    emitUpdate(formatDate(dateRange?.from), startTime, formatDate(dateRange?.to), time, 'en-GB');
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="grid grid-cols-[1fr_10px_1fr] gap-[10px] items-center">
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
              <div className={`${disable && 'text-[#B9B9B9]'}`}>
                {labelDate.from && labelDate.from !== '' ? labelDate.from : 'เลือกวันเริ่ม'}
              </div>
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
            {'-'}
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
              <div className={`${disable && 'text-[#B9B9B9]'}`}>
                {labelDate.to && labelDate.to !== '' ? labelDate.to : 'เลือกวันสิ้นสุด'}
              </div>
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
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[525px] overflow-hidden p-0 flex justify-center "
          align="start"
        >
          {!disable && (
            <div>
              <Calendar
                mode="range"
                selected={dateRange}
                captionLayout="dropdown"
                id={id}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleRangeSelect}
                disabled={(date: Date) => date > new Date() || date < new Date('1900-01-01')}
                numberOfMonths={2}
              />

              {dateRange?.from && dateRange?.to && (
                <div className="flex flex-col gap-3 p-[10px] border-t">
                  <div className="flex gap-2 items-center">
                    <label className="text-xs font-medium w-16">วันเริ่ม:</label>
                    <Input
                      type="time"
                      id="start-time-picker"
                      step="1"
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      value={startTime}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="text-xs font-medium w-16">วันสิ้นสุด:</label>
                    <Input
                      type="time"
                      id="end-time-picker"
                      step="1"
                      onChange={(e) => handleEndTimeChange(e.target.value)}
                      value={endTime}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DatePickerCustom, DateRangePickerCustom };
