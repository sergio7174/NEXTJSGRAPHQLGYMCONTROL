// lib/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://localhost:5000/graphql', // Replace with your GraphQL API endpoint
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;