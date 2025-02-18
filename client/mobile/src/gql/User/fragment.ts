import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
  fragment userInfos on User {
    id
    isAdmin
    email
    firstName
    lastName
    mailService
    contacts {
      displayName
      emailAddresses
    }
    modeFree
    beginModeFree
    isSingupBO
    isActive
    isPayed
    calendarType
    oauthStatus
  }
`;
