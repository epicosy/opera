import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";

import CardVulnerabilitiesByYearLineChart from "../components/Cards/cardVulnsByYearLineChart";
import CardPieChart from "../components/Cards/cardPieChart";
import CardLatestVulnerabilities from "./cardLatestVulnerabilities";
import Stats from "./stats";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";


const fetchAssignersCounts = async () => {

    const client = new ApolloClient({
        uri: `http://localhost:3001/graphql`,
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
        query {
          assigners(company: true){
            key
            value
          }
        }
        `
    })

    return data.assigners
}

const fetchTagsCounts = async () => {

    const client = new ApolloClient({
        uri: `http://localhost:3001/graphql`,
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
            query {
                tags{
                    key
                    value
                }
            }
        `
    })

    return data.tags
}

const fetchVulnerabilitiesCountByYear = async () => {

    const client = new ApolloClient({
        uri: `http://localhost:3001/graphql`,
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
        query{
          vulnsByYear{
            key
            value
          }
        }
        `
    })

    return data.vulnsByYear
}

export default async function Dashboard(){
    const assigners_counts = await fetchAssignersCounts()
    const tags_counts = await fetchTagsCounts()
    const vulns_by_year = await fetchVulnerabilitiesCountByYear()

    return (
        <>
            <Stats/>
            <div className="px-4 md:px-10 mx-auto w-full -m-24">
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                         <CardVulnerabilitiesByYearLineChart data={vulns_by_year}/>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={assigners_counts} title="Assigners Distribution"
                                      fields={["Assigner", "Count"]}/>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardLatestVulnerabilities/>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={tags_counts} title="Tags Distribution"
                                      fields={["Tag", "Count"]}/>
                    </div>
                </div>
            </div>
        </>
    )
}
