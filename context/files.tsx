'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {FilesPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const LIST_FILES = gql`
    query filesPage($page: Int!, $per_page: Int!) {
        commitFilesPage(page: $page, perPage: $per_page) {
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements {
                id
                filename
                extension
                changes
                additions
                deletions
                status
                patch
                rawUrl
                commitId
            }
        }
    }
`;


interface FilesPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: FilesPagination;
    headers: string[];
    rows: string[][];
}

const FilesPageContext = createContext<FilesPageContextProps>({
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
} as FilesPageContextProps);

export const FilesPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const filesPageQuery = useQuery(LIST_FILES,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}});

    if (filesPageQuery.loading) return <p>Loading files data ...</p>;
    if (filesPageQuery.error){
        return <p>Error loading files data :(</p>;
    }

    const data = filesPageQuery.data.commitFilesPage;

    const headers = ["Filename", "Extension", "Changes", "Additions", "Deletions", "Status"];
    const rows = data.elements.map((file: any) => {
        return [file.filename, file.extension, file.changes, file.additions, file.deletions, file.status];
    });

    return (
        <FilesPageContext.Provider value={{currentPage, setPage, pagination: data, headers, rows}}>
            {children}
        </FilesPageContext.Provider>
    )
}

export const useFilesPage = () => useContext(FilesPageContext);
