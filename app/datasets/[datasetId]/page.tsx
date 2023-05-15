'use client';
import React, {useState} from "react";
import {Dataset} from "../../../typings";
import {ApolloClient, gql, InMemoryCache, useMutation, useQuery} from "@apollo/client";
import {DebounceSelect, fetchVulnerability, VulnerabilityValue} from "../../../components/debounceSelect";
import {Button, notification, Table, Input, Modal} from "antd";
import {ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import Link from "next/link";

type PageProps = {
    params: {
        datasetId: number;
    }
}

const columns = [
    {
        title: 'Vulnerability ID',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <Link href={`http://localhost:3005/vulnerabilities/${text}/`} target="_blank"
                                className="text-blue-600 dark:text-blue-500 hover:underline" >{text}</Link>,
    },
    {
        title: 'CWE ID',
        dataIndex: 'cweIds',
        key: 'cweIds',
        render: (cweIds) => cweIds.map((cwe: any) => cwe.id).join(", ")
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Button type="primary" danger onClick={() => console.log(text, record)}>
                <DeleteOutlined />
            </Button>
        ),
    },
];

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});


const FETCH_DATASET = gql`
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

const ADD_VULNERABILITIES_TO_DATASET = gql`
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

const EDIT_DATASET = gql`
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

const REMOVE_DATASET_VULNERABILITIES = gql`
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

function DatasetInfo({ dataset } : { dataset: Dataset }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(dataset.name);
    const [editedDescription, setEditedDescription] = useState(dataset.description);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await client.mutate({
                mutation: EDIT_DATASET,
                variables: {
                    id: dataset.id,
                    name: editedName,
                    description: editedDescription
                }
            });

            notification.success({
                message: 'Success',
                description: 'Dataset information updated successfully.'
            });

            setIsEditing(false);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: `Failed to update dataset information: ${error.message}`
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedName(dataset.name);
        setEditedDescription(dataset.description);
    };

    const handleDeleteVulnerabilities = async () => {
        try {
            await client.mutate({
                mutation: REMOVE_DATASET_VULNERABILITIES,
                variables: {
                    id: dataset.id
                }
            });

            notification.success({
                message: 'Success',
                description: 'All vulnerabilities removed successfully.'
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: `Failed to remove vulnerabilities: ${error.message}`
            });
        }

        setIsConfirmVisible(false);
    };

    const showConfirmModal = () => {
        setIsConfirmVisible(true);
    };

    const handleConfirmCancel = () => {
        setIsConfirmVisible(false);
    };

    return (
        <div className="flex flex-col w-full block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {isEditing ? (
                <>
                    <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                    />
                    <Input.TextArea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                        className="font-normal text-gray-700 dark:text-gray-400"
                    />
                    <div className="flex mt-2">
                        <Button type="primary" onClick={handleSave} className="mr-2 text-white bg-blue-700
                        hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm
                        mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
                        dark:focus:ring-blue-800 ">
                            Save
                        </Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </div>
                </>
            ) : (
                <>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{dataset.name}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{dataset.description}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">Vulnerabilities: {dataset.vulnerabilities.length}</p>
                    <div className="flex mt-2">
                        <Button type="primary" onClick={handleEdit} className="mr-2 text-white bg-blue-700
                        hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm
                        mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
                        dark:focus:ring-blue-800 ">
                            <EditOutlined />
                        </Button>
                        <Button type="primary" danger onClick={showConfirmModal} >
                            Remove Vulnerabilities
                        </Button>

                        <Modal
                            open={isConfirmVisible}
                            onCancel={handleConfirmCancel}
                            onOk={handleDeleteVulnerabilities}
                            title="Remove All Vulnerabilities"
                            okText="Remove"
                            cancelText="Cancel"
                        >
                            <p>Are you sure you want to delete all vulnerabilities?</p>
                        </Modal>
                    </div>
                </>
            )}
        </div>
    );
}

function VulnerabilitySelect({ value, onChange }) {
    // Implement the DebounceSelect component here

    return (
        <div style={{ position: 'relative', flexGrow: 1 }}>
            <DebounceSelect
                mode="multiple"
                value={value}
                placeholder="Select users"
                fetchOptions={fetchVulnerability}
                onChange={onChange}
                style={{ width: '100%' }}
            />
        </div>
    );
}


function DatasetPage({ params: { datasetId } }: PageProps) {
    const { loading, error, data, refetch } = useQuery(FETCH_DATASET, { client, variables: { id: datasetId } });
    const [value, setValue] = useState<VulnerabilityValue[]>([]);
    const [addVulnerabilitiesToDataset] = useMutation(ADD_VULNERABILITIES_TO_DATASET, {client});

    const handleSubmit = async () => {
        const vulnerabilityIds = value.map((vulnerability) => vulnerability.value);
        const initialVulnerabilities = data?.dataset?.vulnerabilities?.length || 0;

        try {
            await addVulnerabilitiesToDataset({ variables: { datasetId, vulnerabilityIds } });
            const updatedVulnerabilities = data?.dataset?.vulnerabilities?.length || 0;
            const addedVulnerabilities = updatedVulnerabilities - initialVulnerabilities;

            // TODO: make this work

            notification.success({
                message: 'Success',
                description: `Added ${addedVulnerabilities} ${(addedVulnerabilities == 1 ? 'vulnerability' : 'vulnerabilities')}`
            });
        } catch (error) {
            refetch(); // Refetch the dataset when an error occurs
            notification.error({
                message: 'Error',
                description: `Error adding vulnerabilities: ${error}`
            });
        }
    };

    const isSubmitDisabled = value.length === 0;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    const dataset: Dataset = data.dataset;

    return (
        <>
            <Button type="text" href="http://localhost:3005/datasets" size="small">
                <ArrowLeftOutlined />
            </Button>
            <div className="flex flex-row py-5 px-4 w-full">
                <div className="flex flex-col w-full mx-2">
                    <DatasetInfo dataset={dataset} />
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <VulnerabilitySelect value={value} onChange={setValue} />
                        <Button type="primary" onClick={handleSubmit} disabled={isSubmitDisabled}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
                            font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700
                            focus:outline-none dark:focus:ring-blue-800">
                            <ArrowRightOutlined />
                        </Button>
                    </div>
                    <Table columns={columns} dataSource={dataset.vulnerabilities} />
                </div>
            </div>
        </>
    );
}

export default DatasetPage;
