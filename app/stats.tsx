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


export default function Stats() {
  const stats_query = useQuery(STATS_QUERY, {client});

  if (stats_query.loading) return <p>Loading Stats...</p>;

  if (stats_query.error){
    return <p>Error: Could not fetch Stats :(</p>;
  }

  const stats = stats_query.data?.stats;


  return (
    <>
      {/* Header */}
      <div className="relative bg-gray-800 md:pt-22 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOTAL"
                  statTitle={stats.total}
                  statIconName="far fa-database"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="LABELED"
                  statTitle={stats.labeled}
                  statIconName="fas fa-tag"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="REFERENCES"
                  statTitle={stats.references}
                  statIconName="fas fa-link"
                  statIconColor="bg-yellow-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="COMMITS"
                  statTitle={stats.commits}
                  statIconName="fas fa-code-commit"
                  statIconColor="bg-sky-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
