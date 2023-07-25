'use client';
import React, {useEffect, useState} from "react";
import { Input, message, Select } from 'antd';
import "styles/tailwind.css";
import {ApolloClient, InMemoryCache, gql} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});

const GENERATE_REPORT = gql`
    query report($url: String!, $cwe: String!) {
        report (url: $url, vulType: $cwe) 
    }
`;

const FETCH_CWES = gql`
    query GetCwes {
        cwes {
            name
        }
    }
`;

const { Option } = Select;

export default function Reports() {
    const [url, setUrl] = useState('');
    const [cwe, setCwe] = useState(null);
    const [data, setData] = useState(null);
    const [cwes, setCwes] = useState([]);

    const handleInputChange = (e) => {
        setUrl(e.target.value);
    }

    const handleSelectChange = (value) => {
        setCwe(value);
    }

    useEffect(() => {
        const fetchCwes = async () => {
            try {
                const { data } = await client.query({query: FETCH_CWES});
                setCwes(data.cwes);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchCwes();
    }, [client]);

    useEffect(() => {
        const fetchData = async () => {
            if (url !== '' && cwe) {
                const pattern = /^https:\/\/github.com\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/[^#]+#L\d+$/;
                if (!pattern.test(url)) {
                    message.error("Invalid URL format. It should be: 'https://github.com/$owner/$repo/blob/$commit/$file_path#$line_number'");
                    return;
                }

                try {
                    const { data } = await client.query({
                        query: GENERATE_REPORT,
                        variables: { url, cwe },
                    });
                    setData(data.report);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
        fetchData();
    }, [url, cwe, client]);

    return (
        <div>
            <Select placeholder="Select CWE" onChange={handleSelectChange} showSearch optionFilterProp="children"
                    filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    className="text-gray-900 text-sm rounded-lg focus:ring-blue-500
                    focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600
                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {cwes.map((cwe, index) => (
                    <Option key={index} value={cwe.name}>
                        {cwe.name}
                    </Option>
                ))}
            </Select>
            <Input
                placeholder="Enter API URL"
                value={url}
                onChange={handleInputChange}
                disabled={!cwe}
            />
            {data && (
                <div>
                    <h2>Response:</h2>
                    <Input.TextArea value={JSON.stringify(data, null, 2)} />
                </div>
            )}
        </div>
    );
}