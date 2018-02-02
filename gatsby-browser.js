import React from 'react'
import { Router } from 'react-router-dom'
import { ApolloProvider, createNetworkInterface } from 'react-apollo'
import  ApolloClient from 'apollo-client';
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjd55avxm3c7b0191u53uobn4' }),
  cache: new InMemoryCache()
});


exports.replaceRouterComponent = ({ history }) => {

    const ConnectedRouterWrapper = ({ children }) => (
        <ApolloProvider client={client}>
            <Router history={history}>{children}</Router>
        </ApolloProvider>
    )

    return ConnectedRouterWrapper
}
