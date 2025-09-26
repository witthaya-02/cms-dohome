"use client";
import BtnAction from "@/components/ui/button";
import React, { useState } from "react";

import { Popup } from "@/components/ui/dialog";
import { DatePickerCustom } from "@/components/ui/custom/DatePickerCustom";
import TableCustom from "@/components/ui/custom/TableCustom";

const StoreManagement = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const title = (title: string) => (
    <div className="text-[28px] font-[700]">{title}</div>
  );

  const headerTableInit = [
    { display: "ชื่อหน้า", id: "invoice", sort: "", class:"w-[50px]" },
    { display: "วันเริ่ม", id: "paymentStatus", sort: "default" },
    { display: "วันสิ้นสุด", id: "totalAmount", sort: "default"},
    { display: "แก้ไขล่าสุด", id: "paymentMethod", sort: "default" },
    { display: "สถานะเผยแพร่", id: "details", sort: "default",class:"justify-center" },
    { display: "Action", id: "action", sort: "" }, 
  ];
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
      details: { name: "test", no: "000" },
      items: [],
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  const [time, setTime] = useState<string | undefined>();

  return (
    <>
      <Popup
        isOpen={isOpenPopup}
        title={{
          display: "Tracking Package",
          center: true,
        }}
        closePopup={() => setIsOpenPopup(false)}
        loading={false}
      >
        <div className="pt-4 pb-6 mx-6">
          <DatePickerCustom
            name={"test"}
            id={"test"}
            label={"วว/ดด/ปปปป"}
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
      </Popup>

      <div className="p-[30px] grid gap-[30px] bg-[#EAEFF3]">
        {title("Default Homepage")}

        <TableCustom
          headerTableInit={headerTableInit}
          currentSort={(id, value) => {
            console.log("current-sort:", id, value);
          }}
          data={invoices}
          slots={{
            invoice: (item) => <div>{item.invoice}</div>,
            paymentStatus: (item) => <div>{item.paymentStatus}</div>,
            totalAmount: (item) => (
              <div className="text-right">{item.totalAmount}</div>
            ),
            paymentMethod: (item) => <div className="text-center">{item.paymentMethod}</div>,
            details: (item) => (
              <div>
                {item.details?.name}:{item.details?.no}
              </div>
            ),
          }}
        ></TableCustom>

        <div className="flex justify-between">
          {title("Custom Homepage")}
          <div className="">
            <BtnAction
              onClick={() => setIsOpenPopup(true)}
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
      </div>
    </>
  );
};

export default StoreManagement;
