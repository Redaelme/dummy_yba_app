import React, { FC } from 'react';
import { View, Switch } from 'react-native';
import { COLOR } from '../../../Lib/theme';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface SwitchProps {
  switchValue: boolean;
  onChangeSwitchValue: () => void;
  isDesabled?: boolean;
}

const CustomSwitch: FC<SwitchProps> = ({ switchValue, onChangeSwitchValue, isDesabled }) => {
  return (
    <View>
      <Switch
        trackColor={{ false: COLOR.BOLD_GREY, true: COLOR.SOFT_GREEN }}
        thumbColor={switchValue ? COLOR.GREEN : '#f4f3f4'}
        disabled={isDesabled ? true : false}
        ios_backgroundColor="#00000061"
        onValueChange={onChangeSwitchValue}
        value={switchValue}
        style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }], paddingTop: hp('0.6%') }}
      />
    </View>
  );
};

export default CustomSwitch;
