'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const VENDORS_CHARTS_DATA = gql`
    query {
        productsCountByVendor{   
            key
            value
        },
        configsCountByVendor{
            key
            value
        },
        vulnsCountByVendor{
            key
            value
        }
    }
`;

interface VendorsChartsContextProps {
    productsCountByVendor: Dict<string>;
    configsCountByVendor: Dict<string>;
    vulnsCountByVendor: Dict<string>;
}

const VendorsChartsContext = createContext<VendorsChartsContextProps>({
    productsCountByVendor: {},
    configsCountByVendor: {},
    vulnsCountByVendor: {}
} as VendorsChartsContextProps);


export const VendorsChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const vendorsChartsDataQuery = useQuery(VENDORS_CHARTS_DATA, {client});

    if (vendorsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (vendorsChartsDataQuery.error){
        return <p>Error loading charts data :(</p>;
    }

    const productsCountByVendor = vendorsChartsDataQuery.data?.productsCountByVendor;
    const configsCountByVendor = vendorsChartsDataQuery.data?.configsCountByVendor;
    const vulnsCountByVendor = vendorsChartsDataQuery.data?.vulnsCountByVendor;

    return (
        <VendorsChartsContext.Provider value={{productsCountByVendor, configsCountByVendor, vulnsCountByVendor}}>
            {children}
        </VendorsChartsContext.Provider>
    )
}

export const useVendorsCharts = () => useContext(VendorsChartsContext);

