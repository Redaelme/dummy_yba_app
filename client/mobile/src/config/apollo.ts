import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import config from './config';

export const createApolloClient = (token: string) => {
  console.log("####################################### inside createApolloClient#######################################");

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const httpLink = createHttpLink({
    uri: config.servers.graphqlUrl,
  });

  console.log('WS url ===>', config.servers.graphqlSubscriptionUrl);

  const wsLink = new WebSocketLink({
    uri: config.servers.graphqlSubscriptionUrl,
    options: {
      reconnect: true,
      connectionParams: {
        authorization: token,
      },
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );


  const cache = new InMemoryCache({
    typePolicies: {
      CalendarEvent: {
        fields: {
          start: {
            read(start: string) {
              return new Date(start);
            },
          },
          end: {
            read(end: string) {
              return new Date(end);
            },
          },
        },
      },
    },
  });
  const apolloClient = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: cache,
  });
  return apolloClient;
};
