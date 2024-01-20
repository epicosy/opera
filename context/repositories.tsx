'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {RepositoriesPagination, Repository} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import DropdownWithCheckboxes from "../components/Dropdowns/CheckboxDropdown";
import Link from "next/link";

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });


const LIST_REPOSITORIES = gql`
    query repositoriesPage($page: Int!, $per_page: Int!, $availability: [Boolean]!, $language: [String]!) {
        repositoriesPage(page: $page, perPage: $per_page, availability: $availability, language: $language){
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
                available
                language
                topics
                commitsCount
            }
        },
        repositoriesLanguageCount{
            key
        }
    }
`;

interface RepositoriesPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    selectedAvailability: boolean[];
    setSelectedAvailability: Dispatch<SetStateAction<boolean[]>>;
    selectedLanguage: string[];
    setSelectedLanguage: Dispatch<SetStateAction<string[]>>;
    pagination: RepositoriesPagination;
    headers: (string | React.JSX.Element)[];
    rows: any[];
}

const RepositoriesPageContext = createContext<RepositoriesPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    selectedAvailability: [],
    setSelectedAvailability: () => {},
    selectedLanguage: [],
    setSelectedLanguage: () => {},
    pagination: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalResults: 0,
        page: 0,
        perPage: 10,
        pages: [],
        elements: []
    },
    headers: [],
    rows: []
} as RepositoriesPageContextProps);

export const RepositoriesPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const [selectedAvailability, setSelectedAvailability] = React.useState<boolean[]>([]);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string[]>([]);
    const repositoriesPageQuery = useQuery(LIST_REPOSITORIES,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE, availability: selectedAvailability,
                language: selectedLanguage}}
    );

    if (repositoriesPageQuery.loading) return <p>Loading repositories...</p>;
    if (repositoriesPageQuery.error){
        return <p>Error loading repositories :(</p>;
    }

    const pagination: RepositoriesPagination = repositoriesPageQuery.data?.repositoriesPage;
    const languages = repositoriesPageQuery.data?.repositoriesLanguageCount.map((lang: any) => lang.key);
    const availabilityDrop = <DropdownWithCheckboxes title="Available" items={[true, false, null]}
                                                     selectedItems={selectedAvailability}
                                                     onChange={setSelectedAvailability}/>
    const languagesDrop = <DropdownWithCheckboxes title="Language" items={languages}
                                                    selectedItems={selectedLanguage}
                                                    onChange={setSelectedLanguage}/>

    const headers = ["Id", "Owner", "Name", availabilityDrop, languagesDrop, "Topics", "Commits Count"];

    const rows = pagination.elements.map((repo: any) => {
        return [<Link href={`http://localhost:3005/repositories/${repo.id}/`} target="_blank"
                      className="text-blue-600 dark:text-blue-500 hover:underline" >{repo.id}</Link>,
            repo.owner, repo.name, repo.available, repo.language, repo.topics.join(", "), repo.commitsCount]
    });

    return (
        <RepositoriesPageContext.Provider value={{currentPage, setPage, selectedAvailability, setSelectedAvailability,
            selectedLanguage, setSelectedLanguage, pagination, headers, rows}}>
            {children}
        </RepositoriesPageContext.Provider>
    )
}

export const useRepositoriesPage = () => useContext(RepositoriesPageContext);
