'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;
import {REPOS_CHARTS_DATA} from "../src/graphql/queries/repositories";

interface RepositoriesChartsContextProps {
    repositoriesAvailability: Dict<string>,
    repositoriesCommitsFrequency: {key: string, value: number}[],
    repositoriesLanguageCount: Dict<string>,
    topicsCount: Dict<string>,
    langProductLinksCount: {at: string, to: string, count: number}[],
    repositoriesSoftwareTypeCount: Dict<string>
}

const RepositoriesChartsContext = createContext<RepositoriesChartsContextProps>({
    repositoriesAvailability: {},
    repositoriesCommitsFrequency: {},
    repositoriesLanguageCount: {},
    topicsCount: {},
    langProductLinksCount: {},
    repositoriesSoftwareTypeCount: {}
} as RepositoriesChartsContextProps);

export const RepositoriesChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const reposChartsDataQuery = useQuery(REPOS_CHARTS_DATA);

    if (reposChartsDataQuery.loading) return <p>Loading charts data ...</p>;
    if (reposChartsDataQuery.error){
        console.error("Error loading charts data:", reposChartsDataQuery.error);
    }

    const repositoriesAvailability = reposChartsDataQuery.data?.repositoriesAvailability || [];
    const repositoriesCommitsFrequency = reposChartsDataQuery.data?.repositoriesCommitsFrequency || [];
    const repositoriesLanguageCount = reposChartsDataQuery.data?.repositoriesLanguageCount || [];
    const topicsCount = reposChartsDataQuery.data?.topicsCount || [];
    const langProductLinksCount = reposChartsDataQuery.data?.langProductLinksCount || [];
    const repositoriesSoftwareTypeCount = reposChartsDataQuery.data?.repositoriesSoftwareTypeCount || [];

    return (
        <RepositoriesChartsContext.Provider value={{repositoriesAvailability, repositoriesCommitsFrequency,
            repositoriesLanguageCount, topicsCount, langProductLinksCount, repositoriesSoftwareTypeCount}}>
            {children}
        </RepositoriesChartsContext.Provider>
    )
}

export const useRepositoriesCharts = () => useContext(RepositoriesChartsContext);
