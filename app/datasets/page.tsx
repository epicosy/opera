'use client';
import React, {useEffect, useState} from "react";
import {Form, Input, Button, Table, notification, Select, Modal} from 'antd';
import "styles/tailwind.css";
import {useMutation, useQuery} from "@apollo/client";
import Link from "next/link";
import {CREATE_DATASET, FETCH_DATASETS, REMOVE_DATASET} from "../../src/graphql/queries/datasets";
import {GraphQLProvider} from "../../context/graphql";
import {PlusOutlined} from "@ant-design/icons";
import FloatingAddButton from "../../components/FloatingAddButton";
import {FETCH_PROFILES} from "../../src/graphql/queries/profile";


const items = [
    {value: '1', label: 'cwe 79'},
    {value: '2', label: 'top 10'},
    {value: '3', label: 'recent'},
];


const DatasetForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [form] = Form.useForm();
    const [createDataset, { loading, error }] = useMutation(CREATE_DATASET, {
        refetchQueries: [{ query: FETCH_DATASETS }]});

    const profilesQuery = useQuery(FETCH_PROFILES);
    const profiles = profilesQuery.data?.profiles.map((profile: { id: string, name: string }) => ({
        value: profile.id,
        label: profile.name
    })) || [];

    if (error){
        console.log("Error creating dataset: ", error);
    }

    const handleSubmit = (values: { name: string, description: string, profile: string}) => {
        createDataset({ variables: { name: values.name, description: values.description,
                profileId: values.profile } })
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: `Dataset "${values.name}" created successfully`
                });
                onSuccess(); // Invoke the callback function passed from the parent component
            })
            .catch((error) => {
                notification.error({
                    message: 'Error',
                    description: error.message
                });
            });
    };

    return (
        <div className="flex flex-row">
            <Form form={form} onFinish={handleSubmit} className="flex-col w-full">
                <Form.Item className="mb-2"
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the name of the dataset' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item className="mb-2"
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description of the dataset' }]}
                >
                    <Input.TextArea className="h-2"/>
                </Form.Item>
                <Form.Item label="Profile" name="profile" className="mb-0">
                    {profiles.length > 0 ? (
                        <Select style={{ width: 120 }} options={profiles}
                                placeholder="Select profile"/>
                    ) : (
                        <p>No profiles available</p>
                    )}
                </Form.Item>
                <Form.Item className="float-right mb-0" >
                    <Button type="primary" htmlType="submit" className="inline-flex items-center rounded-md bg-green-50 px-2
                    py-1 text-lg font-medium text-green-700 ring-1 ring-inset ring-green-600/20" size="large" >
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};


const AddModalForm: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleSuccess = () => {
        // Handle the user's input (e.g., submit it to the server)
        console.log('User input:', inputValue);

        // Close the modal
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        // Close the modal without taking any action
        setIsModalVisible(false);
    };

    return (
        <>
            <FloatingAddButton onClick={showModal} />
            <Modal
                title="Enter Profile Name"
                visible={isModalVisible}
                onCancel={handleCancel}
                cancelButtonProps={{disabled: true, style: { display: 'none' }}}
                okButtonProps={{disabled: true, style: { display: 'none' }}}
                width={500}
                style={{top: '60vh', right: '9vh', position: 'fixed'}}
            >
                <DatasetForm onSuccess={handleSuccess} />
            </Modal>
        </>
    );
};

function DatasetsTable () {
    const { loading, error, data , refetch} = useQuery(FETCH_DATASETS);
    const [removeDataset, { loading: mutationLoading, error: mutationError }] = useMutation(REMOVE_DATASET, {
        refetchQueries: [{ query: FETCH_DATASETS }]});

    useEffect(() => {
        refetch(); // Refetch the data when the component mounts or when the data is updated
    }, [refetch]);

    if (error){
        console.log("Error fetching datasets: ", error);
    }

    const handleDelete = (record: any) => {
        removeDataset({ variables: { id: record.id } })
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: `Dataset "${record.name}" deleted successfully`
                });
            }, (error) => {
                notification.error({
                    message: 'Error',
                    description: error.message
                });
            });
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (text: string, record: any) => <Link href={`http://localhost:3005/datasets/${record.id}`}
                                                         className="text-blue-600 dark:text-blue-500 hover:underline">{text}</Link>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: any) => (
                <Button className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium
                text-red-700 ring-1 ring-inset ring-red-600/10" onClick={() => handleDelete(record)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (<Table dataSource={data?.datasets} columns={columns} />);
}


export default function Datasets() {
    const graphqlUri = process.env.GRAPHQL_API || 'http://localhost:4000/graphql';

    let defaultHeaders: Record<string, any > = {
        'client-name': 'opera',
        'client-version': process.env.npm_package_version || ''
    };

    return (
        <GraphQLProvider uri={graphqlUri} headers={defaultHeaders}>
            <div className="flex flex-row w-full justify-center items-center mt-40">
                <DatasetsTable />
            </div>
            <AddModalForm />
        </GraphQLProvider>
    )
}