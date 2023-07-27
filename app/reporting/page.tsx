'use client';
import React, {useEffect, useState, useRef} from "react";
import { Input, message, Select } from 'antd';
import "styles/tailwind.css";
import {ApolloClient, InMemoryCache, gql} from "@apollo/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { StyleSheet } from '@react-pdf/renderer';


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

    const summaryRef = useRef(null);
    const fullReportRef = useRef(null);

    // Create styles
const styles = StyleSheet.create({
    page: {
      padding: 30,
    },
    section: {
      marginBottom: 10,
    }
  });
  


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

            <div style={{marginBottom: 20}} ref={summaryRef}>
              <h2 className="text-gray-500 font-bold text-xl mb-3">Report Summary:</h2>
              <div className="card h-fit" style={{backgroundColor: "#FFFFFF", borderRadius: 10}}>
                <p style={{margin: 10, paddingTop: 5}}>Uncontrolled Recursion in Pattern Layout with Context Lookup in Apache Log4j2 versions 2.0-alpha1 through 2.16.0, excluding 2.12.3, allows attackers with control over Thread Context Map (MDC) input data to cause a StackOverflowError resulting in process termination via crafting malicious input data for recursive lookup.</p>
                <br></br>
              </div>
            </div>
          
            <div style={{marginBottom: 20}} ref={fullReportRef}>
              <h2 className="text-gray-500 font-bold text-xl mb-3">Full Report:</h2>
              <div className="card h-fit" style={{backgroundColor: "#FFFFFF", borderRadius: 10}}>
                <h5 style={{margin: 10, paddingTop: 5}} className="font-bold">Summary:</h5>
                <p style={{margin: 10}}>A severe vulnerability has been discovered in Apache Log4j2. The issue lies in how Log4j2 handles Pattern Layout with Context Lookup, specifically within the range of versions 2.0-alpha1 to 2.16.0, with the exception of 2.12.3. This vulnerability is due to uncontrolled recursion from self-referential lookups. The problem arises when logging configuration uses a non-default Pattern Layout with a Context Lookup.</p>

                <p style={{margin: 10}}>In the event that attackers gain control over the Thread Context Map (MDC) input data, they are able to create malicious input data that will cause a recursive lookup. The end result of this recursion is a StackOverflowError, which will force the process to terminate, leading to potential Denial of Service (DoS) conditions.</p>

                <h5 style={{margin: 10}} className="font-bold">Vendor: </h5>
                <p style={{margin: 10}}>The Apache Software Foundation</p>

                <h5 style={{margin: 10}}className="font-bold">Product: </h5>
                <p style={{margin: 10}}>Apache Log4j2</p>

                <h5 style={{margin: 10}} className="font-bold">Affected Versions:</h5>
                <p style={{margin: 10}}>Versions 2.0-alpha1 through 2.16.0 are affected, excluding version 2.12.3.</p>

                <h5 style={{margin: 10}} className="font-bold">Vulnerability Type:</h5>
                <p style={{margin: 10}}>This vulnerability can be classified as Uncontrolled Recursion, a form of improper control of a recursive or iteration process.</p>
     

                <h5 style={{margin: 10}} className="font-bold">Impact:</h5>
                <p style={{margin: 10}}>The exploitation of this vulnerability could lead to a Denial of Service (DoS) state, as it could potentially crash the application when an attacker induces a StackOverflowError.</p>

                <h5 style={{margin: 10}} className="font-bold">Attack Vector:</h5>
                <p style={{margin: 10}}>The vulnerability can be exploited through the logging configuration, specifically if the attacker has control over the Thread Context Map (MDC) input data.</p>

                <h5 style={{margin: 10}} className="font-bold">Solution:</h5>
                <p style={{margin: 10}}>Apache is currently developing a patch to address this vulnerability. The patch will rectify the recursion control mechanism to prevent StackOverflowError from self-referential lookups in non-default Pattern Layouts with Context Lookup.</p>

                <h5 style={{margin: 10}} className="font-bold">CVSS Score:</h5>
                <p style={{margin: 10}}>To be determined based on the assessment of the vulnerability's impact and exploitability.</p>

                <h5 style={{margin: 10}} className="font-bold">References:</h5>
                <p style={{margin: 10}}>No official advisory or references available at this time.</p>
                
                <h5 style={{margin: 10}} className="font-bold">Acknowledgments:</h5>
                <p style={{margin: 10}}>Not available at this time.</p>
                <br></br>

              </div>
            </div>
    
            
            <div>
            <div>
                <button>Export</button>
            </div>
        </div>
        </div>

      );
      
}