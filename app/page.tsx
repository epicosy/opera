"use client"
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";

import CardVulnerabilitiesByYearLineChart from "../components/Cards/cardVulnsByYearLineChart";
import CardPieChart from "../components/Cards/cardPieChart";
import CardLatestVulnerabilities from "./cardLatestVulnerabilities";
import Stats from "./stats";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const ASSIGNERS_COUNTS_QUERY = gql`
    query {
        assigners(company: true) {
            key
            value
        }
    }
`

const TAGS_COUNTS_QUERY = gql`
    query {
        tags {
            key
            value
        }
    }
`

const VULNS_BY_YEAR_QUERY = gql`
    query {
        vulnsByYear {
            key
            value
        }
    }
`

export default function Dashboard(){
    const assigners_counts_query = useQuery(ASSIGNERS_COUNTS_QUERY, { client });
    const tags_counts_query = useQuery(TAGS_COUNTS_QUERY, { client });
    const vulns_by_year_query = useQuery(VULNS_BY_YEAR_QUERY, { client });

    return (
        <>
            <Stats/>
            <div className="px-4 md:px-10 mx-auto w-full -m-24">
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardVulnerabilitiesByYearLineChart data={vulns_by_year_query.data?.vulnsByYear}/>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={assigners_counts_query.data?.assigners} title="Assigners Distribution"
                                      fields={["Assigner", "Count"]}/>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardLatestVulnerabilities/>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={tags_counts_query.data?.tags} title="Tags Distribution"
                                      fields={["Tag", "Count"]}/>
                    </div>
                </div>
            </div>
        </>
    )
}