'use client'

import React from "react";
import { Chart } from "react-google-charts";

export const options = {
    pieHole: 0.40,
    is3D: false,
};

export default function CardPieChart({ data, fields, title, height }) {
    const chartHeight = height || 350; // Set a default height of 350 if height prop is not provided

    const counts = [fields, ...(data?.map(({ key, value }) => [key, value]) || [])];

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                                Pie Chart
                            </h6>
                            <h2 className="text-gray-700 text-xl font-semibold">
                                {title}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative" style={{ height: `${chartHeight}px` }}>
                        <Chart chartType="PieChart" width="100%" height="100%" data={counts} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
}