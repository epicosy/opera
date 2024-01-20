'use client'

import React from "react";
import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';


interface CardNestedPieChartProps {
    data: { key: string; values: { key: string; value: number }[] }[];
    fields: string[];
    title: string;
}


export default function CardNestedPieChart({data, fields, title}: CardNestedPieChartProps){
    const chartData = {
        labels: data.map(count => count.key),
        datasets: [{
            label: 'Part',
            data: data.map(part =>
                part.values.reduce((acc, value) => acc + value.value, 0)),
            backgroundColor: ["#0A4D68", "#2A2F4F", "#A75D5D"]
        }, {
            label: 'Vulnerable',
            data: data.flatMap(part =>
                part.values.filter(value => value.key === 'vulnerable').map(value => value.value)
            ),
            backgroundColor: ["#088395", "#917FB3", "#D3756B"]
        }, {
            label: 'Non-Vulnerable',
            data: data.flatMap(part =>
                part.values.filter(value => value.key === 'non-vulnerable').map(value => value.value)
            ),
            backgroundColor: ["#05BFDB", "#E5BEEC", "#F0997D"]
        }]
    };

    const options: ChartOptions<'pie'> = {
        plugins: {
            title: {
                display: true,
                text: title,
            },
        },
    };

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                                Nested Pie Chart
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
                        <Pie data={chartData} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
}
