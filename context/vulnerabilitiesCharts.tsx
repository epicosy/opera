'use client';

import React, {createContext, FC, ReactNode, useContext} from "react";
import {useQuery} from "@apollo/client";
import {VULNS_CHARTS_DATA} from "../src/graphql/queries";


interface GrapheneCount {
    key: string;
    value: number;
}


interface VulnerabilitiesChartsContextProps {
    cweCounts: GrapheneCount[];
    vulnsSeverity: GrapheneCount[];
    vulnsExploitability: GrapheneCount[];
    cweMultiplicity: GrapheneCount[];
    vulnsCountBySofDevView: GrapheneCount[];
}


const VulnerabilitiesChartsContext = createContext<VulnerabilitiesChartsContextProps>({
    cweCounts: [],
    vulnsSeverity: [],
    vulnsExploitability: [],
    cweMultiplicity: [],
    vulnsCountBySofDevView: []
} as VulnerabilitiesChartsContextProps);

export const VulnerabilitiesChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const {data, loading, error} = useQuery<VulnerabilitiesChartsContextProps>(VULNS_CHARTS_DATA);

    const cweCounts = data?.cweCounts || [];
    const vulnsSeverity = data?.vulnsSeverity || [];
    const vulnsExploitability = data?.vulnsExploitability || [];
    const cweMultiplicity = data?.cweMultiplicity || [];
    const vulnsCountBySofDevView = data?.vulnsCountBySofDevView || [];

    return (
        <VulnerabilitiesChartsContext.Provider value={{cweCounts, vulnsSeverity, vulnsExploitability, cweMultiplicity,
            vulnsCountBySofDevView}}>
            {children}
        </VulnerabilitiesChartsContext.Provider>
    );
}

export const useVulnerabilitiesCharts = () => useContext(VulnerabilitiesChartsContext);
