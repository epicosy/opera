"use client";
import React from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";

import Panel from "../components/Panel";
import {GraphQLProvider} from "../context/graphql";
import {PanelPageProvider} from "../context/panel";

export default function Dashboard(){
    const graphqlUri = process.env.GRAPHQL_API || 'http://localhost:4000/graphql';

    let defaultHeaders: Record<string, any > = {
        'client-name': 'opera',
        'client-version': process.env.npm_package_version || ''
    };

    return (
        <GraphQLProvider uri={graphqlUri} headers={defaultHeaders} >
            <PanelPageProvider>
                <Panel/>
            </PanelPageProvider>
        </GraphQLProvider>
    );
}