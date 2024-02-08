import {gql} from "@apollo/client";

export const CREATE_DATASET = gql`
    mutation CreateDataset($name: String!, $description: String!, $profileId: Int) {
        createDataset(name: $name, description: $description, profileId: $profileId) {
            dataset{
                id
                name
                description
            }
        }
    }
`;

export const REMOVE_DATASET = gql`
    mutation RemoveDataset($id: Int!) {
        removeDataset(id: $id) {
            dataset{
                id
            }
        }
    }
`;

export const FETCH_DATASETS = gql`
    query FetchDatasets {
        datasets {
            id
            name
            description
            size
        }
    }
`;


export const FETCH_DATASET = gql`
    query FetchDataset($id: ID!) {
        dataset(id: $id) {
            id
            name
            description
            vulnerabilities {
                id
                cweIds{
                    id
                }
            }
        }
    }
`;

export const ADD_VULNERABILITIES_TO_DATASET = gql`
    mutation AddVulnerabilitiesToDataset($datasetId: Int!, $vulnerabilityIds: [String]! ) {
        addVulnerabilitiesToDataset(datasetId: $datasetId, vulnerabilityIds: $vulnerabilityIds) {
            dataset {
                id
                vulnerabilities {
                    id
                }
            }
        }
    }
`;

export const EDIT_DATASET = gql`
    mutation EditDataset($id: Int!, $name: String!, $description: String!) {
        editDataset(id: $id, name: $name, description: $description) {
            dataset {
                id
                name
                description
            }
        }
    }
`;

export const REMOVE_DATASET_VULNERABILITIES = gql`
    mutation RemoveDatasetVulnerabilities($id: Int!) {
        removeDatasetVulnerabilities(id: $id) {
            dataset {
                id
                vulnerabilities {
                    id
                }
            }
        }
    }
`;