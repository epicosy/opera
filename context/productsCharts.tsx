'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;
import {PRODUCTS_CHARTS_DATA} from "../src/graphql/queries/products";

interface ProductsChartsContextProps {
    configsCountByProduct: { key: string, value: number }[];
    vulnsCountByProduct: { key: string, value: number }[];
    swTypeCount: Dict<string>;
}

const ProductsChartsContext = createContext<ProductsChartsContextProps>({
    configsCountByProduct: {},
    vulnsCountByProduct: {},
    swTypeCount: {}
} as ProductsChartsContextProps);


export const ProductsChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const productsChartsDataQuery = useQuery(PRODUCTS_CHARTS_DATA);

    if (productsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (productsChartsDataQuery.error){
        console.error("Error loading charts data:",productsChartsDataQuery.error);
    }

    const configsCountByProduct = productsChartsDataQuery.data?.configsCountByProduct || [];
    const vulnsCountByProduct = productsChartsDataQuery.data?.vulnsCountByProduct || [];
    const swTypeCount = productsChartsDataQuery.data?.swTypeCount || [];

    return (
        <ProductsChartsContext.Provider value={{configsCountByProduct, vulnsCountByProduct, swTypeCount}}>
            {children}
        </ProductsChartsContext.Provider>
    )
}

export const useProductsCharts = () => useContext(ProductsChartsContext);
