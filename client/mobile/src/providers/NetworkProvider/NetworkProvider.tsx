import React, { FC, useState, createContext } from 'react';

interface NetworkContextType {
  isNetworkAvailable: boolean;
  setIsNetworkAvailable: (value: boolean) => void;
}

export const NetworkContext = createContext<NetworkContextType>({
  isNetworkAvailable: false,
  setIsNetworkAvailable: () => {},
});

interface NetworkProviderProps {}

const NetworkProvider: FC<NetworkProviderProps> = (props) => {
  const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(false);

  return (
    <NetworkContext.Provider
      value={{
        isNetworkAvailable,
        setIsNetworkAvailable: (value) => {
          setIsNetworkAvailable(value);
        },
      }}>
      {props.children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
