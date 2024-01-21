'use client'

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {VendorsPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const VENDORS_LIST = gql`
    query vendorsPage($page: Int!, $per_page: Int!) {
        vendorsPage(page: $page, perPage: $per_page){
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements{
                id
                name
                productsCount
                configurationsCount
                vulnerabilitiesCount
            }
        }
    }
`;

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
    const vendorsPageQuery = useQuery(VENDORS_LIST,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (vendorsPageQuery.loading) return <p>Loading vendors...</p>;
    if (vendorsPageQuery.error){
        return <p>Error loading vendors :(</p>;
    }

    const pagination: VendorsPagination = vendorsPageQuery.data?.vendorsPage;
    const headers = ["Id", "Name", "Products Count", "Configurations Count", "Vulnerabilities Count"];
    const rows = pagination.elements.map((element) => {
        return [element.id, element.name, element.productsCount, element.configurationsCount,
            element.vulnerabilitiesCount];
    });

    return (
        <VendorsPageContext.Provider value={{currentPage, setPage, pagination, headers, rows}}>
            {children}
        </VendorsPageContext.Provider>
    );
};

export const useVendorsPage = () => useContext(VendorsPageContext);
