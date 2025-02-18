import React from 'react';
import { MutableRefObject } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLOR } from '../../../../../Lib/theme';

interface CodeInputComponentProps {
  placeholder: string | '';
  value: string | '';
  onChangeText?: ((text: string) => void) | undefined;
  onChange?: (() => void) | undefined;
  onEndEditing?: (() => void) | undefined;
  autoFocusInput?: boolean | undefined;
  refProps?: any | undefined;
  containerStyle?: object | undefined;
}

const CodeInputComponent = ({
  placeholder,
  value,
  onChangeText,
  onChange,
  onEndEditing,
  autoFocusInput,
  refProps,
  containerStyle,
}: CodeInputComponentProps) => {
  return (
    <View style={[styles.backgroundStyle, containerStyle]}>
      <TextInput
        ref={refProps}
        style={styles.textInputStyle}
        placeholder={placeholder}
        value={value}
        maxLength={1}
        keyboardType="numeric"
        onChange={onChange}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        autoFocus={autoFocusInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    marginTop: hp('3%'),
    backgroundColor: '#DBDBDB45',
    minHeight: hp('6%'),
    borderRadius: RFValue(5),
    flexDirection: 'row',
    fontSize: RFValue(14),
    letterSpacing: RFValue(0.5),
    width: wp('12%'),
  },
  textInputStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: RFValue(14),
    letterSpacing: 0.5,
    color: COLOR.GREY,
    textAlign: 'center',
  },
});

export default CodeInputComponent;
