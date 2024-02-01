'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {useQuery} from "@apollo/client";
import {CONFIGS_CHARTS_DATA} from "../src/graphql/queries/configurations";


interface ConfigsChartsContextProps {
    configsPartCount: { key: string; values: { key: string; value: number }[] }[];
    configsVulnsCount: { key: string; value: number }[];
}

const ConfigsChartsContext = createContext<ConfigsChartsContextProps>({
    configsPartCount: {},
    configsVulnsCount: {}
} as ConfigsChartsContextProps);

export const ConfigsChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const configsChartsDataQuery = useQuery(CONFIGS_CHARTS_DATA);

    if (configsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (configsChartsDataQuery.error){
        console.log("Error loading configuration charts:", configsChartsDataQuery.error);
    }

    const configsPartCount = configsChartsDataQuery.data?.configsPartCount || [];
    const configsVulnsCount = configsChartsDataQuery.data?.configsVulnsCount || [];

    return (
        <ConfigsChartsContext.Provider value={{configsPartCount, configsVulnsCount}}>
            {children}
        </ConfigsChartsContext.Provider>
    )
}

export const useConfigsCharts = () => useContext(ConfigsChartsContext);
