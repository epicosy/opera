'use client'

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {ProductsPagination} from "../typings";
import {useQuery} from "@apollo/client";
import {PRODUCTS_LIST} from "../src/graphql/queries/products";

const PAGE_SIZE = 15;

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
} as ProductsPageContextProps);

export const ProductsPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const productsPageQuery = useQuery(PRODUCTS_LIST,{variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (productsPageQuery.loading) return <p>Loading products...</p>;
    if (productsPageQuery.error){
        console.error("Error loading products:", productsPageQuery.error);
    }

    const pagination: ProductsPagination = productsPageQuery.data?.productsPage;
    const headers = ["Id", "Name", "Product Type", "Configurations Count", "Vulnerabilities Count"];

    const rows = pagination?.elements.map((product: any) => {
        return [
            product.id,
            product.name,
            product.swType,
            product.configurationsCount,
            product.vulnerabilitiesCount,
        ];
    }) || [];

    return (
        <ProductsPageContext.Provider value={{currentPage, setPage, pagination, headers, rows}}>
            {children}
        </ProductsPageContext.Provider>
    );
};

export const useProductsPage = () => useContext(ProductsPageContext);