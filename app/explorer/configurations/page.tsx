'use client';
import React from "react";

import "styles/tailwind.css";
import CardFilterPaginationTable from "../../../components/Cards/CardFilterPaginationTable";
import {ConfigurationsPageProvider, useConfigurationsPage} from "../../../context/configurations";
import CardNestedPieChart from "../../../components/Cards/cardNestedPieChart";
import {ConfigsChartsProvider, useConfigsCharts} from "../../../context/configurationsCharts";
import CardBarChart from "../../../components/Cards/CardBarChart";
import {GraphQLProvider} from "../../../context/graphql";

function CommitTable() {
    const { headers, rows, currentPage, setPage, pagination} = useConfigurationsPage();

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

function ConfigsCharts() {
    const { configsPartCount, configsVulnsCount } = useConfigsCharts();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                    <CardNestedPieChart data={configsPartCount} title="Part Distribution"
                                        fields={["Part", "Vulnerable Count", "Non-Vulnerable Count"]}/>
                </div>
                <div className="flex-col w-4/6 pl-4">
                    <CardBarChart data={configsVulnsCount} fields={['#Configs.', 'Count']} filterCounts={50}
                                  title="Distribution of the number of configs per vuln (count > 50)."/>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                </div>
            </div>
        </div>
    );
}

export default function Configurations() {
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
                        <ConfigsChartsProvider>
                            <ConfigsCharts/>
                        </ConfigsChartsProvider>
                        <ConfigurationsPageProvider>
                            <CommitTable/>
                        </ConfigurationsPageProvider>
                    </GraphQLProvider>
                </div>
            </div>
        </>
    )
}
