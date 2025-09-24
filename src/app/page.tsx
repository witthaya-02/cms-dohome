"use client";
import { useCommon } from "@/hooks/common";

export default function Home() {
  const { loading, error } = useCommon();

  if (loading) return <p>กำลังโหลด...</p>;
  if (error)
    return <p style={{ color: "red" }}>เกิดข้อผิดพลาด: {error.message}</p>;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        home
        <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
