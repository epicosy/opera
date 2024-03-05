'use client';
import React from "react";

import "styles/tailwind.css";
import CardFilterPaginationTable from "../../../components/Cards/CardFilterPaginationTable";
import {CommitPageProvider, useCommitsPage} from "../../../context/commits";
import CardPieChart from "../../../components/Cards/cardPieChart";
import {CommitChartsProvider, useCommitsCharts} from "../../../context/commitsCharts";
import CardBarChart from "../../../components/Cards/CardBarChart";
import {GraphQLProvider} from "../../../context/graphql";

function CommitTable() {
    const { headers, rows, currentPage, setPage, pagination} = useCommitsPage();

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

function CommitCharts() {
    const { commitKindCount, commitsAvailability, commitsState, commitsFilesCount, commitsChangesCount } = useCommitsCharts();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                    <CardPieChart data={commitKindCount} title="Kind Distribution" fields={["Kind", "Count"]}/>
                </div>
                <div className="flex-col w-2/6 pl-4">
                    <CardPieChart data={commitsAvailability} title="Commits Availability"
                                  fields={['Availability', 'Count']} />
                </div>
                <div className="flex-col w-2/6 pl-4">
                    <CardPieChart data={commitsState} title="Commits State" fields={['State', 'Count']} />
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                    <CardBarChart data={commitsFilesCount} title="Distribution of the number of files per commit (count > 100)"
                                  fields={['#Files', 'Count']} filterCounts={100} />
                </div>
                <div className="flex-col w-2/6 pl-4">
                    <CardBarChart data={commitsChangesCount} title="Distribution of the number of changes per commit (count > 50)"
                                  fields={['#Changes', 'Count']} filterCounts={50} />
                </div>
            </div>
        </div>
    );
}

export default function Commits() {
    const graphqlUri = process.env.GRAPHQL_API || 'http://localhost:4000/graphql';

    let defaultHeaders: Record<string, any > = {
        'client-name': 'opera',
        'client-version': process.env.npm_package_version || ''
    };

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <GraphQLProvider uri={graphqlUri} headers={defaultHeaders}>
                        <CommitChartsProvider>
                            <CommitCharts/>
                        </CommitChartsProvider>
                        <CommitPageProvider>
                            <CommitTable/>
                        </CommitPageProvider>
                    </GraphQLProvider>
                </div>
            </div>
        </>
    )
}
