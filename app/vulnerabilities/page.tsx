import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";
//import VulnerabilityList from "./VulnerabilityList";
import CardVulnerabilityTable from "./CardVulnerabilityTable";
export default function Vulnerabilities() {
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CardVulnerabilityTable />
                </div>
            </div>
        </>
    )
}