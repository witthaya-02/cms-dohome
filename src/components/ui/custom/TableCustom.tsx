import React, { ReactNode, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import clsx from 'clsx';

export type HeaderCol = {
  id: string;
  sort: "" | "default" | "desc" | "asc" | string;
  class?: string;
  display: string;
};

type TableCustomProps<T> = {
  headerTableInit: HeaderCol[];
  currentSort: (id: string, value: string) => void;
  children?: ReactNode; // Footer slot
  data?: T[]; // Data array
  // slots?: { [columnId: string]: (item: T) => ReactNode }; // Column slot
  slots?: Partial<Record<keyof T | string, (item: T) => ReactNode>>; 
  // slots?: Partial<Record<HeaderCol["id"], (item: T) => ReactNode>>;
};

function TableCustom<T>({
  headerTableInit,
  currentSort,
  data,
  slots,
  children,
}: TableCustomProps<T>) {
  const [headerTable, setHeaderTable] = useState<HeaderCol[]>(headerTableInit);

  const toggleSort = (id: string, value?:string) => {
    setHeaderTable((prev) => {
      const updated = prev.map((col) => {
        if (col.id !== id) return { ...col, sort: col.sort === '' ? '' : 'default' };
        if (value) return { ...col, sort: value };
        if (col.sort === 'default') return { ...col, sort: 'asc' };
        if (col.sort === 'asc') return { ...col, sort: 'desc' };
        return { ...col, sort: 'default' };
      });

      const current = updated.find((col) => col.id === id);
      currentSort(id, current?.sort ?? '');

      return updated;
    });
  };

  const handleSort = (value: string, id: string) => {
    if (!value || value === '') return null;
    if (value === 'default') {
      return (
        <div
          className="flex flex-col gap-[5px] cursor-pointer hover:opacity-60"
          onClick={() => toggleSort(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
          >
            <path
              d="M11 5.5L6 0.5L1 5.5"
              stroke="#343A40"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
          >
            <path
              d="M11 0.5L6 5.5L1 0.5"
              stroke="#343A40"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    if (value === 'asc') {
      return (
        <div className="hover:opacity-60 cursor-pointer" onClick={() => toggleSort(id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
          >
            <path
              d="M11 8L6 3M1 8L6 3M6 3L6 13.5"
              stroke="#343A40"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    if (value === 'desc') {
      return (
        <div className="hover:opacity-60 cursor-pointer" onClick={() => toggleSort(id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
          >
            <path
              d="M11 9L6 14M1 9L6 14M6 14L6 2.5"
              stroke="#343A40"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="!border-0">
          {headerTable.map((item) => (
            <TableHead
              key={item.id}
              className={clsx(item.class ? item.class : 'text-[#343A40]', 'p-[20px]')}
            >
              <div
                className={clsx(item.class, 'flex gap-[10px] items-center text-[14px] font-[600]')}
              >
                {item.display}
                {handleSort(item.sort, item.id)}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className="">
        {data
          ? data.map((item, idx) => (
              <TableRow className="border-[#EFEFEF]" key={idx}>
                {headerTable.map((col) => (
                  <TableCell className="!p-[20px]" key={col.id}>
                    {slots?.[col.id]
                ? slots[col.id]?.(item) // custom render
                : (item as Record<string, ReactNode>)[col.id]} {/* fallback raw */}
                    {/* {slots && slots[col.id] ? slots[col.id](item) : (item as any)[col.id]} */}
                  </TableCell>
                ))}
              </TableRow>
            ))
          : children}
      </TableBody>
    </Table>
  );
}

export default TableCustom;
