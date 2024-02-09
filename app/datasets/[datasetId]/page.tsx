'use client';
import React, {useState} from "react";
import {Dataset} from "../../../typings";
import {ApolloError, useMutation, useQuery} from "@apollo/client";
import {DebounceSelect, fetchVulnerability, VulnerabilityValue} from "../../../components/debounceSelect";
import {Button, notification, Table, Input, Modal} from "antd";
import {ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import Link from "next/link";
import {EDIT_DATASET, FETCH_DATASET, REMOVE_DATASET_VULNERABILITIES,
    ADD_VULNERABILITIES_TO_DATASET} from "../../../src/graphql/queries/datasets";
import {GraphQLProvider} from "../../../context/graphql";

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
        render: (text: string) => <Link href={`http://localhost:3005/vulnerabilities/${text}/`} target="_blank"
                                        className="text-blue-600 dark:text-blue-500 hover:underline" >{text}</Link>,
    },
    {
        title: 'CWE ID',
        dataIndex: 'cweIds',
        key: 'cweIds',
        render: (cweIds: Array<{ id: string }>) => cweIds.map((cwe: any) => cwe.id).join(", ")
    },
    {
        title: 'Root Weakness',
        dataIndex: 'rootWeakness',
        key: 'rootWeakness',
        render: (rootWeakness: string) => {
            if (!rootWeakness) return;
            // remove parenthesis from the string
            rootWeakness = rootWeakness.replace(/[()]/g, '');
            // split string by comma and take the first element of the array as index for the element to be bolded on the array and put it in bold
            const split = rootWeakness.split(',');
            const index = Number(split[0]);

            return <span>{split.map((item, i) => {
                if (i === 0) return;
                if (i === 1) item = `Operation: ${item} | `;
                if (i >= 2)  item = `Operand ${i}: ${item} `;

                if (i === index) {
                    return <b key={i}>{item}</b>
                } else {
                    return item
                }
            })}
            </span>
        }
    },
    {
        title: 'Action',
        key: 'action',
        render: (text: string, record: any) => (
            <Button type="primary" danger onClick={() => console.log(text, record)}>
                <DeleteOutlined />
            </Button>
        ),
    },
];


function DatasetInfo({ dataset } : { dataset: Dataset }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(dataset?.name);
    const [editedDescription, setEditedDescription] = useState(dataset?.description);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const [editDataset] = useMutation(EDIT_DATASET);
            await editDataset({variables: {id: dataset.id, name: editedName, description: editedDescription}});

            notification.success({
                message: 'Success',
                description: 'Dataset information updated successfully.'
            });

            setIsEditing(false);
        } catch (error) {
            if (error instanceof ApolloError) {
                notification.error({
                    message: 'Error',
                    description: `Failed to update dataset information: ${error.message}`
                });
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedName(dataset.name);
        setEditedDescription(dataset.description);
    };

    const handleDeleteVulnerabilities = async () => {
        try {
            const [removeDatasetVulnerabilities] = useMutation(REMOVE_DATASET_VULNERABILITIES);
            await removeDatasetVulnerabilities({variables: {id: dataset.id}});

            notification.success({
                message: 'Success',
                description: 'All vulnerabilities removed successfully.'
            });
        } catch (error) {
            if (error instanceof ApolloError) {
                notification.error({
                    message: 'Error',
                    description: `Failed to remove vulnerabilities: ${error.message}`
                });
            } else {
                // Handle other types of errors
                console.error('An unexpected error occurred:', error);
            }
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
        <div className="flex flex-col w-full block p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
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
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{dataset?.name}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{dataset?.description}</p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">Vulnerabilities: {dataset?.vulnerabilities.length}</p>
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

function VulnerabilitySelect({value, onChange} : {value: VulnerabilityValue[], onChange: any}) {
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

function DatasetPageBody({ params: { datasetId } }: PageProps) {
    const { loading, error, data, refetch } = useQuery(FETCH_DATASET, {variables: { id: datasetId } });
    const [value, setValue] = useState<VulnerabilityValue[]>([]);
    const [addVulnerabilitiesToDataset] = useMutation(ADD_VULNERABILITIES_TO_DATASET);

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

    if (error) {
        console.error('Error fetching dataset:', error);
    }

    const dataset: Dataset = data?.dataset;

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
                    <Table columns={columns} dataSource={dataset?.vulnerabilities} />
                </div>
            </div>
        </>
    );
}


function DatasetPage({ params: { datasetId } }: PageProps) {
    const graphqlUri = process.env.GRAPHQL_API || 'http://localhost:4000/graphql';

    let defaultHeaders: Record<string, any > = {
        'client-name': 'opera',
        'client-version': process.env.npm_package_version || ''
    };


    return (
        <GraphQLProvider uri={graphqlUri} headers={defaultHeaders}>
            <DatasetPageBody params={{ datasetId }} />
        </GraphQLProvider>
    );
}

export default DatasetPage;
