'use client';
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {useVulnerabilityPage, VulnerabilityPageProvider} from "../../context/vulnerabilities";

function VulnerabilityTable() {
    const { headers, rows, currentPage, setPage, pagination } = useVulnerabilityPage();

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

export default function Vulnerabilities() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <VulnerabilityPageProvider>
                        <VulnerabilityTable />
                    </VulnerabilityPageProvider>
                </div>
            </div>
        </>
    )
}
