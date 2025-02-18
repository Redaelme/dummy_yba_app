import React, { createContext, FC, useState } from 'react';

interface tabBarVisibleType {
  isTabBarVisible: boolean;
  setIsTabBarVisible: (isTabBarVisible: boolean) => void;
  isInRdvListView: boolean;
  setIsInRdvListView: (isTabBarVisible: boolean) => void;
}

export const TabBarVisibleContext = createContext<tabBarVisibleType>({
  isTabBarVisible: true,
  setIsTabBarVisible: () => {},
  isInRdvListView: true,
  setIsInRdvListView: () => {},
});

const TabBarVisibleProvider: FC = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);
  const [isInRdvListView, setIsInRdvListView] = useState<boolean>(true);

  return (
    <TabBarVisibleContext.Provider
      value={{ isTabBarVisible, setIsTabBarVisible, isInRdvListView, setIsInRdvListView }}
    >
      {children}
    </TabBarVisibleContext.Provider>
  );
};

export default TabBarVisibleProvider;
