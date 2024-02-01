import {gql} from "@apollo/client";

export const VENDORS_CHARTS_DATA = gql`
    query {
        productsCountByVendor{
            key
            value
        },
        configsCountByVendor{
            key
            value
        },
        vulnsCountByVendor{
            key
            value
        }
    }
`;

export const VENDORS_LIST = gql`
    query vendorsPage($page: Int!, $per_page: Int!) {
        vendorsPage(page: $page, perPage: $per_page){
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
                productsCount
                configurationsCount
                vulnerabilitiesCount
            }
        }
    }
`;
