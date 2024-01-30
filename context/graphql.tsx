import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import React from "react";

interface GraphQLProviderProps {
    uri: string;
    headers: Record<string, string>;
    children: React.ReactNode;
}

export const GraphQLProvider = ({ uri, headers, children }: GraphQLProviderProps) => {
    const client = new ApolloClient({
        uri: uri,
        cache: new InMemoryCache(),
        headers: headers,
    });

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};