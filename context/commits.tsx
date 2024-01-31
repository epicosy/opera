'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {CommitsPagination} from "../typings";
import {useQuery} from "@apollo/client";

import {LIST_COMMITS} from "../src/graphql/queries/commits";

const PAGE_SIZE = 15;





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
    const commitsPageQuery = useQuery(LIST_COMMITS,{ variables: {page: currentPage, per_page: PAGE_SIZE}}
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
