'use client';
import React from "react";

import "styles/tailwind.css";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {FilesPageProvider, useFilesPage} from "../../context/files";
import {FilesChartsProvider, useFilesChartsContext} from "../../context/filesCharts";
import CardPieChart from "../../components/Cards/cardPieChart";
import CardBarChart from "../../components/Cards/CardBarChart";
import CardSankeyChart from "../../components/Cards/CardSankeyChart";

function FilesTable() {
    const { headers, rows, currentPage, setPage, pagination } = useFilesPage();

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

function FilesCharts() {
    const { filesExtensions, filesChangesCount, filesStatuses, languageExtensionLinksCount } = useFilesChartsContext();

    return (
        <div className="flex flex-row">
            <div className="flex flex-col w-2/3 h-full">
                <div className="flex flex-row">
                    <div className="flex-col w-1/2">
                        <CardPieChart data={filesExtensions} title="Extensions Distribution"
                                      fields={["Extension", "Count"]}/>
                    </div>
                    <div className="flex-col w-1/2 pl-4">
                        <CardPieChart data={filesStatuses} title="Files Statuses" fields={['Status', 'Count']}/>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex-col w-full">
                        <CardBarChart data={filesChangesCount} fields={['#Changes', 'Count']} filterCounts={20}
                                      title="Distribution of the number of changes per file (count > 20)"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-1/3 pl-4 h-full">
                <div className="flex flex-row w-full">
                    <div className="flex-col w-full h-full">
                        <CardSankeyChart data={languageExtensionLinksCount}
                                         title="Relationship between Project Language and Extension of Changed Files"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Files() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <FilesChartsProvider>
                        <FilesCharts/>
                    </FilesChartsProvider>
                    <FilesPageProvider>
                        <FilesTable/>
                    </FilesPageProvider>
                </div>
            </div>
        </>
    )
}