import { DatePickerCustom, DateRangePickerCustom } from '@/components/ui/custom/DatePickerCustom';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<typeof DatePickerCustom> = {
  title: 'Components/ui/DatePicker',
  parameters: {
    layout: 'fullscreen', // ให้เต็มจอ จะได้ control positioning เอง
  },
  component: DatePickerCustom,
  decorators: [
    (Story) => (
      <div className="flex justify-center items-start min-h-screen pt-20">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disable: {
      control: 'boolean',
    },
    uiError: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof DatePickerCustom>;

// ---------- Single Date Picker ----------
const SingleDateWrapper = () => {
  const [time, setTime] = useState<string | undefined>(undefined);

  return (
    <DatePickerCustom
      name="test"
      id="test"
      label="วว/ดด/ปปปป"
      selected={time}
      emitUpdate={(date, timeValue, language) => {
        if (date) {
          const stringDate = new Date(date).toLocaleDateString(language);
          setTime(`${stringDate} ${timeValue}`);
        } else {
          setTime(undefined);
        }
      }}
    />
  );
};

export const SingleDatePicker: Story = {
  render: () => <SingleDateWrapper />,
};

// ---------- Date Range Picker ----------
const RangeDateWrapper = () => {
  const [filterDate, setFilterDate] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  return (
    <DateRangePickerCustom
      id="date-range"
      name="dateRange"
      selectedStart={filterDate.startDate}
      selectedEnd={filterDate.endDate}
      emitUpdate={(startDate, startTime, endDate, endTime, language) => {
        if (startDate && endDate) {
          setFilterDate({
            startDate: `${startDate} ${startTime}`,
            endDate: `${endDate} ${endTime}`,
          });
          console.log(language);
        }
      }}
    />
  );
};

export const RangeDatePicker: Story = {
  args: {
    disable: true,
  },

  render: () => <RangeDateWrapper />,
};
