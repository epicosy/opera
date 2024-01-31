import {gql} from "@apollo/client";

export const LIST_COMMITS = gql`
    query commitsPage($page: Int!, $per_page: Int!) {
        commitsPage(page: $page, perPage: $per_page) {
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements {
                id
                url
                kind
                available
                state
                changes
                additions
                deletions
                filesCount
                parentsCount
                vulnerabilityId
                repositoryId
            }
        }
    }
`;

export const COMMITS_CHARTS_DATA = gql`
    query {
        commitKindCount{
            key
            value
        },
        commitsAvailability{
            key
            value
        },
        commitsState{
            key
            value
        },
        commitsFilesCount{
            key
            value
        },
        commitsChangesCount{
            key
            value
        }
    }
`;