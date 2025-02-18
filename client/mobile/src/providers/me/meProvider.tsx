import React, {createContext, FC, useContext, useEffect, useState} from 'react';
import { useGetUserProfileLazyQuery } from '../../generated/graphql';
import create from 'zustand';
import { CalendarTypes, NO_REFRESH_TOKEN_IS_SET_ERROR } from '../../commons/constant';
import { AuthContext } from '../AuthProvider/AuthProvider';

interface meInterface {

  me: {
    id: string;
    nom: string;
    prenom: string;
    mail: string;
    isPayed: boolean;
    calendarType: string;
    oauthStatus: string;
    mailService: string;
  } | null;
  setMe: (me: {
    id: string;
    nom: string;
    prenom: string;
    mail: string;
    isPayed: boolean;
    calendarType: string;
    oauthStatus: string;
    mailService: string;
  }) => void;
}


export const MeContext = createContext<meInterface>({
  me: null,
  setMe: () => {},
});


interface PurchaseProps {
  isPurchased: boolean;
  setIsPurchased: () => void;
  isUserClickSub: boolean;
  setIsUserClickSub: () => void;
}

export const purchaseState = create<PurchaseProps>((set) => ({
  isPurchased: false,
  setIsPurchased: () =>
    set((state) => ({
      isPurchased: state.isPurchased ? false : true,
    })),
  isUserClickSub: false,
  setIsUserClickSub: () =>
    set((state) => ({
      isUserClickSub: state.isUserClickSub ? false : true,
    })),
}));

export const MeProvider: FC = ({ children }) => {
  const [me, setMe] = useState<{
    id: string;
    nom: string;
    prenom: string;
    mail: string;
    isPayed: boolean;
    calendarType: string;
    oauthStatus: string;
    mailService: string;
  } | null>(null);
  // const UTC = new Date().getTimezoneOffset();
  // const { logout } = useContext(AuthContext);



  // const [doGetMe, { loading }] = useGetUserProfileLazyQuery({
  //   onCompleted: (res) => {
  //     console.log('getMe', res);
  //     if (res && res.me) {
  //       setMe({
  //         id: res.me.id,
  //         nom: res.me.lastName || '',
  //         prenom: res.me.firstName || '',
  //         mail: res.me.email || '',
  //         isPayed: res.me.isPayed !== undefined && res.me.isPayed !== null ? res.me.isPayed : true,
  //         calendarType: res.me.calendarType || '',
  //         oauthStatus: res.me.oauthStatus || '',
  //         mailService: res.me.mailService || '',
  //       });
  //     }
  //   },
  //
  //
  //   onError: (error) => {
  //     console.log('getMe error', error.message);
  //     if (error.message === NO_REFRESH_TOKEN_IS_SET_ERROR) {
  //       logout();
  //     }
  //   },
  // });
  //
  // // call getMe every 10sec
  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('getMe interval');
  //     getMe();
  //   }, 10000);
  //   return () => clearInterval(interval);
  //
  //   }
  //   , []);
  //
  // const getMe = () => {
  //   console.log('getMe called');
  //   doGetMe();
  // };
  return <MeContext.Provider value={{ me, setMe }}>{children}</MeContext.Provider>;
};
export const useMeContext = () => useContext<meInterface>(MeContext);
