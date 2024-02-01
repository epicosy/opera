'use client';
import React from "react";

import "styles/tailwind.css";
import {ProductsPageProvider, useProductsPage} from "../../context/products";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";
import {ProductsChartsProvider, useProductsCharts} from "../../context/productsCharts";
import CardBarChart from "../../components/Cards/CardBarChart";
import CardPieChart from "../../components/Cards/cardPieChart";
import {GraphQLProvider} from "../../context/graphql";

function ProductsTable() {
    const { headers, rows, currentPage, setPage, pagination } = useProductsPage();

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


function ProductsCharts() {
    const { configsCountByProduct, vulnsCountByProduct, swTypeCount } = useProductsCharts();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex-col w-3/6">
                    <CardBarChart data={configsCountByProduct} title="Configs Count Distribution"
                                    fields={["#Configs", "Count"]}/>
                </div>
                <div className="flex-col w-3/6 pl-4">
                    <CardBarChart data={vulnsCountByProduct} title="Vulns Count Distribution"
                                    fields={["#Vulns", "Count"]}/>
                </div>
            </div>
            <div className="flex flex-row">
                <div className="flex-col w-2/6">
                    <CardPieChart data={swTypeCount} title="Software Type Distribution"
                                    fields={["Type", "Count"]}/>
                </div>
            </div>
        </div>
    );
}


export default function Products() {
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
                        <ProductsChartsProvider>
                            <ProductsCharts/>
                        </ProductsChartsProvider>
                        <ProductsPageProvider>
                            <ProductsTable/>
                        </ProductsPageProvider>
                    </GraphQLProvider>
                </div>
            </div>
        </>
    )
}