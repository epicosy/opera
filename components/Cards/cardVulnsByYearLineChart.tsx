'use client'

import React from "react";
import {Chart} from "react-google-charts";

export const options = {
    title: "Vulnerabilities by year",
    curveType: "function",
    legend: { position: "bottom" },
};

export default function CardVulnerabilitiesByYearLineChart({data}) {
    const vulns_year = data?.map(({ key, value }) => [key, value])?.unshift(["Year", "Count"]);

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">Overview</h6>
                        <h2 className="text-gray-700 text-xl font-semibold">Entries by Year</h2>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                {data ? (
                    // Chart
                    <div className="relative h-350-px">
                        <Chart chartType="LineChart" width="100%" height="100%" data={vulns_year} options={options} />
                    </div>
                ) : (
                    // No Data Widget
                    <div className="flex items-center justify-center h-350-px text-center text-gray-500">
                        No Data Available
                    </div>
                )}
            </div>
        </div>
    );
};