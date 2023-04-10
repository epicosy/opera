'use client';
import React from "react";

import "styles/tailwind.css";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {CommitPageProvider, useCommitsPage} from "../../context/commits";
import CardPieChart from "../../components/Cards/cardPieChart";

function CommitTable() {
    const { headers, rows, currentPage, setPage, pagination, kindCounts } = useCommitsPage();

    return (
        <div>
            <div className="w-full xl:w-4/12 px-4">
                <CardPieChart data={kindCounts} title="Kind Distribution"
                              fields={["Kind", "Count"]}/>
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

export default function Commits() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CommitPageProvider>
                        <CommitTable/>
                    </CommitPageProvider>
                </div>
            </div>
        </>
    )
}
