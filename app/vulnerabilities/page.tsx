'use client';
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {useVulnerabilityPage, VulnerabilityPageProvider} from "../../context/vulnerabilities";
import {useVulnerabilitiesCharts, VulnerabilitiesChartsProvider} from "../../context/vulnerabilitiesCharts";
import CardPieChart from "../../components/Cards/cardPieChart";


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

function VulnerabilitiesCharts(){
    const { cweCounts, vulnsSeverity, vulnsExploitability, cweMultiplicity, vulnsCountBySofDevView } = useVulnerabilitiesCharts();

    return (
        <div>
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                    <CardPieChart data={cweCounts} title="CWEs Distribution" fields={["ID", "Count"]}/>
                </div>
                <div className="flex-col w-2/6 pl-4">
                    <CardPieChart data={vulnsSeverity} title="Vulnerabilities Severity" fields={['Severity', 'Count']}/>
                </div>
                <div className="flex-col w-2/6 pl-4">
                    <CardPieChart data={vulnsExploitability} title="Vulnerabilities Exploitability"
                                  fields={['Exploitability', 'Count']}/>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                    <CardPieChart data={cweMultiplicity} title="CWEs Multiplicity" fields={["ID", "Count"]}/>
                </div>
                <div className="flex-col w-2/6 pl-4">
                    <CardPieChart data={vulnsCountBySofDevView} title="Vulnerabilities Count by Software Development View"
                                    fields={['Category', 'Count']}/>
                </div>
            </div>
        </div>
    );
}

export default function Vulnerabilities() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <VulnerabilitiesChartsProvider>
                        <VulnerabilitiesCharts/>
                    </VulnerabilitiesChartsProvider>
                    <VulnerabilityPageProvider>
                        <VulnerabilityTable />
                    </VulnerabilityPageProvider>
                </div>
            </div>
        </>
    )
}
