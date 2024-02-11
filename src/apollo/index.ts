import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.apito.io/secured/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer Oxnqob2S8ivEBvxuEJTCCZqkTkkyWlUFDtggYNMQFAKpbKf1TBxPac07ZjdbynU2uKrQ1rcODW7zpgINR3tJhThnlsetEQQER8PVyFPNZSMqUJeMQ5BG3mu7Wk4BvfHV5mR0N5sSM9g6dAoUtyZV9HctJbdp`,
  },
});

export default client;
