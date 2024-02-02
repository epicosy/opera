import React from "react";


interface CardStatsProps {
    statSubtitle: string,
    statTitle: string,
    icon: React.JSX.Element,
    // can be any of the background color utilities
    // from tailwindcss
    statIconColor?: string,
}


export default function CardStats({statSubtitle, statTitle, icon, statIconColor = "bg-red-500"} : CardStatsProps) {
  return (
      <>
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-gray-400 uppercase font-bold text-xs">
                  {statSubtitle}
                </h5>
                <span className="font-semibold text-xl text-gray-700">
                {statTitle}
              </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div
                    className={
                        "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                        statIconColor
                    }
                >
                    {icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
