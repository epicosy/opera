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
        <div className="p-10">

            <div style={{marginBottom: 20,}}>
              <h2 className="text-gray-500 font-bold text-xl mb-3">Validation:</h2>
              <div className="card h-24" style={{paddingTop: 5, backgroundColor: "#FFFFFF", borderRadius: 10}}>
              <span style={{margin: 10,}}>&#10003; This issue is legitimate and unique.</span>
              <br />
              <span style={{margin: 10,}}>&#10003; This vulnerability is exploitable.</span>
              <br />
              <span style={{margin: 10,}}>&#10003; We detected malware on the internet that can exploit this vulnerability!</span>
              </div>
            </div>

            <div style={{marginBottom: 20}}>
              <h2 className="text-gray-500 font-bold text-xl mb-3">Scoring:</h2>
              <div className="card h-20" style={{backgroundColor: "#FFFFFF", borderRadius: 10}}>
                <p style={{margin: 10, paddingTop: 5}}>Vulnerability Score: 8.4</p>
                <p style={{margin: 10, paddingTop: 5}}>Severity: Medium</p>
              </div>
            </div>

            <Link href="/reporting">
              <button id="next-button" style={{marginTop: 20}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Next
            </button></Link>
        </div>
      );
      
}