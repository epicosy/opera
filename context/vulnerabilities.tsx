'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {CWE, VulnerabilityPagination} from "../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import DropdownWithCheckboxes from "../components/Dropdowns/CheckboxDropdown";

const PAGE_SIZE = 15;
const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const LIST_CWES = gql`
    query cwes{
        cwes (exists: true){
            id
        }
    }
`;

const LIST_VULNERABILITIES = gql`
    query vulnerabilitiesPage($page: Int!, $per_page: Int!, $cwe_ids: [Int]!, $severity: [String]!) {
        vulnerabilitiesPage(page: $page, perPage: $per_page, cweIds: $cwe_ids, severity: $severity) {
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements {
                id
                severity
                exploitability
                impact
                references {
                    url
                }
                publishedDate
                lastModifiedDate
                cweIds {
                    id
                    operations {
                        name
                    }
                    phases {
                        name
                    }
                    bfClasses {
                        name
                    }
                }
            }
        }
    }
`;

interface VulnerabilityPageContextProps {
    currentPage: number;
    setPage: Dispatch<SetStateAction<number>>;
    selectedItems: number[];
    setSelectedItems: Dispatch<SetStateAction<number[]>>;
    selectedSeverity: string[];
    setSelectedSeverity: Dispatch<SetStateAction<string[]>>;
    pagination: VulnerabilityPagination;
    cwe_ids: number[];
    severity: string[];
    headers: string[];
    rows: string[][];
}

const VulnerabilityPageContext = createContext<VulnerabilityPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    selectedItems: [],
    setSelectedItems: () => {},
    selectedSeverity: [],
    setSelectedSeverity: () => {},
    pagination: {},
    cwe_ids: [],
    severity: [],
    headers: [],
    rows: [],
} as VulnerabilityPageContextProps);

export const VulnerabilityPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const [selectedItems, setSelectedItems] = React.useState([]);
    const [selectedSeverity, setSelectedSeverity] = React.useState([]);
    const cwesQuery = useQuery(LIST_CWES, {client});
    const vulnsPageQuery = useQuery(LIST_VULNERABILITIES,
        {client, variables: {page: currentPage, per_page: PAGE_SIZE, cwe_ids: selectedItems,
                severity: selectedSeverity}}
    );

    if (cwesQuery.loading) return <p>Loading CWE-IDs...</p>;

    if (cwesQuery.error){
        return <p>Error: Could not fetch CWE-Ids :(</p>;
    }


    const cwe_ids: number[] = cwesQuery.data?.cwes.map((cwe: CWE) => cwe.id);
    const severity: string[] = ["HIGH", "MEDIUM", "LOW"];

    if (vulnsPageQuery.loading) return <p>Loading Vulnerabilities...</p>;
    if (vulnsPageQuery.error){
        return <p>Error loading vulnerabilities :(</p>;
    }

    const cweIdsHeader = <DropdownWithCheckboxes title="CWE-IDs" items={cwe_ids} selectedItems={selectedItems}
                                                 onChange={setSelectedItems}/>
    const severityHeader = <DropdownWithCheckboxes title="Severity" items={severity} selectedItems={selectedSeverity}
                                                   onChange={setSelectedSeverity}/>
    const pagination: VulnerabilityPagination = vulnsPageQuery.data?.vulnerabilitiesPage;
    const headers = ["Published Date", cweIdsHeader, "BF-Classes", "Operations", "Phases", severityHeader,
        "Exploitability", "Impact", "ID"];

    const rows = pagination.elements.map((vuln: any) => {
        return [new Date(vuln.publishedDate).toLocaleDateString(), vuln.cweIds.map((cwe: any) => cwe.id).join(", "),
            vuln.cweIds.map((cwe: any) => cwe.bfClasses.map((bf: any) => bf.name).join(", ")).join("|"),
            vuln.cweIds.map((cwe: any) => cwe.operations.map((op: any) => op.name).join(", ")).join("|"),
            vuln.cweIds.map((cwe: any) => cwe.phases.map((ph: any) => ph.name).join(", ")).join("|"),
            vuln.severity, vuln.exploitability, vuln.impact, vuln.id];
    });

    return (
        <VulnerabilityPageContext.Provider value={{currentPage, setPage, headers, rows, pagination}}>
            {children}
        </VulnerabilityPageContext.Provider>
    )
}

export const useVulnerabilityPage = () => useContext(VulnerabilityPageContext);
