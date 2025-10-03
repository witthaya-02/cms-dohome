'use client';
import { DraggableList, DragProvider } from '@/components/DraggableSection';
import React, { useState, useRef } from 'react';

const CustomPageBuilder = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [locked, setLocked] = useState(false); // state สำหรับ lock/unlock
  const containerRef = useRef<HTMLDivElement>(null);

  const [listItem, setListItem] = useState([
    { name: 'test-1', id: 'test-1', showOnAdd: true, showOnWeb: true, active: true },
    { name: 'test-2', id: 'test-2', showOnAdd: true, showOnWeb: true, active: true },
    { name: 'test-3', id: 'test-3', showOnAdd: true, showOnWeb: true, active: true },
    { name: 'test-4', id: 'test-4', showOnAdd: true, showOnWeb: true, active: true },
    { name: 'test-5', id: 'test-5', showOnAdd: true, showOnWeb: true, active: true },
    { name: 'test-6', id: 'test-6', showOnAdd: true, showOnWeb: true, active: true },
  ]);

  type WidgetSections = keyof typeof defaultWidget;
  const defaultWidget = {
    banner: [
      {
        icon: () => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <mask id="path-1-inside-1_14036_224251" fill="white">
              <rect x="6" y="10" width="28" height="19" rx="1" />
            </mask>
            <rect
              x="6"
              y="10"
              width="28"
              height="19"
              rx="1"
              stroke="black"
              strokeWidth="4"
              mask="url(#path-1-inside-1_14036_224251)"
            />
          </svg>
        ),
        title: 'Single Banner',
        type: 'hero-banner',
      },
    ],
    product: [
      {
        icon: () => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="27"
            viewBox="0 0 13 27"
            fill="none"
          >
            <rect
              x="1"
              y="1"
              width="18"
              height="25"
              rx="0.5"
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M3.70312 3.67969H16.3031V15.2868H3.70312V3.67969Z"
              stroke="black"
              strokeLinejoin="round"
            />
          </svg>
        ),
        title: 'Product Carousel',
        type: 'product-carousel',
      },
    ],
    // rawHTML: [],
  };

  const [widget, setWidget] = useState<
    {
      moduleName: string;
      type: string;
    }[]
  >([]);
  const [currentActiveWidget, setCurrentActiveWidget] = useState<string | null>(null);

  // --- Zoom ---
  const handleWheel = (e: React.WheelEvent) => {
    if (locked) return; // ถ้า lock ไว้ ห้ามซูม
    e.preventDefault();
    const zoomIntensity = 0.02;
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + zoomIntensity, 3));
    } else {
      setScale((prev) => Math.max(prev - zoomIntensity, 0.5));
    }
  };

  // --- Drag ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (locked) return; // ห้าม drag ถ้า lock
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (locked || !isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // --- Toggle Lock ---
  const toggleLock = () => {
    if (!locked) {
      // เมื่อกด lock → รีเซ็ตกลับตรงกลาง
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
    setLocked((prev) => !prev);
  };

  const label = (active: boolean, display: string) => (
    <div
      className={`${active ? 'bg-[#F26529]' : 'bg-[#E0E0E3]'} relative rounded-[20px] px-[6px] py-[4px] text-center text-[14px] font-[500] text-[#fff] w-fit whitespace-nowrap`}
    >
      {display}
      <div className="absolute left-[98%] top-1/2 -translate-y-1/2">
        {active ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
          >
            <path d="M0.8125 9V0L8.8125 4.5L0.8125 9Z" fill="#F26529" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
          >
            <path d="M0.8125 9V0L8.8125 4.5L0.8125 9Z" fill="#E0E0E3" />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <DragProvider>
      <div className="bg-[#fff] w-full h-[84px] flex justify-between border-b border-[#E0E0E3]">
        <div>header</div>
        <button
          onClick={toggleLock}
          className={`px-4 py-2 rounded ${locked ? 'bg-green-500' : 'bg-blue-500'} text-white`}
        >
          {locked ? 'Locked' : 'Unlocked'}
        </button>
      </div>

      <div className="grid grid-cols-[345px_1fr_260px] h-[calc(100vh-84px)] w-screen">
        <div className="bg-[#fff] px-[16px] py-[20px]">
          {/* <div className="" onClick={()=> console.log(listItem)}>test</div> */}
          <DraggableList
            id="list"
            className="flex flex-col gap-[20px]"
            data={listItem}
            onDataChange={setListItem}
            itemSection={(data) => (
              <div className="p-[10px] border border-[#E0E0E3] rounded-[10px] flex justify-between items-center gap-[10px] px-[12px] py-[7px]">
                <div className="bg-red">{data.name}</div>
                <div className="flex gap-[10px] items-center">
                  <div className="flex gap-[5px] items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                    >
                      <path
                        d="M13.3359 1H2.66927C1.93289 1 1.33594 1.59695 1.33594 2.33333V8.33333C1.33594 9.06971 1.93289 9.66667 2.66927 9.66667H13.3359C14.0723 9.66667 14.6693 9.06971 14.6693 8.33333V2.33333C14.6693 1.59695 14.0723 1 13.3359 1Z"
                        stroke="#F26529"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 10.332V12.332"
                        stroke="#F26529"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.33594 13H10.6693"
                        stroke="#F26529"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="none"
                    >
                      <path
                        d="M8.99687 1H2.99687C2.33413 1 1.79688 1.53726 1.79688 2.2V11.8C1.79688 12.4627 2.33413 13 2.99687 13H8.99687C9.65962 13 10.1969 12.4627 10.1969 11.8V2.2C10.1969 1.53726 9.65962 1 8.99687 1Z"
                        stroke="#F26529"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 10.6016H6.0008V10.6024H6V10.6016Z"
                        stroke="#F26529"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="20.25"
                        cy="9.75"
                        r="1.75"
                        transform="rotate(90 20.25 9.75)"
                        fill="#343A40"
                      />
                      <circle
                        cx="14.75"
                        cy="9.75"
                        r="1.75"
                        transform="rotate(90 14.75 9.75)"
                        fill="#343A40"
                      />
                      <circle
                        cx="9.25"
                        cy="9.75"
                        r="1.75"
                        transform="rotate(90 9.25 9.75)"
                        fill="#343A40"
                      />
                      <circle
                        cx="20.25"
                        cy="15.25"
                        r="1.75"
                        transform="rotate(90 20.25 15.25)"
                        fill="#343A40"
                      />
                      <circle
                        cx="14.75"
                        cy="15.25"
                        r="1.75"
                        transform="rotate(90 14.75 15.25)"
                        fill="#343A40"
                      />
                      <circle
                        cx="9.25"
                        cy="15.25"
                        r="1.75"
                        transform="rotate(90 9.25 15.25)"
                        fill="#343A40"
                      />
                      <circle
                        cx="3.75"
                        cy="9.75"
                        r="1.75"
                        transform="rotate(90 3.75 9.75)"
                        fill="#343A40"
                      />
                      <circle
                        cx="3.75"
                        cy="15.25"
                        r="1.75"
                        transform="rotate(90 3.75 15.25)"
                        fill="#343A40"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
        <div
          ref={containerRef}
          className={`${locked ? 'overflow-scroll' : 'overflow-hidden'} relative w-full h-full flex justify-center`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: locked ? 'default' : isDragging ? 'grabbing' : 'grab',
          }}
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              //   transformOrigin: 'top left',
              transition: isDragging ? 'none' : 'transform 0.1s ease',
            }}
          >
            {currentActiveWidget}
            <div className={`bg-white w-[499px] mt-[20px] flex flex-col  h-[calc(100vh-84px)]`}>
              <DraggableList
                id="widget"
                className="flex flex-col hover:none"
                data={widget}
                hoverAnimation={false}
                onDataChange={setWidget}
                extractValue={(item) => ({
                  moduleName: item.title,
                  type: item.type,
                })}
                endDrop={(data, index) => {
                  console.log('test-v:', data, index);
                  setCurrentActiveWidget(`${data?.moduleName}-${index ?? 0}`);
                }}
                itemSection={(item, index) => (
                  <div className="relative">
                    <div
                      onClick={() => {
                        setCurrentActiveWidget(`${item.moduleName}-${index}`);
                      }}
                      className={`${currentActiveWidget === `${item.moduleName}-${index}` && 'border-t border-b border-red-500'} h-[200px]  bg-red-200 cursor-pointer flex flex-col items-center gap-2`}
                    >
                      {item.type}
                    </div>
                    {currentActiveWidget === `${item.moduleName}-${index}` ? (
                      <>
                        <div className="absolute right-[calc(100%+20px)] top-1/2 -translate-y-1/2">
                          {label(true, item.moduleName)}
                        </div>

                        <div className="absolute left-[calc(100%+20px)] top-1/2 -translate-y-1/2 flex flex-col gap-[10px]">
                          <div className="bg-[#fff] border-0.5 border-[#E0E0E3] rounded-[10px] w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M11.0859 6.61765L7.0026 2.5M2.91927 6.61765L7.0026 2.5M7.0026 2.5L7.0026 11.25"
                                stroke="#343A40"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          <div className="bg-[#fff] border-0.5 border-[#E0E0E3] rounded-[10px] w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M11.0859 7.38235L7.0026 11.5M2.91927 7.38235L7.0026 11.5M7.0026 11.5L7.0026 2.75"
                                stroke="#343A40"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          <div className="bg-[#fff] border-0.5 border-[#E0E0E3] rounded-[10px] w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M4.9974 4.08333V2.8C4.9974 2.52152 5.10275 2.25445 5.29029 2.05754C5.47783 1.86062 5.73218 1.75 5.9974 1.75H7.9974C8.26261 1.75 8.51697 1.86062 8.7045 2.05754C8.89204 2.25445 8.9974 2.52152 8.9974 2.8V4.08333M11.0807 4.08333L10.4974 11.2C10.4974 11.4785 10.392 11.7455 10.2045 11.9425C10.017 12.1394 9.76261 12.25 9.4974 12.25H4.4974C4.23218 12.25 3.97783 12.1394 3.79029 11.9425C3.60275 11.7455 3.4974 11.4785 3.4974 11.2L2.91406 4.08333H11.0807Z"
                                stroke="#D62828"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2.33594 4.08203H3.37297H11.6693"
                                stroke="#D62828"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.83594 6.41797V9.33464"
                                stroke="#D62828"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.16406 6.41797V9.33464"
                                stroke="#D62828"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute right-[calc(100%+20px)] top-1/2 -translate-y-1/2">
                        {label(false, item.moduleName)}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className="bg-[#fff]">
          <div className="">
            {(['banner', 'product'] as WidgetSections[]).map((section, index) => (
              <div
                className="py-[13px] px-[16px] border-b border-[#F3F3F3] flex flex-col gap-[13px]"
                key={index}
              >
                <h3 className="font-bold ">
                  {section}({defaultWidget[section].length})
                </h3>
                <DraggableList
                  id="widget"
                  className="grid grid-cols-2 gap-[20px]"
                  data={defaultWidget[section]}
                  isSourceList={true}
                  itemSection={(item) => (
                    <div
                      key={index}
                      className="bg-[#F8F9FA] rounded-[20px] px-[10px] py-[15px] flex flex-col items-center gap-[4px]"
                    >
                      {item.icon()}
                      <span className="text-[#343A40] font-[500] text-[12px] text-center">
                        {item.title}
                      </span>
                    </div>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DragProvider>
  );
};

export default CustomPageBuilder;
