'use client';
import React, {useEffect, useState} from "react";
import { Input, message, Select } from 'antd';
import "styles/tailwind.css";
import {ApolloClient, InMemoryCache, gql} from "@apollo/client";
import Link from "next/link";

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

export default function Discovery() {
    const [url, setUrl] = useState('');
    const [cwe, setCwe] = useState(null);
    const [data, setData] = useState("the default");
    const [cwes, setCwes] = useState([]);
    const [processed, setProcessed] = useState(false);

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
        <div className="p-10">
            <h2 className="text-gray-500 font-bold text-xl mb-3">Process Vulnerability:</h2>
          
            <Input.TextArea placeholder="Vulnerability Code Sample"  className="h-64"/>
            <Link href="/analysis">
              <button onClick={() => setProcessed(true)} id="process-button" style={{marginTop: 20}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Process the Vulnerability
            </button></Link>
            
         
        </div>
      );
      
}