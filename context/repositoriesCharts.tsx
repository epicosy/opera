'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const REPOS_CHARTS_DATA = gql`
    query repositoriesCommitCounts {
        repositoriesCommitsFrequency{
            key
            value
        },
        repositoriesAvailability{
            key
            value
        },
        repositoriesLanguageCount{
            key
            value
        },
        topicsCount{
            key
            value
        },
        langProductLinksCount(filterCounts: 100){
            at
            to
            count
        }
    }
`;

interface RepositoriesChartsContextProps {
    repositoriesAvailability: Dict<string>,
    repositoriesCommitsFrequency: Dict<string>,
    repositoriesLanguageCount: Dict<string>,
    topicsCount: Dict<string>,
    langProductLinksCount: Dict<string>
}

const RepositoriesChartsContext = createContext<RepositoriesChartsContextProps>({
    repositoriesAvailability: {},
    repositoriesCommitsFrequency: {},
    repositoriesLanguageCount: {},
    topicsCount: {},
    langProductLinksCount: {}
} as RepositoriesChartsContextProps);

export const RepositoriesChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const reposChartsDataQuery = useQuery(REPOS_CHARTS_DATA,{client});

    if (reposChartsDataQuery.loading) return <p>Loading charts data ...</p>;
    if (reposChartsDataQuery.error){
        return <p>Error loading charts data :(</p>;
    }

    const repositoriesAvailability = reposChartsDataQuery.data?.repositoriesAvailability;
    const repositoriesCommitsFrequency = reposChartsDataQuery.data?.repositoriesCommitsFrequency;
    const repositoriesLanguageCount = reposChartsDataQuery.data?.repositoriesLanguageCount;
    const topicsCount = reposChartsDataQuery.data?.topicsCount;
    const langProductLinksCount = reposChartsDataQuery.data?.langProductLinksCount;


    return (
        <RepositoriesChartsContext.Provider value={{repositoriesAvailability, repositoriesCommitsFrequency,
            repositoriesLanguageCount, topicsCount, langProductLinksCount}}>
            {children}
        </RepositoriesChartsContext.Provider>
    )
}

export const useRepositoriesCharts = () => useContext(RepositoriesChartsContext);
