'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {RepositoriesPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const LIST_REPOSITORIES = gql`
    query repositoriesPage($page: Int!, $per_page: Int!) {
        repositoriesPage(page: $page, perPage: $per_page){
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements{
                id
                name
                owner
                commitsCount
            }
        }
    }
`;

interface RepositoriesPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: RepositoriesPagination;
    headers: string[];
    rows: string[][];
}

const RepositoriesPageContext = createContext<RepositoriesPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    pagination: {},
    headers: [],
    rows: [],
} as RepositoriesPageContextProps);

export const RepositoriesPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const repositoriesPageQuery = useQuery(LIST_REPOSITORIES,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (repositoriesPageQuery.loading) return <p>Loading repositories...</p>;
    if (repositoriesPageQuery.error){
        return <p>Error loading repositories :(</p>;
    }

    const pagination: RepositoriesPagination = repositoriesPageQuery.data?.repositoriesPage;
    const headers = ["Id", "Owner", "Name", "Commits Count"];

    const rows = pagination.elements.map((repo: any) => {
        return [repo.id, repo.owner, repo.name, repo.commitsCount]
    });

    return (
        <RepositoriesPageContext.Provider value={{currentPage, setPage, headers, rows, pagination}}>
            {children}
        </RepositoriesPageContext.Provider>
    )
}

export const useRepositoriesPage = () => useContext(RepositoriesPageContext);
