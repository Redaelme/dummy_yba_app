import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        email
        lastName
        email
        modeFree
        beginModeFree
        isActive
        isPayed
      }
      completedSignUp
    }
  }
`;

export const UPDATEUSERPROFILE = gql`
  mutation UpdateUserProfile($id: String!, $input: UserProfileInput!) {
    updateProfile(id: $id, input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const SIGNUP = gql`
  mutation SignUp($userInput: UserCreateInput!) {
    signUp(userInput: $userInput) {
      user {
        id
        isSingupBO
      }
      token
    }
  }
`;

export const FORGOTPASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const CHECKEXPIREDTOKEN = gql`
  mutation CheckExpiredToken($email: String!, $token: String!) {
    checkExpiredToken(email: $email, token: $token) {
      success
      message
    }
  }
`;

export const RESETPASSWORD = gql`
  mutation ResetPassword($resetPasswordInput: ResetPasswordInput!) {
    resetPassword(input: $resetPasswordInput) {
      success
      message
    }
  }
`;

export const UPDATEAUTH = gql`
  mutation UpdateAuth($oauthUpdateInput: OauthUpdateInput!) {
    updateAuth(data: $oauthUpdateInput)
  }
`;

export const GENERATEACCESSTOKEN = gql`
  mutation GenerateAccessToken($code: String!) {
    generateAccessToken(code: $code) {
      token
      refresh_token
      expiry_date
      token_type
    }
  }
`;
export const REVOKE_NOTIFICATION_TOKEN = gql`
  mutation RevokeNotificationToken($token: String!) {
    revokeNotificationToken(token: $token)
  }
`;
export const ADD_NOTIFICATION_TOKEN = gql`
  mutation AddNotificationToken($userId: String!, $token: String!) {
    addNotificationToken(userId: $userId, token: $token)
  }
`;


export const SAVE_USER_FCM_TOKEN = gql`
  mutation SaveUserFcmToken($userId: String!, $token: String!) {
    saveUserFCMToken(userId: $userId, token: $token)
  }
`;

export const GET_USER_MAIL = gql`
  mutation GetMailUser($data: GetMailInputs) {
    getUserMail(data: $data) {
      cc
      id
      content
      htmlBody
      isRead
      object
      receivedDateTime
      recipients
      subject
      sender {
        emailAddress
        name
      }
    }
  }
`;
