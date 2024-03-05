'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {useQuery} from "@apollo/client";
import {Vulnerability} from "../typings";
import {
    ASSIGNERS_COUNTS_QUERY,
    LATEST_VULNS_QUERY, STATS_QUERY,
    TAGS_COUNTS_QUERY,
    VULNS_BY_YEAR_QUERY
} from "../src/graphql/queries";


interface PanelPageContextProps {
    stats: {key: string, value: number}[];
    assignersCount: {key: string, value: number}[];
    tagsCount: {key: string, value: number}[];
    vulnsByYearCount: {key: string, value: number}[];
    latestVulns: Vulnerability[];
    loadingAssignersCount: boolean;
    loadingTagsCount: boolean;
    loadingVulnsByYearCount: boolean;
    loadingLatestVulns: boolean;
    loadingStats: boolean;
    errorStats: boolean;
    latestVulnsError: boolean;
}

const PanelPageContext = createContext<PanelPageContextProps>({
    stats: [],
    assignersCount: [],
    tagsCount: [],
    vulnsByYearCount: [],
    latestVulns: [],
    loadingAssignersCount: true,
    loadingTagsCount: true,
    loadingVulnsByYearCount: true,
    loadingLatestVulns: true,
    loadingStats: true,
    errorStats: false,
    latestVulnsError: false
} as PanelPageContextProps);

export const PanelPageProvider: FC<{children: ReactNode}> = ({children}) => {
    // Queries
    const assigners_counts_query = useQuery(ASSIGNERS_COUNTS_QUERY);
    const tags_counts_query = useQuery(TAGS_COUNTS_QUERY);
    const vulns_by_year_query = useQuery(VULNS_BY_YEAR_QUERY);
    const latest_vulns_query = useQuery(LATEST_VULNS_QUERY);
    const stats_query = useQuery(STATS_QUERY);

    if (assigners_counts_query.error) console.error("Error loading assigners counts:", assigners_counts_query.error);
    if (tags_counts_query.error) console.error("Error loading tags counts:", tags_counts_query.error);
    if (vulns_by_year_query.error) console.error("Error loading vulnerabilities by year:", vulns_by_year_query.error);
    if (latest_vulns_query.error) console.error("Error loading latest vulnerabilities:", latest_vulns_query.error);
    if (stats_query.error) console.error("Error loading stats:", stats_query.error);

    const stats = stats_query.data?.stats || [];
    const assignersCount = assigners_counts_query.data?.assignersCount || [];
    const tagsCount = tags_counts_query.data?.tagsCount || [];
    const vulnsByYearCount = vulns_by_year_query.data?.vulnsByYear || [];
    const latestVulns = latest_vulns_query.data?.vulnerabilities || [];
    const loadingAssignersCount = assigners_counts_query.loading;
    const loadingTagsCount = tags_counts_query.loading;
    const loadingVulnsByYearCount = vulns_by_year_query.loading;
    const loadingLatestVulns = latest_vulns_query.loading;
    const loadingStats = stats_query.loading;
    const errorStats = stats_query.error !== undefined;
    const latestVulnsError = latest_vulns_query.error !== undefined;

    return (
        <PanelPageContext.Provider value={{
            stats,
            assignersCount,
            tagsCount,
            vulnsByYearCount,
            latestVulns,
            loadingAssignersCount,
            loadingTagsCount,
            loadingVulnsByYearCount,
            loadingLatestVulns,
            loadingStats,
            errorStats,
            latestVulnsError
        }}>
            {children}
        </PanelPageContext.Provider>
    );
}

export const usePanelPage = () => useContext(PanelPageContext);
