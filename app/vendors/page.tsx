'use client';
import React from "react";

import "styles/tailwind.css";
import {VendorsPageProvider, useVendorsPage} from "../../context/vendors";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";

function VendorsTable() {
    const { headers, rows, currentPage, setPage, pagination } = useVendorsPage();

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

export default function Vendors() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <VendorsPageProvider>
                        <VendorsTable/>
                    </VendorsPageProvider>
                </div>
            </div>
        </>
    )
}