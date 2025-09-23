"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/add-slide";
import Link from "next/link";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breadcrumb, setBreadcrumb] = useState<
    { title: string; url: string }[]
  >([]);

  return (
    <>
      <AppSidebar updateBreadcrumb={setBreadcrumb} />
      <main className="w-full">
        <header className="p-[20px] border-b-[1px] border-[#E0E0E3] bg-white w-full flex items-center justify-between">
          <div className="flex gap-[20px] items-center">
            <SidebarTrigger />
            <div className="text-sm flex gap-[20px] text-gray-500">
              {breadcrumb.map((item, index) => (
                <div key={index}>
                  {index !== breadcrumb.length - 1 ? (
                    <div className="flex gap-[20px] items-center">
                      <Link href={item.url} className="text-[#F26529] font-[600]">{item.title}</Link>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        fill="none"
                      >
                        <path
                          d="M0.787598 0.5L5.7876 5.5L0.787598 10.5"
                          stroke="#4D4D4F"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="text-[#7E7E7F] font-[400]">{item.title}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="">{/* TODO */}</div>
        </header>
        <div className="bg-[#F7F7F7] w-full h-full">{children}</div>
      </main>
    </>
  );
}
