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

            <div style={{marginBottom: 20}}>
              <h2 className="text-gray-500 font-bold text-xl mb-3">Similar Vulnerabilities:</h2>
              <a target="_blank" href="https://nvd.nist.gov/vuln/detail/CVE-2021-44228"><div className="card h-36" style={{backgroundColor: "#FFFFFF", borderRadius: 10}}>
                <p style={{margin: 10, paddingTop: 5}}>Product: Apache Log4j</p>
                <p style={{margin: 10}}>Issue: LDAP and other JNDI related endpoints have unprotected parameters</p>
                <p style={{margin: 10}}>Severity: 10.0 Critical</p>
                <p style={{margin: 10}}>Timestamp: 12/10/2021</p>
              </div></a>

              <a target="_blank" href="https://nvd.nist.gov/vuln/detail/CVE-2021-44228"><div className="card h-36" style={{backgroundColor: "#FFFFFF", borderRadius: 10}}>
                <p style={{margin: 10, paddingTop: 5}}>Product: Apache Log4j</p>
                <p style={{margin: 10}}>Issue: LDAP and other JNDI related endpoints have unprotected parameters</p>
                <p style={{margin: 10}}>Severity: 10.0 Critical</p>
                <p style={{margin: 10}}>Timestamp: 12/10/2021</p>
              </div></a>
            </div>

            

            <div>
              <h2 className="text-gray-500 font-bold text-xl mb-3">Possible Causes:</h2>
              <div className="card h-36" style={{backgroundColor: "#FFFFFF", borderRadius: 10}}>
                <p  style={{margin: 10, paddingTop: 5}}>Improper Input Validation</p>
                <p style={{margin: 10}}>Description: The product constructs all or part of an expression language (EL) statement in a framework such as a Java Server Page (JSP) using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended EL statement before it is executed.</p>
              </div>
            </div>

            <Link href="/scoring">
              <button id="next-button" style={{marginTop: 20}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Next
            </button></Link>

          
        </div>
      );
      
}