'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const FILES_CHARTS_DATA = gql`
    query filesCommitCounts {
        filesExtensions{
            key
            value
        },
        filesChangesCount{
            key
            value
        },
        filesStatuses{
            key
            value
        },
        languageExtensionLinksCount(filterCounts: 200){
            at
            to
            count
        }
    }
`;

interface FilesChartsContextProps {
    filesExtensions: Dict<string>,
    filesChangesCount: Dict<string>,
    filesStatuses: Dict<string>,
    languageExtensionLinksCount: Dict<string>
}

const FilesChartsContext = createContext<FilesChartsContextProps>({
    filesExtensions: {},
    filesChangesCount: {},
    filesStatuses: {},
    languageExtensionLinksCount: {}
} as FilesChartsContextProps);

export const FilesChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const filesChartsDataQuery = useQuery(FILES_CHARTS_DATA,{client});

    if (filesChartsDataQuery.loading) return <p>Loading charts data ...</p>;
    if (filesChartsDataQuery.error){
        return <p>Error loading charts data :(</p>;
    }

    const filesExtensions = filesChartsDataQuery.data?.filesExtensions;
    const filesChangesCount = filesChartsDataQuery.data?.filesChangesCount;
    const filesStatuses = filesChartsDataQuery.data?.filesStatuses;
    const languageExtensionLinksCount = filesChartsDataQuery.data?.languageExtensionLinksCount;

    return (
        <FilesChartsContext.Provider value={{filesExtensions, filesChangesCount, filesStatuses, languageExtensionLinksCount}}>
            {children}
        </FilesChartsContext.Provider>
    )
}

export const useFilesChartsContext = () => useContext(FilesChartsContext);
