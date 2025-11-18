// `app/ApolloWrapper.jsx`
/*'use client';
 
import { HttpLink } from "@apollo/client";
 import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
 
  function makeClient() {
    const httpLink = new HttpLink({
       uri: 'http://localhost:5000/graphql',
    });
 
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }
 
  export function ApolloWrapper({ children }) {
    return (
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    );
  }*/
 "use client";
import { ApolloLink, HttpLink, setLogVerbosity } from "@apollo/client";
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { Defer20220824Handler } from "@apollo/client/incremental";

setLogVerbosity("debug");

function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:3000/api/graphql",
    fetchOptions: { cache: "no-store" },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
    incrementalHandler: new Defer20220824Handler(),
  });
}

export function ApolloWrapper({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
