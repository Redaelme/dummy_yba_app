import gql from 'graphql-tag';
import { USER_FRAGMENT } from './fragment';

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      ...userInfos
    }
  }
  ${USER_FRAGMENT}
`;

