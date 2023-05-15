'use client'

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {ProductsPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const PRODUCTS_LIST = gql`
    query productsPage($page: Int!, $per_page: Int!) {
        productsPage(page: $page, perPage: $per_page){
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
                swType
                configurationsCount
                vulnerabilitiesCount
            }
        }
}`;

interface ProductsPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: ProductsPagination;
    headers: string[];
    rows: string[][];
}

const ProductsPageContext = createContext<ProductsPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    pagination: {},
    headers: [],
    rows: [],
} as ProductsPageContextProps);

export const ProductsPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const productsPageQuery = useQuery(PRODUCTS_LIST,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (productsPageQuery.loading) return <p>Loading products...</p>;
    if (productsPageQuery.error){
        return <p>Error loading products :(</p>;
    }

    const pagination: ProductsPagination = productsPageQuery.data?.productsPage;
    const headers = ["Id", "Name", "Product Type", "Configurations Count", "Vulnerabilities Count"];

    const rows = pagination.elements.map((product: Dict<string>) => {
        return [
            product.id,
            product.name,
            product.swType,
            product.configurationsCount,
            product.vulnerabilitiesCount,
        ];
    });

    return (
        <ProductsPageContext.Provider value={{currentPage, setPage, pagination, headers, rows}}>
            {children}
        </ProductsPageContext.Provider>
    );
};

export const useProductsPage = () => useContext(ProductsPageContext);