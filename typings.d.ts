import Dict = NodeJS.Dict;

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