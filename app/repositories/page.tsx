'use client';
import React from "react";

import "styles/tailwind.css";
import {RepositoriesPageProvider, useRepositoriesPage} from "../../context/repositories";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {RepositoriesChartsProvider, useRepositoriesCharts} from "../../context/repositoriesCharts";
import CardBarChart from "../../components/Cards/CardBarChart";
import CardPieChart from "../../components/Cards/cardPieChart";
import CardSankeyChart from "../../components/Cards/CardSankeyChart";

function RepositoriesTable() {
    const { headers, rows, currentPage, setPage, pagination } = useRepositoriesPage();

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

function RepositoriesCharts() {
    const { repositoriesAvailability, repositoriesCommitsFrequency, repositoriesLanguageCount, topicsCount,
        langProductLinksCount, repositoriesSoftwareTypeCount } = useRepositoriesCharts();

    return (
        <div className="flex flex-row">
            <div className="flex flex-col w-2/3 h-full">
                <div className="flex flex-row">
                    <div className="flex-col w-1/2">
                        <CardPieChart
                            data={repositoriesAvailability}
                            title="Repos availability"
                            fields={['Availability', 'Count']}
                        />
                    </div>
                    <div className="flex-col w-1/2 pl-4">
                        <CardBarChart
                            data={repositoriesCommitsFrequency}
                            title="Occurrences of commits counts (count > 20)"
                            fields={["Commits Count", "Occurrences"]}
                            filterCounts={20}
                        />
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex-col w-1/2">
                        <CardPieChart
                            data={repositoriesLanguageCount}
                            title="Repos language distribution"
                            fields={['Language', 'Count']}
                        />
                    </div>
                    <div className="flex-col w-1/2 pl-4">
                        <CardPieChart
                            data={topicsCount}
                            title="Topics distribution"
                            fields={['Topic', 'Count']}
                        />
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex-col w-1/2">
                        <CardPieChart
                            data={repositoriesSoftwareTypeCount}
                            title="Repos software type distribution"
                            fields={['SW Type', 'Count']}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-1/3 pl-4 h-full">
                <div className="flex flex-row w-full">
                    <div className="flex-col w-full h-full">
                        <CardSankeyChart data={langProductLinksCount}
                                         title="Relationship between Project Language and Affected Products type"/>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function Repositories() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <RepositoriesChartsProvider>
                        <RepositoriesCharts/>
                    </RepositoriesChartsProvider>
                    <RepositoriesPageProvider>
                        <RepositoriesTable/>
                    </RepositoriesPageProvider>
                </div>
            </div>
        </>
    )
}