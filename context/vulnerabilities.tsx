'use client';

import React, {createContext, useContext, Dispatch, SetStateAction, useState, FC, ReactNode} from "react";
import {CWE, VulnerabilityPagination} from "../typings";
import {useQuery} from "@apollo/client";
import DropdownWithCheckboxes from "../components/Dropdowns/CheckboxDropdown";
import Link from "next/link";
import {LIST_CWES, LIST_VULNERABILITIES} from "../src/graphql/queries";

const PAGE_SIZE = 15;


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
    headers: (string | React.JSX.Element)[];
    rows: string[][];
}

const VulnerabilityPageContext = createContext<VulnerabilityPageContextProps>({
    currentPage: 1,
    setPage: () => {},
    selectedItems: [],
    setSelectedItems: () => {},
    selectedSeverity: [],
    setSelectedSeverity: () => {},
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
    cwe_ids: [],
    severity: [],
    headers: [],
    rows: [],
} as VulnerabilityPageContextProps);

export const VulnerabilityPageProvider: FC<{children: ReactNode}> = ({children}) => {
    const [currentPage, setPage] = useState(1);
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
    const [selectedSeverity, setSelectedSeverity] = React.useState<string[]>([]);
    const cwesQuery = useQuery(LIST_CWES);
    const vulnsPageQuery = useQuery(LIST_VULNERABILITIES,
        {variables: {page: currentPage, per_page: PAGE_SIZE, cwe_ids: selectedItems,
                severity: selectedSeverity}}
    );

    if (cwesQuery.loading) return <p>Loading CWE-IDs...</p>;

    let cwe_ids: number[];

    if (cwesQuery.error){
        console.log("Error loading CWE-IDs:", cwesQuery.error);
        cwe_ids = [];
    } else {
        cwe_ids = cwesQuery.data?.cwes.map((cwe: CWE) => cwe.id);
    }

    const severity: string[] = ["HIGH", "MEDIUM", "LOW"];

    if (vulnsPageQuery.loading) return <p>Loading Vulnerabilities...</p>;
    if (vulnsPageQuery.error){
        // Handle the case where there is an error fetching vulnerabilities
        console.error("Error loading vulnerabilities:", vulnsPageQuery.error);
    }

    let cweIdsHeader: (string | React.JSX.Element);
    if (cwe_ids.length === 0) {
        cweIdsHeader = "CWE-IDs";
    } else {
        cweIdsHeader = <DropdownWithCheckboxes title="CWE-IDs" items={cwe_ids} selectedItems={selectedItems}
                                               onChange={setSelectedItems}/>
    }
    let severityHeader: (string | React.JSX.Element);

    if (vulnsPageQuery.error){
        severityHeader = "Severity";
    } else {
        severityHeader = <DropdownWithCheckboxes title="Severity" items={severity} selectedItems={selectedSeverity}
                                                 onChange={setSelectedSeverity}/>
    }

    const headers = ["Published Date", cweIdsHeader, "BF-Classes", "Operations", "Phases", severityHeader,
        "Exploitability", "Impact", "ID"];

    const pagination: VulnerabilityPagination = vulnsPageQuery.data?.vulnerabilitiesPage;

    const rows = pagination?.elements?.map((vuln: any) => {
        return [new Date(vuln.publishedDate).toLocaleDateString(), vuln.cweIds.map((cwe: any) => cwe.id).join(", "),
            vuln.cweIds.map((cwe: any) => cwe.bfClasses.map((bf: any) => bf.name).join(", ")).join("|"),
            vuln.cweIds.map((cwe: any) => cwe.operations.map((op: any) => op.name).join(", ")).join("|"),
            vuln.cweIds.map((cwe: any) => cwe.phases.map((ph: any) => ph.name).join(", ")).join("|"),
            vuln.severity, vuln.exploitability, vuln.impact,
            <Link href={`http://localhost:3005/vulnerabilities/${vuln.id}/`} target="_blank"
                  className="text-blue-600 dark:text-blue-500 hover:underline" >{vuln.id}</Link>];
    }) || [];

    return (
        <VulnerabilityPageContext.Provider value={{currentPage, setPage, selectedItems, setSelectedItems,
            selectedSeverity, setSelectedSeverity, pagination, cwe_ids, severity, headers, rows,}}>
            {children}
        </VulnerabilityPageContext.Provider>
    )
}

export const useVulnerabilityPage = () => useContext(VulnerabilityPageContext);
