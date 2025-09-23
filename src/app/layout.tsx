import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/add-slide";
import LayoutClient from "@/components/layout/layoutClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cms dohome",
  description: "cms dohome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          {/* <AppSidebar breadcrumb={updateBreadcrumb}/>
          <main className="w-full">
            <header className="p-[20px] border-b-[1px] border-[#E0E0E3] bg-white w-full">
              <SidebarTrigger />
            </header>
            <div className="bg-[#F7F7F7] w-full h-full">{children}</div>
          </main> */}
          <LayoutClient>{children}</LayoutClient>
        </SidebarProvider>
      </body>
    </html>
  );
}
