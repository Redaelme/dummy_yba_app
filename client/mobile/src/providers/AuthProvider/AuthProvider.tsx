import React, { useContext } from 'react';
import { createContext, FC, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthManager } from '../../../emailService/microsoft/auth/authManager';
import { GraphManager } from '../../../emailService/microsoft/graph/graphManager';
import { GoogleAuthManager } from '../../../emailService/gmail/googleAuthManager';

type AuthType = {
  token: string | null;
  fromSignUp: boolean | null;
  product: any;
  purchased: boolean;
  setProduct: (value: any) => void;
  setPurchased: (purcharsed: boolean) => void;
  setFromSignUp: (value: boolean) => void;
  login: (token: string | null) => void;
  logout: () => void;
  // MS Outlook
  outLookSignIn: () => Promise<void> | null;
  outlookSignOut: () => Promise<void> | null;
  // Google
  googleSignIn: () => Promise<{
    idToken: string;
    google_accesToken: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      photo: string | null;
      familyName: string | null;
      givenName: string | null;
    };
    serverCode: string | null;
  } | null> | null;
  googleSignOut: () => Promise<void> | null;
  googleToken: string | null;
  setGoogleToken: (googleToken: string) => void;
  googleSubscribe: () => void;
};

export const AuthContext = createContext<AuthType>({
  token: null,
  fromSignUp: false,
  purchased: false,
  product: {},
  setProduct: (value: any) => {},
  setPurchased: (purchased: boolean) => {},
  setFromSignUp: (val: boolean) => {},
  login: () => {},
  logout: () => {},
  outLookSignIn: () => null,
  outlookSignOut: () => null,
  googleSignIn: () => null,
  googleSignOut: () => null,
  googleToken: null,
  setGoogleToken: (googleToken: string) => {},
  googleSubscribe: () => null,
});

export const AuthProvider: FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [fromSignUp, setFromSignUp] = useState<boolean | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [purchased, setPurchased] = useState(false); //set to true if the user has active subscription
  const [product, setProduct] = useState({}); //used to store list of products

  const outLookSignIn = async () => {
    await AuthManager.signInAsync();
    const token = await AuthManager.getAccessTokenAsync();
    console.log(`token :>> `, token);
    // To confirm
    const user = await GraphManager.getUserAsync();
    console.log('USER ===>', user);
  };

  const outlookSignOut = async () => {
    await AuthManager.signOutAsync();
  };

  const googleSignIn = async () => {
    const result = await GoogleAuthManager.signInAsync();

    if (result) {
      return result;
    }
    return null;
  };

  const googleSignOut = async () => {
    await GoogleAuthManager.signOutAsync();
  };
  const googleSubscribe = () => {
    GoogleAuthManager.subscribeMouthly(setProduct);
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        fromSignUp,
        setFromSignUp,
        login: (token: string | null) => {
          AsyncStorage.setItem('token', token ? token : '');
          setToken(token);
        },
        logout: async () => {
          AsyncStorage.removeItem('token');
          setToken(null);
        },
        outLookSignIn,
        outlookSignOut,
        googleSignIn,
        googleSignOut,
        googleToken,
        setGoogleToken,
        googleSubscribe,
        product,
        setProduct,
        purchased,
        setPurchased,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext<AuthType>(AuthContext);
