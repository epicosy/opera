'use client'

import React from "react";
import {Chart, GoogleChartControlProp, GoogleChartOptions} from "react-google-charts";
import chroma from "chroma-js";
import {Spin} from "antd";


export const options : GoogleChartOptions = {
    backgroundColor: 'transparent',
    bar: { groupWidth: "100%" },
    legend: { position: "none" },
    isStacked: true
};


interface CardBarChartProps {
    data: { key: string, value: number }[];
    fields: Array<string>;
    title: string;
    filterCounts?: number;
    controls?: GoogleChartControlProp[];
    gradient?: boolean;
    loading?: boolean;
}

function generateColorGradient(startColor: string, endColor: string, steps: number): string[] {

    return chroma.scale([startColor, endColor]).colors(steps);
}

const startColor = '#042f2e';
const endColor = '#f0fdfa';


export default function CardBarChart({data, fields, title, filterCounts, controls = undefined, gradient = true,
                                         loading = false} : CardBarChartProps) {
    let counts;

    if (filterCounts) {
        counts = data.map((el) => [el.key, el.value]).filter((count) => count[1] > filterCounts);
    } else {
        counts = data.map((el) => [el.key, el.value]);
    }

    counts.unshift(fields);

    if (gradient) options.colors = generateColorGradient(startColor, endColor, counts.length - 1);

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
                    <div className="flex relative justify-center items-center h-350-px">
                        {loading ? (<Spin tip="Loading" size="large"/>)
                            : (
                                controls ? (
                                    (<Chart chartType="Bar" width="100%" height="95%" data={counts} options={options}
                                            chartPackages={['corechart', 'controls']}
                                            controls={controls.map((control) => ({
                                                'controlType': control.controlType,
                                                'options': control.options,
                                                'controlEvents': control.controlEvents
                                            }))}
                                    />))
                            : (<Chart chartType="Bar" width="100%" height="100%" data={counts} options={options}/>)
                        )}
                    </div>
                </div>
         </div>
    );
}
