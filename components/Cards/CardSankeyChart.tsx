'use client'

import React from "react";
import { Chart } from "react-google-charts";


export const options = {};


export default function CardSankeyChart({data, title, filterCounts}) {
    let counts;

    if (filterCounts) {
        counts = data.map((el) => [el.at, el.to, el.count]).filter((count) => count[2] > filterCounts);
    } else {
        counts = data.map((el) => [el.at, el.to, el.count]);
    }

    counts.unshift(["From", "To", "Count"]);

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                            Sankey Chart
                        </h6>
                        <h2 className="text-gray-700 text-xl font-semibold">
                            {title}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                {/* Chart */}
                <div className="relative h-800-px">
                    <Chart chartType="Sankey" width="100%" height="100%" data={counts} options={options}/>
                </div>
            </div>
        </div>
    );
}
