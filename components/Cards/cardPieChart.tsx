'use client'

import React from "react";
import {Chart, GoogleChartControlProp, GoogleChartOptions} from "react-google-charts";
import chroma from "chroma-js";

export const options : GoogleChartOptions = {
    backgroundColor: 'transparent',
    pieHole: 0.40,
    is3D: false
};


function generateColorGradient(startColor: string, endColor: string, steps: number): string[] {

    return chroma.scale([startColor, endColor]).colors(steps);
}

// Example usage
const startColor = '#042f2e';
const endColor = '#f0fdfa';


interface CardPieChartProps {
    data: any;
    fields: Array<string>;
    title: string;
    height?: number;
    controls?: GoogleChartControlProp[];
    gradient?: boolean;
}


export default function CardPieChart({ data, fields, title, height = 350, controls = undefined,
                                         gradient = true } : CardPieChartProps) {
    const chartHeight = height || 350; // Set a default height of 350 if height prop is not provided
    const newData: (string | any[])[] = [fields, ...(data ? data.map((dictionary: any) => Object.values(dictionary)) : [])];
    // sort the data by the second column in descending order
    newData.sort((a, b) => b[1] - a[1]);

    if (gradient) options.colors = generateColorGradient(startColor, endColor, newData.length - 1);

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
                        {controls ?
                            ((<Chart chartType="PieChart" width="95%" height="95%" data={newData} options={options}
                                     chartPackages={['corechart', 'controls']}
                                     chartWrapperParams={{ view: { columns: [0, 1] } }}
                                     controls={controls.map((control) => ({
                                         'controlType': control.controlType,
                                         'options': control.options,
                                         'controlEvents': control.controlEvents
                                     }))}
                            />))
                            :
                            (<Chart chartType="PieChart" width="100%" height="100%" data={newData} options={options} />)
                        }
                    </div>
                </div>
            </div>
        </>
    );
}