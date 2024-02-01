import {gql} from "@apollo/client";

export const PRODUCTS_LIST = gql`
    query productsPage($page: Int!, $per_page: Int!) {
        productsPage(page: $page, perPage: $per_page){
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
                swType
                configurationsCount
                vulnerabilitiesCount
            }
        }
    }
`;


export const PRODUCTS_CHARTS_DATA = gql`
    query {
        configsCountByProduct{
            key
            value
        },
        vulnsCountByProduct{
            key
            value
        },
        swTypeCount{
            key
            value
        }
    }
`;