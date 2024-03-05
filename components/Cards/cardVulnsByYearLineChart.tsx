'use client'

import React from "react";
import {Chart} from "react-google-charts";
import {Spin} from "antd";

export const options = {
    title: "Vulnerabilities by year",
    curveType: "function",
    legend: { position: "bottom" },
};

interface VulnsByYearProps {
    data: { key: string, value: number }[];
    loading?: boolean;
}


export default function CardVulnerabilitiesByYearLineChart({data, loading = false} : VulnsByYearProps) {
    const vulns_year = [["Year", "Count"], ...(data?.map(({ key, value }) => [key, value]) || [])];

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
                <div className="relative h-350-px">
                    {loading ? (<Spin tip="Loading" size="large"/>)
                        : (
                            <Chart chartType="LineChart" width="100%" height="100%" data={vulns_year} options={options} />
                        )
                    }
                </div>
            </div>
        </div>
    );
};