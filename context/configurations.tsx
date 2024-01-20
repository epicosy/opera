'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {ConfigurationsPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const LIST_CONFIGURATIONS = gql`
    query configurationsPage($page: Int!, $per_page: Int!) {
        configurationsPage(page: $page, perPage: $per_page){
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements{
                id
                vulnerable
                part
                vendorId
                productId
                version
                update
                edition
                language
                swEdition
                targetSw
                targetHw
                other
                vulnerabilityId
            }
        }
    }
`;

interface ConfigurationsContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    pagination: ConfigurationsPagination;
    headers: string[];
    rows: string[][];
}

const ConfigurationsPageContext = createContext<ConfigurationsContextProps>({
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
    rows: []
} as ConfigurationsContextProps);

export const ConfigurationsPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const configurationsPageQuery = useQuery(LIST_CONFIGURATIONS,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE}}
    );

    if (configurationsPageQuery.loading) return <p>Loading configurations...</p>;
    if (configurationsPageQuery.error){
        return <p>Error loading configurations :(</p>;
    }

    const pagination: ConfigurationsPagination = configurationsPageQuery.data?.configurationsPage;
    const headers = ["Id", "Vulnerable", "Part", "Vendor ID", "Product ID", "Version", "Update", "Edition", "Language",
        "SwEdition", "TargetSw", "TargetHw", "Other", "VulnerabilityId"];

    const rows = pagination.elements.map((config: any) => {
        return [config.id, config.vulnerable, config.part, config.vendorId, config.productId, config.version, config.update,
            config.edition, config.language, config.swEdition, config.targetSw, config.targetHw, config.other,
            config.vulnerabilityId]
    });

    return (
        <ConfigurationsPageContext.Provider value={{currentPage, setPage, headers, rows, pagination}}>
            {children}
        </ConfigurationsPageContext.Provider>
    )
}

export const useConfigurationsPage = () => useContext(ConfigurationsPageContext);
