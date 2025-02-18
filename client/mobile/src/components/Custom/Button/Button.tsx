import React, { FC } from 'react';
import { StyleSheet, GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLOR } from '../../../Lib/theme';

interface CustomButtonProps {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  type: 'solid' | 'outline';
  title: string;
  loading?: boolean | undefined;
  desabled?: boolean | undefined;
}

const CustomButton: FC<CustomButtonProps> = (props) => {
  const buttonType =
    props.type && props.type === 'outline' ? styles.btnOutline : styles.btnSolid || styles.btnSolid;

  return (
    <Button
      title={props.title}
      containerStyle={{
        marginBottom: hp('2.5%'),
      }}
      buttonStyle={{
        ...styles.buttonStyle,
        ...buttonType,
      }}
      titleStyle={props.type === 'solid' ? styles.titleSolid : styles.titleOutline}
      onPress={props.onPress}
      loading={props.loading}
      disabled={props.desabled}
      disabledStyle={{ ...styles.buttonStyle, ...buttonType, opacity: 0.7 }}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    minHeight: hp('6%'),
    borderRadius: RFValue(4),
    opacity: 1,
    alignItems: 'center',
  },
  btnSolid: {
    backgroundColor: COLOR.GREEN,
  },
  btnOutline: {
    borderColor: COLOR.GREEN,
    backgroundColor: COLOR.WHITE,
    borderWidth: RFValue(2),
  },
  titleSolid: {
    color: COLOR.WHITE,
    textTransform: 'uppercase',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Medium',
    lineHeight: RFValue(22),
  },
  titleOutline: {
    color: COLOR.GREEN,
    textTransform: 'uppercase',
    fontSize: RFValue(16),
    fontFamily: 'Poppins-Medium',
    lineHeight: RFValue(22),
  },
});

export default CustomButton;
