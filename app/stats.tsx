"use client"

import React from "react";
import CardStats from "../components/Cards/CardStats.js";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });
const STATS_QUERY = gql`
    query {
        stats {
            total
            labeled
            references
            commits
        }
    }
`

const cards = [
    { subtitle: 'TOTAL', icon: 'far fa-database', color: 'bg-red-500', key: 'total' },
    { subtitle: 'LABELED', icon: 'fas fa-tag', color: 'bg-orange-500', key: 'labeled' },
    { subtitle: 'REFERENCES', icon: 'fas fa-link', color: 'bg-yellow-500', key: 'references' },
    { subtitle: 'COMMITS', icon: 'fas fa-code-commit', color: 'bg-sky-500', key: 'commits' },
];


export default function Stats() {
    const stats_query = useQuery(STATS_QUERY, { client });

    if (stats_query.loading) return <p>Loading Stats...</p>;

    const stats = stats_query.data?.stats;

    return (
        <>
            {/* Header */}
            <div className="relative bg-gray-800 md:pt-22 pb-32 pt-12">
                <div className="px-4 md:px-10 mx-auto w-full">
                    <div>
                        {/* Card stats */}
                        <div className="flex flex-wrap">
                            {stats_query.error ? (
                                // Render each card with an error state
                                cards.map(({ subtitle, icon, color, key }) => (
                                    <div key={key} className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                        <CardStats
                                            statSubtitle={`ERROR ${key}`}
                                            statTitle="N/A"
                                            statIconName="fas fa-exclamation-circle"
                                            statIconColor="bg-gray-500"
                                        />
                                    </div>
                                ))
                            ) : (
                                // Render each card with fetched stats
                                cards.map(({ subtitle, icon, color, key }) => (
                                    <div key={key} className="w-full lg:w-6/12 xl:w-3/12 px-4">
                                        <CardStats
                                            statSubtitle={subtitle}
                                            statTitle={stats?.[key] || 'N/A'}
                                            statIconName={icon}
                                            statIconColor={color}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}