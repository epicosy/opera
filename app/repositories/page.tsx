'use client';
import React from "react";

import "styles/tailwind.css";
import {RepositoriesPageProvider, useRepositoriesPage} from "../../context/repositories";
import CardFilterPaginationTable from "../../components/Cards/CardFilterPaginationTable";

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

export default function Repositories() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <RepositoriesPageProvider>
                        <RepositoriesTable/>
                    </RepositoriesPageProvider>
                </div>
            </div>
        </>
    )
}