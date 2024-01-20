'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const CONFIGS_CHARTS_DATA = gql`
    query {
        configsPartCount{
            key
            values {
                key
                value
            }
        },
        configsVulnsCount{
            key
            value
        }
    }
`;

interface ConfigsChartsContextProps {
    configsPartCount: { key: string; values: { key: string; value: number }[] }[];
    configsVulnsCount: { key: string; value: number }[];
}

const ConfigsChartsContext = createContext<ConfigsChartsContextProps>({
    configsPartCount: {},
    configsVulnsCount: {}
} as ConfigsChartsContextProps);

export const ConfigsChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const configsChartsDataQuery = useQuery(CONFIGS_CHARTS_DATA, {client});

    if (configsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (configsChartsDataQuery.error){
        return <p>Error loading charts data :(</p>;
    }

    const configsPartCount = configsChartsDataQuery.data?.configsPartCount;
    const configsVulnsCount = configsChartsDataQuery.data?.configsVulnsCount;

    return (
        <ConfigsChartsContext.Provider value={{configsPartCount, configsVulnsCount}}>
            {children}
        </ConfigsChartsContext.Provider>
    )
}

export const useConfigsCharts = () => useContext(ConfigsChartsContext);
