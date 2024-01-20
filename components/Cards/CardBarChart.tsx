'use client'

import React from "react";
import { Chart } from "react-google-charts";


export const options = {
    bar: { groupWidth: "100%" },
    legend: { position: "none" },
    isStacked: true
};


interface CardBarChartProps {
    data: { key: string, value: number }[];
    fields: Array<string>;
    title: string;
    filterCounts?: number;
}


export default function CardBarChart({data, fields, title, filterCounts} : CardBarChartProps) {
    let counts;

    if (filterCounts) {
        counts = data.map((el) => [el.key, el.value]).filter((count) => count[1] > filterCounts);
    } else {
        counts = data.map((el) => [el.key, el.value]);
    }

    counts.unshift(fields);

    return (
         <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                                Bar Chart
                            </h6>
                            <h2 className="text-gray-700 text-xl font-semibold">
                                {title}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative h-350-px">
                        <Chart chartType="Bar" width="100%" height="100%" data={counts} options={options}/>
                    </div>
                </div>
         </div>
    );
}
