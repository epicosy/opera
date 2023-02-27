import React from "react";

import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {Vulnerability} from "../typings";
import Link from "next/link";
const fetchLatestVulnerabilities = async () => {

  const client = new ApolloClient({
    uri: `http://localhost:3001/graphql`,
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query {
        vulnerabilities(last: 10) {
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
  })

  const vulns: Array<Vulnerability> = await data.vulnerabilities

  return vulns
}


// components

export default async function CardLatestVulnerabilities() {

  const latest_vulns = await fetchLatestVulnerabilities()

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Vulnerabilities
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <Link href="/vulnerabilities" type="button" className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                See all
              </Link>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse table-fixed">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  ID
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Description
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Impact
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Published
                </th>
              </tr>
            </thead>
            <tbody>
              {latest_vulns.map((vulnerability) => (
                  <tr>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      <Link href={`/vulnerabilities/${vulnerability.id}`}>{vulnerability.id}</Link>
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap ellipsis p-4"
                        data-text={vulnerability.description}>
                      {vulnerability.description}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {vulnerability.impact}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {(new Date(vulnerability.publishedDate)).toLocaleDateString()}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
