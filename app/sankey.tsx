import React from "react";
import { Chart } from "react-google-charts";
import {ApolloClient, gql, InMemoryCache, useQuery} from "@apollo/client";
import {LinkCount} from "../typings";

const client = new ApolloClient({ uri: `http://localhost:3001/graphql`, cache: new InMemoryCache() });

const BF_LINKS_QUERY = gql`
    query {
        links {
            at
            to
            count
        }
    }
`

export const options = {};

export default function SankeyChart() {
    const bf_links_query = useQuery(BF_LINKS_QUERY, {client});
    const links = bf_links_query.data?.links.map((key: LinkCount) => {
        return [key.at, key.to, key.count]
    })

    links.unshift(["From", "To", "Weight"])

    return (
        <Chart
            chartType="Sankey"
            width="100%"
            height="500px"
            data={links}
            options={options}
        />
    );
}
