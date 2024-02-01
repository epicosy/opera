'use client'

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {VendorsPagination} from "../typings";
import {useQuery} from "@apollo/client";
import {VENDORS_LIST} from "../src/graphql/queries/vendors";

const PAGE_SIZE = 15;

interface VendorsPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: VendorsPagination;
    headers: string[];
    rows: (string | number)[][];
}

const VendorsPageContext = createContext<VendorsPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    pagination: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalResults: 0,
        page: 1,
        perPage: 10,
        pages: [],
        elements: [],
    },
    headers: [],
    rows: [],
} as VendorsPageContextProps);

export const VendorsPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const vendorsPageQuery = useQuery(VENDORS_LIST,{variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (vendorsPageQuery.loading) return <p>Loading vendors...</p>;
    if (vendorsPageQuery.error){
        console.error("Error loading vendors:", vendorsPageQuery.error);
    }

    const pagination: VendorsPagination = vendorsPageQuery.data?.vendorsPage;
    const headers = ["Id", "Name", "Products Count", "Configurations Count", "Vulnerabilities Count"];
    const rows = pagination?.elements.map((element) => {
        return [element.id, element.name, element.productsCount, element.configurationsCount,
            element.vulnerabilitiesCount];
    }) || [];

    return (
        <VendorsPageContext.Provider value={{currentPage, setPage, pagination, headers, rows}}>
            {children}
        </VendorsPageContext.Provider>
    );
};

export const useVendorsPage = () => useContext(VendorsPageContext);
