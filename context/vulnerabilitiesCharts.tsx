'use client';

import React, {createContext, FC, ReactNode, useContext} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const VULNS_CHARTS_DATA = gql`
    query {
        cweCounts{
            key
            value
        },
        vulnsSeverity{
            key
            value
        },
        vulnsExploitability{
            key
            value
        },
        cweMultiplicity{
            key
            value
        },
        vulnsCountBySofDevView{
            key
            value
        }
    }
`;

interface VulnerabilitiesChartsContextProps {
    cweCounts: Dict<string>;
    vulnsSeverity: Dict<string>;
    vulnsExploitability: Dict<string>;
    cweMultiplicity: Dict<string>;
    vulnsCountBySofDevView: Dict<string>;
}

const VulnerabilitiesChartsContext = createContext<VulnerabilitiesChartsContextProps>({
    cweCounts: {},
    vulnsSeverity: {},
    vulnsExploitability: {},
    cweMultiplicity: {},
    vulnsCountBySofDevView: {}
} as VulnerabilitiesChartsContextProps);

export const VulnerabilitiesChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const vulnsChartsDataQuery = useQuery(VULNS_CHARTS_DATA, {client});

    const isError = vulnsChartsDataQuery.error;

    const cweCounts = vulnsChartsDataQuery.data?.cweCounts || [];
    const vulnsSeverity = vulnsChartsDataQuery.data?.vulnsSeverity || [];
    const vulnsExploitability = vulnsChartsDataQuery.data?.vulnsExploitability || [];
    const cweMultiplicity = vulnsChartsDataQuery.data?.cweMultiplicity || [];
    const vulnsCountBySofDevView = vulnsChartsDataQuery.data?.vulnsCountBySofDevView || [];

    return (
        <VulnerabilitiesChartsContext.Provider value={{cweCounts, vulnsSeverity, vulnsExploitability, cweMultiplicity,
            vulnsCountBySofDevView}}>
            {isError ? null : children}
        </VulnerabilitiesChartsContext.Provider>
    );
}

export const useVulnerabilitiesCharts = () => useContext(VulnerabilitiesChartsContext);
