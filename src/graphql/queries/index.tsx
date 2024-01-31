import {gql} from "@apollo/client";

export const ASSIGNERS_COUNTS_QUERY = gql`
    query getAssignersCount{
        assigners(company: true) {
            key
            value
        }
    }
`;

export const TAGS_COUNTS_QUERY = gql`
    query getTagsCount{
        tags {
            key
            value
        }
    }
`;

export const VULNS_BY_YEAR_QUERY = gql`
    query getVulnsByYear{
        vulnsByYear {
            key
            value
        }
    }
`;

export const LATEST_VULNS_QUERY = gql`
    query getLatestVulns{
        vulnerabilities(first: 10) {
            id
            severity
            exploitability
            description
            impact
            publishedDate
            lastModifiedDate
        }
    }
`;

export const STATS_QUERY = gql`
    query {
        stats {
            total
            labeled
            references
            commits
        }
    }
`

export const LIST_CWES = gql`
    query cwes{
        cwes (exists: true){
            id
        }
    }
`;

export const LIST_VULNERABILITIES = gql`
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

export const VULNS_CHARTS_DATA = gql`
    query {
        cweCounts{
            key
            value
        },
        vulnsSeverity{
            key
            value
        },
        vulnsExploitability{
            key
            value
        },
        cweMultiplicity{
            key
            value
        },
        vulnsCountBySofDevView{
            key
            value
        }
    }
`;