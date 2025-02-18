import React, { createContext } from 'react';
import { useState } from 'react';
import { COLOR } from '../../Lib/theme';

interface StatusBarContextType {
  statusBarValues: {
    bgColor: string;
    newBarStyle: 'default' | 'light-content' | 'dark-content';
  };
  setStatusBarValues: (StatusBarValues: {
    bgColor: string;
    newBarStyle: 'default' | 'light-content' | 'dark-content';
  }) => void;
}

export const StatusBarContext = createContext<StatusBarContextType>({
  statusBarValues: { bgColor: COLOR.WHITE, newBarStyle: 'dark-content' },
  setStatusBarValues: () => {},
});

const StatusBarValueProvider = (props: any) => {
  const [statusBarValues, setStatusBarValues] = useState<{
    bgColor: string;
    newBarStyle: 'default' | 'light-content' | 'dark-content';
  }>({ bgColor: COLOR.WHITE, newBarStyle: 'dark-content' });

  return (
    <StatusBarContext.Provider value={{ statusBarValues, setStatusBarValues }}>
      {props.children}
    </StatusBarContext.Provider>
  );
};

export default StatusBarValueProvider;
