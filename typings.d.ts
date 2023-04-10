import Dict = NodeJS.Dict;
import exp from "constants";

export type Operation = {
    id: string
    name: string
}

export type Phase = {
    id: string
    name: string
    url: string
    acronym: string
}

export type BFClass = {
    id: string
    name: string
    url: string
}

export type CWE = {
    id: string
    operations: Array<Operation>
    phases: Array<Phase>
    bfClasses: Array<BFClass>
}

export type Vulnerability = {
    id: string
    severity: string
    description: string
    exploitability: number
    impact: number
    references: Array<string>
    cweIds: Array<CWE>
    name: string
    publishedDate: Date
    lastModifiedData: Date
}

export type Commit = {
    id: string
    url: string
    vulnerabilityId: string
    repositoryId: string
}

export type Pagination = {
    hasNextPage: boolean
    hasPreviousPage: boolean
    totalPages: number
    totalResults: number
    page: number
    perPage: number
    pages: Array<number>
}

export type Repository = {
    id: string
    name: string
    owner: string
    commits: Array<Commit>
    commitsCount: number
}

export type Configuration = {
    id: string
    vulnerable: boolean
    part: string
    vendor: string
    product: string
    version: string
    update: string
    edition: string
    language: string
    swEdition: string
    targetSw: string
    targetHw: string
    other: string
    vulnerabilityId: string
}

export type Vendor = {
    id: string
    name: string
    configurations: Array<Configuration>
    configurationsCount: number
    products: Array<string>
    productsCount: number
    vulnerabilitiesCount: number
}

export type Product = {
    id: string
    name: string
    configurations: Array<Configuration>
    configurationsCount: number
    vulnerabilitiesCount: number
}

export type VulnerabilityPagination = Pagination & {
    elements: Array<Vulnerability>
}

export type CommitsPagination = Pagination & {
    elements: Array<Commit>
}

export type RepositoriesPagination = Pagination & {
    elements: Array<Repository>
}

export type ConfigurationsPagination = Pagination & {
    elements: Array<Configuration>
}

export type VendorsPagination = Pagination & {
    elements: Array<Vendor>
}
