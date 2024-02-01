'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {useQuery} from "@apollo/client";
import {VENDORS_CHARTS_DATA} from "../src/graphql/queries/vendors";


interface VendorsChartsContextProps {
    productsCountByVendor: {key: string, value: number}[];
    configsCountByVendor: {key: string, value: number}[];
    vulnsCountByVendor: {key: string, value: number}[];
}

const VendorsChartsContext = createContext<VendorsChartsContextProps>({
    productsCountByVendor: {},
    configsCountByVendor: {},
    vulnsCountByVendor: {}
} as VendorsChartsContextProps);


export const VendorsChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const vendorsChartsDataQuery = useQuery(VENDORS_CHARTS_DATA);

    if (vendorsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (vendorsChartsDataQuery.error){
        console.error("Error loading charts data:",vendorsChartsDataQuery.error);
    }

    const productsCountByVendor = vendorsChartsDataQuery.data?.productsCountByVendor || [];
    const configsCountByVendor = vendorsChartsDataQuery.data?.configsCountByVendor || []
    const vulnsCountByVendor = vendorsChartsDataQuery.data?.vulnsCountByVendor || [];

    return (
        <VendorsChartsContext.Provider value={{productsCountByVendor, configsCountByVendor, vulnsCountByVendor}}>
            {children}
        </VendorsChartsContext.Provider>
    )
}

export const useVendorsCharts = () => useContext(VendorsChartsContext);

