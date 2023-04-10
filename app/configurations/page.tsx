'use client';
import React from "react";

import "styles/tailwind.css";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {ConfigurationsPageProvider, useConfigurationsPage} from "../../context/configurations";
import CardNestedPieChart from "../../components/Cards/cardNestedPieChart";

function CommitTable() {
    const { headers, rows, currentPage, setPage, pagination, partCounts} = useConfigurationsPage();

    return (
        <div>
            <div className="w-full xl:w-4/12 px-4">
                <CardNestedPieChart data={partCounts} title="Part Distribution"
                              fields={["Part", "Vulnerable Count", "Non-Vulnerable Count"]}/>
            </div>
            <CardFilterPaginationTable
                headers={headers}
                rows={rows}
                currentPage={currentPage}
                setPage={setPage}
                pagination={pagination}
            />
        </div>
    );
}

export default function Configurations() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <ConfigurationsPageProvider>
                        <CommitTable/>
                    </ConfigurationsPageProvider>
                </div>
            </div>
        </>
    )
}
