'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {CommitsPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const LIST_COMMITS = gql`
    query commitsPage($page: Int!, $per_page: Int!) {
        commitsPage(page: $page, perPage: $per_page) {
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements {
                id
                url
                kind
                vulnerabilityId
                repositoryId
            }
        }
    }
`;

const COUNT_COMMIT_KINDS = gql`
    query {
        commitKindCount{
            key
            value
        }
    }
`;


interface CommitsPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: CommitsPagination;
    cwe_ids: number[];
    severity: string[];
    headers: string[];
    rows: string[][];
    kindCounts: Dict<string>;
}

const CommitPageContext = createContext<CommitsPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    pagination: {},
    headers: [],
    rows: [],
    kindCounts: {},
} as CommitsPageContextProps);

export const CommitPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const commitsPageQuery = useQuery(LIST_COMMITS,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}}
    );
    const kindCountsQuery = useQuery(COUNT_COMMIT_KINDS, {client});

    if (commitsPageQuery.loading) return <p>Loading commits...</p>;
    if (commitsPageQuery.error){
        return <p>Error loading commits :(</p>;
    }

    const pagination: CommitsPagination = commitsPageQuery.data?.commitsPage;
    const headers = ["Hash", "URL", "Kind", "Vulnerability Id", "RepositoryId"];

    const rows = pagination.elements.map((commit: any) => {
        return [commit.id, commit.url, commit.kind, commit.vulnerabilityId, commit.repositoryId]
    });

    if (kindCountsQuery.loading) return <p>Loading commit kinds...</p>;
    if (kindCountsQuery.error){
        return <p>Error loading commit kinds :(</p>;
    }
    const kindCounts = kindCountsQuery.data?.commitKindCount;

    return (
        <CommitPageContext.Provider value={{currentPage, setPage, headers, rows, pagination, kindCounts}}>
            {children}
        </CommitPageContext.Provider>
    )
}

export const useCommitsPage = () => useContext(CommitPageContext);
