import React from "react";

import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import {Vulnerability} from "../typings";
import Link from "next/link";


const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const LATEST_VULNS_QUERY = gql`
    query {
        vulnerabilities(first: 10) {
            id
            severity
            exploitability
            description
            impact
            publishedDate
            lastModifiedDate
        }
    }
`

const CardHeader = () => (
    <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                    Latest Vulnerabilities
                </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                    href="/vulnerabilities"
                    type="button"
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                    See all
                </Link>
            </div>
        </div>
    </div>
);

const TableHeader = ({ headers } : {headers: Array<string>}) => (
    <thead>
    <tr>
        {headers.map((header, index) => (
            <th
                key={index}
                className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
                {header}
            </th>
        ))}
    </tr>
    </thead>
);

const VulnerabilityTableRow = ({ vulnerability } : {vulnerability: Vulnerability}) => (
    <tr key={vulnerability.id}>
        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
            <Link href={`/vulnerabilities/${vulnerability.id}`}>{vulnerability.id}</Link>
        </th>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap ellipsis p-4" data-text={vulnerability.description}>
            {vulnerability.description}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            {vulnerability.impact}
        </td>
        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
            {(new Date(vulnerability.publishedDate)).toLocaleDateString()}
        </td>
    </tr>
);

export default function CardLatestVulnerabilities() {
  const latest_vulns_query = useQuery(LATEST_VULNS_QUERY, { client });
  const latest_vulns: Array<Vulnerability> = latest_vulns_query.data?.vulnerabilities;
  const headers = ['ID', 'Description', 'Impact', 'Published'];

  return (
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <CardHeader />
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse table-fixed">
            <TableHeader headers={headers} />
            <tbody>
            {latest_vulns ? (
                latest_vulns.map((vulnerability) => (
                    <VulnerabilityTableRow key={vulnerability.id} vulnerability={vulnerability} />
                ))
            ) : (
                <tr>
                  <td className="px-6 py-4 text-center text-blueGray-500" colSpan={headers.length}>
                    No data available
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
}
