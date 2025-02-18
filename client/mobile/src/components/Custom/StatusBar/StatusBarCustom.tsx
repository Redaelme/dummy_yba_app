import React, { FC } from 'react';
import { StatusBar } from 'react-native';

interface IProps {
  bgColor: string;
  newBarStyle: 'default' | 'light-content' | 'dark-content';
}

export const StatusBarCustom: FC<IProps> = ({ bgColor, newBarStyle }) => {
  return <StatusBar backgroundColor={bgColor} barStyle={newBarStyle} />;
};
