'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {CommitsPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

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
                available
                state
                changes
                additions
                deletions
                filesCount
                parentsCount
                vulnerabilityId
                repositoryId
            }
        }
    }
`;


interface CommitsPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: CommitsPagination;
    headers: string[];
    rows: string[][];
}

const CommitPageContext = createContext<CommitsPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    pagination: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalResults: 0,
        page: 1,
        perPage: 10,
        pages: [],
        elements: [],
    },
    headers: [],
    rows: [],
} as CommitsPageContextProps);

export const CommitPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const commitsPageQuery = useQuery(LIST_COMMITS,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (commitsPageQuery.loading) return <p>Loading commits...</p>;
    if (commitsPageQuery.error){
        return <p>Error loading commits :(</p>;
    }

    const pagination: CommitsPagination = commitsPageQuery.data?.commitsPage;
    const headers = ["URL", "Kind", "Available", "State", "Changes", "Additions", "Deletions", "#Files", "#Parents",
        "Vulnerability Id", "Repository Id"];

    const rows = pagination.elements.map((commit: any) => {
        return [commit.url, commit.kind, commit.available, commit.state, commit.changes, commit.additions,
            commit.deletions, commit.filesCount, commit.parentsCount, commit.vulnerabilityId, commit.repositoryId]
    });

    return (
        <CommitPageContext.Provider value={{currentPage, setPage, pagination, headers, rows}}>
            {children}
        </CommitPageContext.Provider>
    )
}

export const useCommitsPage = () => useContext(CommitPageContext);
