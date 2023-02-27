'use client'

import React from "react";
import { Chart } from "react-google-charts";

export const options = {
    pieHole: 0.40,
    is3D: false,
};

export default function CardAssignersPieChart({data}) {
    const assigners_counts = data.map((el) => {
        return [el.key, el.value]
    })
    assigners_counts.unshift(["Assigner", "Count"]);

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                                Stats
                            </h6>
                            <h2 className="text-gray-700 text-xl font-semibold">
                                Assigners Distribution
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative h-350-px">
                        <Chart chartType="PieChart" width="100%" height="100%" data={assigners_counts} options={options}/>
                    </div>
                </div>
            </div>
        </>
    );
}
