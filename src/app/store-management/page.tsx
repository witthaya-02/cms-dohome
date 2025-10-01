'use client';
import BtnAction from '@/components/ui/button';
import React, { useState, useRef } from 'react';

import { Popup } from '@/components/ui/dialog';
import { DatePickerCustom, DateRangePickerCustom } from '@/components/ui/custom/DatePickerCustom';
import TableCustom from '@/components/ui/custom/TableCustom';
import { DropdownMenuCustom } from '@/components/ui/custom/ComboboxCustom';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const StoreManagement = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const title = (title: string) => <div className="text-[28px] font-[700]">{title}</div>;

  const headerTableInit = [
    { display: 'ชื่อหน้า', id: 'name', sort: '', class: 'w-[110px]' },
    { display: 'วันเริ่ม', id: 'startDate', sort: 'default' },
    { display: 'วันสิ้นสุด', id: 'endDate', sort: 'default' },
    { display: 'แก้ไขล่าสุด', id: 'editDate', sort: 'default' },
    {
      display: 'สถานะเผยแพร่',
      id: 'status',
      sort: 'default',
      class: 'justify-center',
    },
    { display: 'Action', id: 'action', sort: '', class: 'justify-center' },
  ];
  const invoices = [
    {
      name: 'test-1',
      startDate: '15/04/25 00:00:00',
      endDate: '17/04/25 23:59:59',
      editDate: '01/03/25 14:23:44',
      editBy: 'Admin3',
      status: 'status',
      id: '1',
    },
    {
      name: 'test-2',
      startDate: '15/04/25 00:00:00',
      endDate: '17/04/25 23:59:59',
      editDate: '01/03/25 14:23:44',
      editBy: 'Admin3',
      status: 'status',
      id: '2',
    },
    {
      name: 'test-3',
      startDate: '15/04/25 00:00:00',
      endDate: '17/04/25 23:59:59',
      editDate: '01/03/25 14:23:44',
      editBy: 'Admin3',
      status: 'status',
      id: '3',
    },
    {
      name: 'test-4',
      startDate: '15/04/25 00:00:00',
      endDate: '17/04/25 23:59:59',
      editDate: '01/03/25 14:23:44',
      editBy: 'Admin3',
      status: 'status',
      id: '4',
    },
    {
      name: 'test-5',
      startDate: '15/04/25 00:00:00',
      endDate: '17/04/25 23:59:59',
      editDate: '01/03/25 14:23:44',
      editBy: 'Admin3',
      status: 'status',
      id: '5',
    },
    {
      name: 'test-6',
      startDate: '15/04/25 00:00:00',
      endDate: '17/04/25 23:59:59',
      editDate: '01/03/25 14:23:44',
      editBy: 'Admin3',
      status: 'status',
      id: '6',
    },
  ];

  const [time, setTime] = useState<string | undefined>();

  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: '',
  });

  enum ActionType {
    Create = 'create',
    Update = 'update',
    Duplicate = 'duplicate',
    Delete = 'delete',
    NoState = 'noSate',
  }

  const optionSort: { display: string; value: string }[] = [
    { display: 'ช่องทางออนไลน์', value: 'online' },
    { display: 'ช่องทางหน้าสาขา', value: 'offline' },
    { display: 'Chat & Shop', value: 'chat_and_shop' },
  ];

  const popupActionType = useRef<{ type: ActionType; id: string }>({
    type: ActionType.NoState,
    id: '',
  });

  const currentFilterChanel = useRef<string>('online');
  const currentFilterSearch = useRef<string>('');

  const handlePopup = ({
    isOpen,
    type,
    id,
  }: {
    isOpen: boolean;
    type?: ActionType;
    id?: string;
  }) => {
    if (isOpen && type) {
      popupActionType.current = { type, id: id ?? '' };
    } else {
      popupActionType.current = { type: ActionType.NoState, id: '' };
    }

    setIsOpenPopup(isOpen);
  };

  const getTitlePopup = (): string => {
    const title: Record<ActionType, string> = {
      [ActionType.Create]: 'สร้างหน้าใหม่',
      [ActionType.Update]: 'แก้ไขหน้า',
      [ActionType.Delete]: 'ยืนยันการลบ',
      [ActionType.Duplicate]: 'โคลนหน้าใหม่',
      [ActionType.NoState]: '',
    };
    return title[popupActionType.current.type];
  };

  const handleRenderPopup = () => {
    switch (popupActionType.current.type) {
      case ActionType.Delete:
        return (
          <div className="">
            <div className="">delete</div>
          </div>
        );
      case ActionType.Create:
      case ActionType.Update:
      case ActionType.Duplicate:
        return (
          <div className="">
            <div className="">test-from</div>
            <DatePickerCustom
              name={'test'}
              id={'test'}
              label={'วว/ดด/ปปปป'}
              uiError={undefined}
              selected={time}
              emitUpdate={(date, time, language) => {
                if (date) {
                  const stringDate = new Date(date).toLocaleDateString(language);
                  setTime(`${stringDate} ${time}`);
                  // field.onChange(stringDate);
                } else {
                  setTime(undefined);
                  // field.onChange(undefined);
                }
              }}
            />
          </div>
        );
      case ActionType.NoState:
      default:
        return null;
    }
  };

  return (
    <>
      <Switch checked={true} disabled={false} onCheckedChange={() => {}} />

      <Popup
        isOpen={isOpenPopup}
        title={{
          display: getTitlePopup(),
          center: true,
        }}
        closePopup={() => handlePopup({ isOpen: false })}
        loading={false}
      >
        <div className="pt-4 pb-6 mx-6">{handleRenderPopup()}</div>
      </Popup>

      <div className="p-[30px] grid gap-[30px] bg-[#EAEFF3]">
        {title('Default Homepage')}

        <TableCustom
          headerTableInit={headerTableInit}
          currentSort={(id, value) => {
            console.log('current-sort:', id, value);
          }}
          data={[invoices[0]]}
          slots={{
            name: (item) => <div>{item.name}</div>,
            editDate: (item) => (
              <div>
                {item.editDate} {'โดย'} {item.editDate}
              </div>
            ),
            startDate: (item) => <div>{item.startDate}</div>,
            endDate: (item) => <div>{item.editDate}</div>,
            status: (item) => <div className="text-center">{item.status}</div>,
            action: (item) => (
              <div
                onClick={() => {
                  console.log(item);
                }}
                className="flex gap-[10px] items-center justify-center"
              >
                <div className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M1 12L0.5 16.5L5 16L15.5858 5.41421C16.3668 4.63316 16.3668 3.36684 15.5858 2.58579L14.4142 1.41421C13.6332 0.633165 12.3668 0.633165 11.5858 1.41421L1 12Z"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 3L14 7"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 17H17"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M17 13V2C17 1.44771 16.5523 1 16 1H5"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L14 17C14.5523 17 15 16.5523 15 16L15 4C15 3.44772 14.5523 3 14 3L2 3C1.44772 3 1 3.44772 1 4L1 16C1 16.5523 1.44772 17 2 17Z"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7V13"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 10H11"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ),
          }}
        ></TableCustom>

        <div className="flex justify-between">
          {title('Custom Homepage')}
          <div className="">
            <BtnAction
              onClick={() => handlePopup({ isOpen: true, type: ActionType.Create })}
              isActive={true}
              wording="เพิ่มหน้าหลัก"
              type="button"
              size={{ h: 43, w: 145 }}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 0.787598V14.7876"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 7.7876L15 7.7876"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr_1fr] gap-5">
          <div className="flex flex-col gap-[8px] w-full">
            <div className="text-[12px] font-[400] text-[#343A40]">ชื่อหน้า</div>
            <Input
              type="text"
              placeholder="ค้นหาชื่อหน้า"
              // loading={loadingAll}
              value={currentFilterSearch.current}
              onChange={(e) => {
                currentFilterSearch.current = e.target.value;
              }}
            />
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <div className="text-[12px] font-[400] text-[#343A40]">ระยะเวลาที่เผยแพร่</div>
            <DateRangePickerCustom
              id="date-range"
              name="dateRange"
              selectedStart={filterDate.startDate}
              selectedEnd={filterDate.endDate}
              emitUpdate={(startDate, startTime, endDate, endTime) => {
                if (startDate && endDate) {
                  setFilterDate({
                    startDate: `${startDate} ${startTime}`,
                    endDate: `${endDate} ${endTime}`,
                  });
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <div className="text-[12px] font-[400] text-[#343A40]">สถานะเผยแพร่</div>
            <DropdownMenuCustom
              items={optionSort}
              currentValue={currentFilterChanel.current}
              uiError={false}
              emit={(value) => {
                if (value) {
                  currentFilterChanel.current = value.value ?? '';
                  console.log(value);
                }
              }}
            />
          </div>
        </div>

        <TableCustom
          headerTableInit={headerTableInit}
          currentSort={(id, value) => {
            console.log('current-sort:', id, value);
          }}
          data={invoices}
          slots={{
            name: (item) => <div>{item.name}</div>,
            editDate: (item) => (
              <div>
                {item.editDate} {'โดย'} {item.editDate}
              </div>
            ),
            startDate: (item) => <div>{item.startDate}</div>,
            endDate: (item) => <div>{item.editDate}</div>,
            status: (item) => <div className="text-center">{item.status}</div>,
            action: (item) => (
              <div className="flex gap-[10px] items-center justify-center">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    handlePopup({ isOpen: true, type: ActionType.Update, id: item.id })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M1 12L0.5 16.5L5 16L15.5858 5.41421C16.3668 4.63316 16.3668 3.36684 15.5858 2.58579L14.4142 1.41421C13.6332 0.633165 12.3668 0.633165 11.5858 1.41421L1 12Z"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 3L14 7"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 17H17"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    handlePopup({ isOpen: true, type: ActionType.Duplicate, id: item.id })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M17 13V2C17 1.44771 16.5523 1 16 1H5"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L14 17C14.5523 17 15 16.5523 15 16L15 4C15 3.44772 14.5523 3 14 3L2 3C1.44772 3 1 3.44772 1 4L1 16C1 16.5523 1.44772 17 2 17Z"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 7V13"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 10H11"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    handlePopup({ isOpen: true, type: ActionType.Delete, id: item.id })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                  >
                    <path
                      d="M4.57143 5V2.8C4.57143 2.32261 4.75204 1.86477 5.07353 1.52721C5.39502 1.18964 5.83106 1 6.28571 1H9.71429C10.1689 1 10.605 1.18964 10.9265 1.52721C11.248 1.86477 11.4286 2.32261 11.4286 2.8V5M15 5L14 17.2C14 17.6774 13.8194 18.1352 13.4979 18.4728C13.1764 18.8104 12.7404 19 12.2857 19H3.71429C3.25963 19 2.82359 18.8104 2.5021 18.4728C2.18061 18.1352 2 17.6774 2 17.2L1 5H15Z"
                      stroke="#343A40"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ),
          }}
        ></TableCustom>
      </div>
    </>
  );
};

export default StoreManagement;
