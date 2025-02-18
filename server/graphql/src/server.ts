/* eslint-disable no-new */
import 'log-timestamp';
import {ApolloError, ApolloServer} from 'apollo-server';
import {GraphQLError} from 'graphql';
import {serverConfiguration} from './configs/config';
import {createContext, validateToken} from './configs/context';
import {configureRedis} from './configs/redis';
import ErrorNameSet, {UNKNOWN_ERROR} from './schema/graphql/errors';
import {schema} from './schema/schema';
import firebase from 'firebase-admin';
import app from "./restAPI";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const servicesAccount = require('./utils/hairunproject.json');

const {redis, pubsub} = configureRedis();

const server = new ApolloServer({
    schema,
    context: (req) => createContext(req, redis, pubsub),
    subscriptions: {
        path: '/graphql',
        onConnect: (connectionParams) => {
            const token = (connectionParams as { authorization: string }).authorization;
            if (token) {
                const userId = validateToken(token.replace('Bearer ', ''));
                return {userId};
            }

            throw new Error('Missing auth token!');
        },
    },
    formatError: (error: GraphQLError) => {
        console.log(error);

        if (!['SyntaxError', 'ValidationError'].includes(error.name)) {
            const originalError: (Error & { extensions?: Record<string, any> }) | null | undefined =
                error.originalError;

            if (originalError && !ErrorNameSet.has(originalError.name))
                return new ApolloError(originalError.message, UNKNOWN_ERROR, {
                    original: {
                        name: originalError.name,
                        stack: originalError.stack,
                    },
                });
        }

        return error;
    },
});
const initializeFBApp = async () => {
    await firebase.initializeApp({
        credential: firebase.credential.cert({...servicesAccount}),
        databaseURL: 'https://com.yesboss.firebaseio.com',
    });
};




initializeFBApp();
app.listen(serverConfiguration.REST_API_PORT, serverConfiguration.REST_API_HOST, () => {
    console.log(
        `🚀  REST API server ready at http://${serverConfiguration.REST_API_HOST}:${serverConfiguration.REST_API_PORT}/`,
    );
});
server
    .listen({port: serverConfiguration.GRAPHQL_SERVER_PORT})
    .then(async ({url, subscriptionsUrl}) => {
        console.log(`🚀  Graphql server ready at ${url}graphql`);
        console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`);
        console.log('🚀  Starting server at time:', new Date().toISOString());

    });
