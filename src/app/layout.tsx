import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/components/ui/sidebar';
import LayoutClient from '@/components/layout/layoutClient';
import { Prompt } from "next/font/google";

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
});

// Keep Geist fonts as well
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'cms dohome',
  description: 'cms dohome',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${prompt.variable} ${geistSans.variable} ${geistMono.variable} font-prompt antialiased min-h-screen flex flex-col h-screen`}
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
