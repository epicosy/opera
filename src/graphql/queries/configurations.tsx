import {gql} from "@apollo/client";

export const LIST_CONFIGURATIONS = gql`
    query configurationsPage($page: Int!, $per_page: Int!) {
        configurationsPage(page: $page, perPage: $per_page){
            hasNextPage
            hasPreviousPage
            totalPages
            totalResults
            page
            perPage
            pages
            elements{
                id
                vulnerable
                part
                vendorId
                productId
                version
                update
                edition
                language
                swEdition
                targetSw
                targetHw
                other
                vulnerabilityId
            }
        }
    }
`;

export const CONFIGS_CHARTS_DATA = gql`
    query {
        configsPartCount{
            key
            values {
                key
                value
            }
        },
        configsVulnsCount{
            key
            value
        }
    }
`;