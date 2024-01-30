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