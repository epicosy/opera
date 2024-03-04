'use client';
import {useQuery} from "@apollo/client";
import {ASSIGNERS_COUNTS_QUERY, TAGS_COUNTS_QUERY, VULNS_BY_YEAR_QUERY} from "../src/graphql/queries";
import Stats from "./Stats";
import CardVulnerabilitiesByYearLineChart from "./Cards/cardVulnsByYearLineChart";
import CardPieChart from "./Cards/cardPieChart";
import CardLatestVulnerabilities from "./Cards/CardLatestVulnerabilities";
import React from "react";

export default function Panel(){
    const assigners_counts_query = useQuery(ASSIGNERS_COUNTS_QUERY);
    const tags_counts_query = useQuery(TAGS_COUNTS_QUERY);
    const vulns_by_year_query = useQuery(VULNS_BY_YEAR_QUERY);

    return (
        <>
            <Stats/>

            <div className="px-4 md:px-10 mx-auto w-full my-12">
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardVulnerabilitiesByYearLineChart data={vulns_by_year_query.data?.vulnsByYear}/>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={assigners_counts_query.data?.assignersCount} title="Assigners Distribution"
                                      fields={["Assigner", "Count"]}/>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardLatestVulnerabilities/>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={tags_counts_query.data?.tagsCount} title="Tags Distribution"
                                      fields={["Tag", "Count"]}/>
                    </div>
                </div>
            </div>
        </>
    );
}