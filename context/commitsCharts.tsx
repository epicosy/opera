'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const COMMITS_CHARTS_DATA = gql`
    query {
        commitKindCount{
            key
            value
        },
        commitsAvailability{
            key
            value
        },
        commitsState{
            key
            value
        },
        commitsFilesCount{
            key
            value
        },
        commitsChangesCount{
            key
            value
        }
    }
`;


interface CommitsChartsContextProps {
    commitKindCount: {key: string, value: number}[];
    commitsAvailability: {key: string, value: number}[];
    commitsState: {key: string, value: number}[];
    commitsFilesCount: {key: string, value: number}[];
    commitsChangesCount: {key: string, value: number}[];
}

const CommitChartsContext = createContext<CommitsChartsContextProps>({
    commitKindCount: {},
    commitsAvailability: {},
    commitsState: {},
    commitsFilesCount: {},
    commitsChangesCount: {}
} as CommitsChartsContextProps);

export const CommitChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const commitsChartsDataQuery = useQuery(COMMITS_CHARTS_DATA, {client});

    if (commitsChartsDataQuery.loading) return <p>Loading charts data...</p>;
    if (commitsChartsDataQuery.error){
        return <p>Error loading charts data :(</p>;
    }

    const commitKindCount = commitsChartsDataQuery.data?.commitKindCount;
    const commitsAvailability = commitsChartsDataQuery.data?.commitsAvailability;
    const commitsState = commitsChartsDataQuery.data?.commitsState;
    const commitsFilesCount = commitsChartsDataQuery.data?.commitsFilesCount;
    const commitsChangesCount = commitsChartsDataQuery.data?.commitsChangesCount

    return (
        <CommitChartsContext.Provider value={{commitKindCount, commitsAvailability, commitsState, commitsFilesCount,
            commitsChangesCount}}>
            {children}
        </CommitChartsContext.Provider>
    )
}

export const useCommitsCharts = () => useContext(CommitChartsContext);
