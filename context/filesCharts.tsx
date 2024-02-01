'use client';

import React, {createContext, useContext, FC, ReactNode} from "react";
import {useQuery} from "@apollo/client";
import Dict = NodeJS.Dict;
import {FILES_CHARTS_DATA} from "../src/graphql/queries/files";


interface FilesChartsContextProps {
    filesExtensions: Dict<string>,
    filesChangesCount: {key: string, value: number}[],
    filesStatuses: Dict<string>,
    languageExtensionLinksCount: { at: string; to: string; count: number }[]
}

const FilesChartsContext = createContext<FilesChartsContextProps>({
    filesExtensions: {},
    filesChangesCount: {},
    filesStatuses: {},
    languageExtensionLinksCount: {}
} as FilesChartsContextProps);

export const FilesChartsProvider: FC<{children: ReactNode}> = ({children}) => {
    const filesChartsDataQuery = useQuery(FILES_CHARTS_DATA);

    if (filesChartsDataQuery.loading) return <p>Loading charts data ...</p>;
    if (filesChartsDataQuery.error){
        console.error("Error loading charts data:", filesChartsDataQuery.error);
    }

    const filesExtensions = filesChartsDataQuery.data?.filesExtensions || [];
    const filesChangesCount = filesChartsDataQuery.data?.filesChangesCount || [];
    const filesStatuses = filesChartsDataQuery.data?.filesStatuses || [];
    const languageExtensionLinksCount = filesChartsDataQuery.data?.languageExtensionLinksCount || [];

    return (
        <FilesChartsContext.Provider value={{filesExtensions, filesChangesCount, filesStatuses, languageExtensionLinksCount}}>
            {children}
        </FilesChartsContext.Provider>
    )
}

export const useFilesChartsContext = () => useContext(FilesChartsContext);
