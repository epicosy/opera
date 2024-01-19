'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const PRODUCTS_CHARTS_DATA = gql`
    query {
        configsCountByProduct{
            key
            value
        },
        vulnsCountByProduct{
            key
            value
        },
        swTypeCount{
            key
            value
        }
    }
`;


interface ProductsChartsContextProps {
    configsCountByProduct: Dict<string>;
    vulnsCountByProduct: Dict<string>;
    swTypeCount: Dict<string>;
}

const ProductsChartsContext = createContext<ProductsChartsContextProps>({
    configsCountByProduct: {},
    vulnsCountByProduct: {},
    swTypeCount: {}
} as ProductsChartsContextProps);


export const ProductsChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const productsChartsDataQuery = useQuery(PRODUCTS_CHARTS_DATA, {client});

    if (productsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (productsChartsDataQuery.error){
        return <p>Error loading charts data :(</p>;
    }

    const configsCountByProduct = productsChartsDataQuery.data?.configsCountByProduct;
    const vulnsCountByProduct = productsChartsDataQuery.data?.vulnsCountByProduct;
    const swTypeCount = productsChartsDataQuery.data?.swTypeCount;

    return (
        <ProductsChartsContext.Provider value={{configsCountByProduct, vulnsCountByProduct, swTypeCount}}>
            {children}
        </ProductsChartsContext.Provider>
    )
}

export const useProductsCharts = () => useContext(ProductsChartsContext);
