'use client';
import React from "react";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import {Commit} from "../../../typings";
import {Card, Tag} from "antd";
import Link from "next/link";

type PageProps = {
    params: {
        commitId: string
    }
}

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});


const FETCH_COMMIT = gql`
    query FetchCommit($id: ID!) {
        commit(id: $id) {
            id
            sha
            url
            kind
            date
            state
            author
            message
            changes
            available
            additions
            deletions
            filesCount
            parentsCount
            vulnerabilityId
            repositoryId
            files {
                id
                filename
            }
        }
    }
`;


const getAvailableTagColor = (value) => {
    if (value === null) {
        return 'grey';
    } else if (value === false) {
        return 'orange';
    } else if (value === true) {
        return 'green';
    }
    return 'default';
};


export default function CommitPage({ params: { commitId } }: PageProps){
    const { loading, error, data } = useQuery(FETCH_COMMIT, {client,  variables: { id: commitId }});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const commit: Commit = data.commit;

    return (
        <div style={{ padding: '20px' }}>
            {commit ? (
                <Card title="Commit Information">
                    <p><strong>ID:</strong> {commit.id}</p>
                    <p><strong>SHA:</strong> {commit.sha}</p>
                    <p>
                        <strong>URL:</strong>
                        <Link href={commit.url} target="_blank"
                              className="text-blue-600 dark:text-blue-500 hover:underline" >{commit.url}</Link>
                    </p>
                    <p><strong>Kind:</strong> {commit.kind}</p>
                    <p><strong>Date:</strong> {commit.date?.toString()}</p>
                    <p><strong>State:</strong> {commit.state}</p>
                    <p><strong>Author:</strong> {commit.author}</p>
                    <p><strong>Message:</strong> {commit.message}</p>
                    <p><strong>Changes:</strong> {commit.changes}</p>
                    <p>
                        <strong>Available:</strong>
                        <Tag color={getAvailableTagColor(commit.available)}>
                            {String(commit.available)}
                        </Tag>
                    </p>
                    <p><strong>Additions:</strong> {commit.additions}</p>
                    <p><strong>Deletions:</strong> {commit.deletions}</p>
                    <p><strong>Files Count:</strong> {commit.filesCount}</p>
                    <p><strong>Parents Count:</strong> {commit.parentsCount}</p>
                </Card>
            ) : (
                <p>Loading commit data...</p>
            )}
        </div>
    );
}
