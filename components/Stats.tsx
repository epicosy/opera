"use client"

import React from "react";
import CardStats from "./Cards/CardStats";
import {useQuery} from "@apollo/client";
import {STATS_QUERY} from "../src/graphql/queries";
import {TagOutlined, ExclamationCircleOutlined, DatabaseOutlined, LinkOutlined, BranchesOutlined} from "@ant-design/icons";

const cards = [
    { subtitle: 'TOTAL', icon: <DatabaseOutlined className="text-xl" />, color: 'bg-red-500', key: 'total' },
    { subtitle: 'LABELED', icon: <TagOutlined className="text-xl" />, color: 'bg-orange-500', key: 'labeled' },
    { subtitle: 'REFERENCES', icon: <LinkOutlined className="text-xl" />, color: 'bg-yellow-500', key: 'references' },
    { subtitle: 'COMMITS', icon: <BranchesOutlined className="text-xl" />, color: 'bg-sky-500', key: 'commits' },
];


export default function Stats() {
    const stats_query = useQuery(STATS_QUERY);

    if (stats_query.loading) return <p>Loading Stats...</p>;

    const stats = stats_query.data?.stats;

    return (
        <>
            {/* Header */}
            <div className="relative bg-teal-900 md:pt-22 pb-12 pt-12">
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
                                            icon={<ExclamationCircleOutlined />}
                                            statIconColor="bg-red-500"
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
                                            icon={icon}
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