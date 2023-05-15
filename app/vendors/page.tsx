'use client';
import React from "react";

import "styles/tailwind.css";
import {VendorsPageProvider, useVendorsPage} from "../../context/vendors";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {useVendorsCharts, VendorsChartsProvider} from "../../context/vendorsCharts";
import CardPieChart from "../../components/Cards/cardPieChart";
import CardBarChart from "../../components/Cards/CardBarChart";

function VendorsTable() {
    const { headers, rows, currentPage, setPage, pagination } = useVendorsPage();

    return (
        <CardFilterPaginationTable
            headers={headers}
            rows={rows}
            currentPage={currentPage}
            setPage={setPage}
            pagination={pagination}
        />
    );
}

function VendorsCharts() {
    const { productsCountByVendor, configsCountByVendor, vulnsCountByVendor } = useVendorsCharts();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex-col w-3/6">
                    <CardBarChart data={productsCountByVendor} title="Products Count Distribution"
                                  fields={["#Products", "Count"]}/>
                </div>
                <div className="flex-col w-3/6 pl-4">
                    <CardBarChart data={configsCountByVendor} title="Configs Count Distribution"
                                    fields={["#Configs", "Count"]}/>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex-col w-3/6">
                    <CardBarChart data={vulnsCountByVendor} title="Vulns Count Distribution"
                                    fields={["#Vulns", "Count"]}/>
                </div>
            </div>
        </div>
    );
}

export default function Vendors() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <VendorsChartsProvider>
                        <VendorsCharts/>
                    </VendorsChartsProvider>
                    <VendorsPageProvider>
                        <VendorsTable/>
                    </VendorsPageProvider>
                </div>
            </div>
        </>
    )
}