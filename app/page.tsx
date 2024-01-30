"use client";
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";

import Panel from "../components/Panel";
import {GraphQLProvider} from "../context/graphql";

export default function Dashboard(){
    let defaultHeaders: Record<string, string> = {
        'client-name': 'opera',
        'client-version': process.env.npm_package_version || '',
    };

    return (
        <GraphQLProvider uri={process.env.GRAPHQL_API || 'http://localhost:4000/graphql'} headers={defaultHeaders} >
            <Panel/>
        </GraphQLProvider>
    );
}