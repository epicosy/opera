import {gql} from "@apollo/client";

export const LIST_REPOSITORIES = gql`
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

export const REPOS_CHARTS_DATA = gql`
    query repositoriesCommitCounts {
        repositoriesCommitsFrequency{
            key
            value
        },
        repositoriesAvailability{
            key
            value
        },
        repositoriesLanguageCount{
            key
            value
        },
        topicsCount{
            key
            value
        },
        langProductLinksCount(filterCounts: 100){
            at
            to
            count
        },
        repositoriesSoftwareTypeCount{
            key
            value
        }
    }
`;