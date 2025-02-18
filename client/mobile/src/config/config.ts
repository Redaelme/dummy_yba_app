import Config from 'react-native-config';

const config = {
  servers: {
    graphqlUrl: Config.API_URL || 'http://10.2.2.4:4000/graphql',
    /*|| 'http://192.168.153.137:4000/graphql',
     */

    graphqlSubscriptionUrl: Config.WS_URL || 'ws://10.2.2.4:4000/graphql',
    mlEndpoint: Config.ML_ENDPOINT || 'http://localhost:5051',
  },
};

export default config;
