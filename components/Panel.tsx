'use client';

import Stats from "./Stats";
import CardVulnerabilitiesByYearLineChart from "./Cards/cardVulnsByYearLineChart";
import CardPieChart from "./Cards/cardPieChart";
import CardLatestVulnerabilities from "./Cards/CardLatestVulnerabilities";
import {usePanelPage} from "../context/panel";

export default function Panel(){
    const { stats, assignersCount, tagsCount, vulnsByYearCount, latestVulns, loadingAssignersCount,
        loadingTagsCount, loadingVulnsByYearCount, loadingLatestVulns, errorStats, latestVulnsError } = usePanelPage();

    console.log('Vulns by year', vulnsByYearCount)
    console.log('latest vulns', latestVulns)

    return (
        <>
            <Stats stats={stats} error={errorStats} />

            <div className="px-4 md:px-10 mx-auto w-full my-12">
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardVulnerabilitiesByYearLineChart data={vulnsByYearCount} loading={loadingVulnsByYearCount} />
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={assignersCount} title="Assigners Distribution"
                                      fields={["Assigner", "Count"]} loading={loadingAssignersCount} />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <CardLatestVulnerabilities vulnerabilities={latestVulns} error={latestVulnsError}
                                                   loading={loadingLatestVulns} />
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <CardPieChart data={tagsCount} title="Tags Distribution" loading={loadingTagsCount}
                                      fields={["Tag", "Count"]}/>
                    </div>
                </div>
            </div>
        </>
    );
}