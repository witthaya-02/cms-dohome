"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import productIconMenu from "~/public/icons/sideMenu/ic-product.svg";
import brandIconMenu from "~/public/icons/sideMenu/ic-brand.svg";
import storeIconMenu from "~/public/icons/sideMenu/ic-store.svg";

import logo from "~/public/logo-dohome.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "สินค้า",
    url: "/product",
    icon: productIconMenu,
    child: [
      { title: "สินค้าทั้งหมด", url: "" },
      { title: "Collection Overview", url: "/collection" },
    ],
  },
  {
    title: "แบรนด์",
    url: "/brand",
    icon: brandIconMenu,
    child: [
      { title: "แบรนด์ทั้งหมด", url: "" },
      { title: "Brand Recommend", url: "/recommend" },
    ],
  },
  {
    title: "จัดการร้านค้า",
    url: "/store-management",
    icon: storeIconMenu,
    child: [
      { title: "จัดการหน้าหลัก", url: "" },
      { title: "Custom Page", url: "/custom-page" },
    ],
  },
];
type Props = {
  updateBreadcrumb: (value: { title: string; url: string }[]) => void;
};
export const AppSidebar: React.FC<Props> = ({ updateBreadcrumb }) => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.title, false]))
  );

  useEffect(() => {
    const next = Object.fromEntries(items.map((i) => [i.title, false]));
    items.forEach((i) => {
      if (
        pathname.startsWith(i.url) || // parent active
        i.child.some((c) => pathname === i.url + c.url) // child active
      ) {
        next[i.title] = true;
      }
    });
    setExpanded(next);
    // breadcrumb
    const breadcrumb: { title: string; url: string }[] = [];

    const parent = items.find(
      (item) =>
        pathname.startsWith(item.url) ||
        item.child?.some((c) => pathname === item.url + c.url)
    );

    if (parent) {
      breadcrumb.push({ title: parent.title, url: parent.url });

      const child = parent.child?.find((c) => pathname === parent.url + c.url);

      if (child) {
        breadcrumb.push({ title: child.title, url: parent.url + child.url });
      }
    }

    console.log("Breadcrumb", breadcrumb);
    updateBreadcrumb(breadcrumb);
  }, [pathname]);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => {
      const isOpen = !!prev[title];
      const next = Object.fromEntries(
        items.map((i) => [i.title, false])
      ) as Record<string, boolean>;
      next[title] = !isOpen;
      return next;
    });
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-[#343A40] shadow-[10px_0_14px_0_rgba(0,0,0,0.05)] p-[10px]">
        <SidebarGroup>
          <Link href={"/"} className="flex w-full justify-center py-[20px]">
            <Image src={logo} alt="logo" width={57} height={60} />
          </Link>

          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-[5px]">
              {items.map((item) => {
                const isOpen = expanded[item.title] ?? false;
                return (
                  <div
                    className="flex flex-col cursor-pointer"
                    key={item.title}
                  >
                    <Link
                      href={item.url}
                      onClick={() => {
                        toggleExpand(item.title);
                      }}
                      className={`${
                        isOpen ? "bg-[#f26529]" : ""
                      } p-[10px] rounded-[10px] flex justify-between items-center`}
                    >
                      <div className="flex gap-[10px]">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={24}
                          height={24}
                        />
                        <div className="text-[14px] flex items-center font-[400] text-white">
                          {item.title}
                        </div>
                      </div>
                      {item.child?.length > 0 && (
                        <button
                          type="button"
                          className={`${
                            isOpen ? "rotate-180" : "rotate-0"
                          } transition-transform duration-300 transform flex items-center justify-center`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="7"
                            viewBox="0 0 11 7"
                            fill="none"
                          >
                            <path
                              d="M10.5 0.787598L5.5 5.7876L0.5 0.787598"
                              stroke="white"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </Link>

                    {/* child menu */}
                    {isOpen && item.child.length > 0 && (
                      <div className=" flex flex-col">
                        {item.child.map((child) => (
                          <Link
                            href={`${item.url + child.url}`}
                            key={child.title}
                            className={`${
                              pathname === item.url + child.url
                                ? "text-[#f26529] font-[600]"
                                : "text-gray-300 hover:text-white"
                            }  text-[13px] p-[10px] flex gap-[10px]`}
                          >
                            <div className="w-[24px]"></div>
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
