import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";

import CardVulnerabilitiesByYearLineChart from "../components/Cards/cardVulnsByYearLineChart";
import CardAssignersPieChart from "../components/Cards/cardAssignersPieChart";
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
    const data = await fetchAssignersCounts()
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
                        <CardAssignersPieChart data={data}/>
                    </div>
                </div>
                <div className="flex flex-wrap mt-4">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardLatestVulnerabilities/>
                    </div>
                </div>
            </div>
        </>
    )
}
