'use client';
import React, {useEffect} from "react";
import { Form, Input, Button, Table, notification } from 'antd';
import "styles/tailwind.css";
import {ApolloClient, InMemoryCache, gql, useMutation, useQuery} from "@apollo/client";
import Link from "next/link";

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});

const CREATE_DATASET = gql`
    mutation CreateDataset($name: String!, $description: String!) {
        createDataset(name: $name, description: $description) {
            dataset{
                id
                name
                description   
            }
        }
    }
`;

const REMOVE_DATASET = gql`
    mutation RemoveDataset($id: Int!) {
        removeDataset(id: $id) {
            dataset{
                id
            }
        }
    }
`;

const FETCH_DATASETS = gql`
    query FetchDatasets {
        datasets {
            id
            name
            description
            size
        }
    }
`;

const DatasetForm = () => {
    const [form] = Form.useForm();
    const [createDataset, { loading, error }] = useMutation(CREATE_DATASET, { client,
        refetchQueries: [{ query: FETCH_DATASETS }]});

    const handleSubmit = (values: { name: string, description: string}) => {
        createDataset({ variables: { name: values.name, description: values.description } })
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: `Dataset "${values.name}" created successfully`
                });
            })
            .catch((error) => {
                notification.error({
                    message: 'Error',
                    description: error.message
                });
            });
    };

    return (
        <Form form={form} onFinish={handleSubmit}>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter the name of the dataset' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter a description of the dataset' }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="inline-flex items-center rounded-md bg-green-50 px-2
                py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Create
                </Button>
            </Form.Item>
        </Form>
    );
};

export default function Datasets() {
    const { loading, error, data , refetch} = useQuery(FETCH_DATASETS, { client });
    const [removeDataset, { loading: mutationLoading, error: mutationError }] = useMutation(REMOVE_DATASET, { client,
        refetchQueries: [{ query: FETCH_DATASETS }]});

    useEffect(() => {
        refetch(); // Refetch the data when the component mounts or when the data is updated
    }, [refetch]);

    if (loading) return 'Loading...';
    if (error) return `Error! \${error.message}`;

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

    return <div>
        <DatasetForm />
        <Table dataSource={data.datasets} columns={columns} />
    </div>
}