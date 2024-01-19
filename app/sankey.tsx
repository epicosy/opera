import React from "react";
import { Chart } from "react-google-charts";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

const fetchBFLinks = async () => {

    const client = new ApolloClient({
        uri: `http://localhost:3001/graphql`,
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
        {
          links {
            at
            to
            count
          }
        }
        `
    })

    return data.links.map((key) => {
        return [key.at, key.to, key.count]
    })

}

export const options = {};

export default function SankeyChart() {

    const links = React.use(fetchBFLinks());
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
