'use client';
import React from "react";

import "styles/tailwind.css";
import {ProductsPageProvider, useProductsPage} from "../../context/products";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";

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

export default function Products() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <ProductsPageProvider>
                        <ProductsTable/>
                    </ProductsPageProvider>
                </div>
            </div>
        </>
    )
}