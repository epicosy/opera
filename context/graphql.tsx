import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import React from "react";
import {addTypenameToDocument} from "@apollo/client/utilities";

interface GraphQLProviderProps {
    uri: string;
    headers: Record<string, string>;
    children: React.ReactNode;
}

export const GraphQLProvider = ({ uri, headers, children }: GraphQLProviderProps) => {
    const client = new ApolloClient({
        uri: uri,
        cache: new InMemoryCache({addTypename: false}),
        headers: headers,
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};