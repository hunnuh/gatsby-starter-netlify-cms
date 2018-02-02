import React from "react";
import { renderToString } from "react-dom/server";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-fetch';

// function to generate hydrated state for client side Apollo
function makeApolloState(ssrClient) {
  const state = { apollo: ssrClient.getInitialState() }
  // appends apollo state to the global client window object
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
          /</g,
          `\\u003c`
        )};`
      }}
    />
  );
}

const client = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cjd56vfu6212z0183clcoouaa',
    fetch,
  }),
  cache: new InMemoryCache()
});

exports.replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents
}) =>
  new Promise((resolve) => {
    // bodyComponent is the entire React component tree for the page

    const ApolloQueries = (
      <ApolloProvider client={client}>

          {bodyComponent}

      </ApolloProvider>
    );
    resolve();
    // getDataFromTree walks ApolloQueries tree for all Apollo GQL queries
    // It runs the queries and mutates client object
    // getDataFromTree(ApolloQueries).then(() => {
    //   // renders ApolloQueries to string and then inserts it into the page
    //   replaceBodyHTMLString(renderToString(ApolloQueries))
    //   // sets head components with styled components and apollo state
    //   setHeadComponents([makeApolloState(client)])
    //   resolve();
    // })
  })
