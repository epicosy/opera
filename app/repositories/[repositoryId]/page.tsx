'use client';
import React, {useState} from "react";
import {Repository} from "../../../typings";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import Link from "next/link";
import CardPieChart from "../../../components/Cards/cardPieChart";
import SoftwareTypeComponent from "../../../components/Dropdowns/EditRepoSoftwareType";

type PageProps = {
    params: {
        repositoryId: string
    }
}

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});

const FETCH_REPO = gql`
    query FetchRepo($repositoryId: ID!) {
        repository(id: $repositoryId) {
            id
            name
            owner
            available
            language
            topics
            description
            commits{
                id
                vulnerabilityId
                kind
            }
            commitsCount
            softwareType
            vulnerabilityProfile{
                key
                value
            }
            vulnerabilityCount
        }
    }
`;

const SW_TYPES = gql`
    query FetchSoftwareTypes {
        productTypes{
            id
            name
        }
    }
`;


export default function RepoPage({ params: { repositoryId } }: PageProps){
    const { loading, error, data } = useQuery(FETCH_REPO, {client, variables: { repositoryId: repositoryId }});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    let repo: Repository = data.repository;

    return <div className="flex flex-row py-5 px-4 m-2">
        <div className="flex flex-col">
            <div className="flex flex-row block mr-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Owner/Repo:
                </h5>
                <Link target="_blank" className="ml-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            href={`https://github.com/${repo.owner}/${repo.name}`}>{repo.owner}/{repo.name}</Link>
                <h5 className="mb-2 ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Language:
                </h5>
                <p>
                    {repo.language}
                </p>
                <h5 className="mb-2 ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    {repo.available === true ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Available</span>
                ) : repo.available === false ? (
                    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Not Available</span>
                ) : (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Unknown</span>
                )}
                </h5>
                <h5 className="mb-2 ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Commits Count: {repo.commitsCount}
                </h5>
                <SoftwareTypeComponent repo={repo} />
                <h5 className="mb-2 ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Vulnerability Count: {repo.vulnerabilityCount}
                </h5>
            </div>
            <div className="flex flex-row block mr-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                    Description:
                </h5>
                <p>{repo.description}</p>
            </div>
            <div className="flex flex-row block mr-2 p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                {repo.topics.map((topic) => (
                    <span
                        className="bg-blue-100 text-blue-800 hover:bg-blue-300 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{topic}
                    </span>
                ))}
            </div>
            <div className="flex flex-row mr-2 mt-1">
                <CardPieChart
                    data={repo.vulnerabilityProfile}
                    title="Vulnerability profile of the repository"
                    fields={['CWE ID', 'Count']}
                />
            </div>
        </div>
        <div className="flex flex-col w-2/3 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-4">Vulnerability Id</th>
                    <th scope="col" className="px-6 py-3">Commit Id</th>
                    <th scope="col" className="px-6 py-3">Kind</th>
                </tr>
                </thead>
                <tbody>
                {repo.commits.map((commit) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={commit.id}>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{commit.vulnerabilityId}</td>
                        <td className="px-6 py-4">{commit.id}</td>
                        <td className="px-6 py-4">{commit.kind}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
}
