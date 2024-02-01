import {gql} from "@apollo/client";

export const LIST_FILES = gql`
    query filesPage($page: Int!, $per_page: Int!) {
        commitFilesPage(page: $page, perPage: $per_page) {
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements {
                id
                filename
                extension
                changes
                additions
                deletions
                status
                patch
                rawUrl
                commitId
            }
        }
    }
`;

export const FILES_CHARTS_DATA = gql`
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