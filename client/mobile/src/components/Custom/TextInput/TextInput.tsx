import React, { FC, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLOR } from '../../../Lib/theme';

interface CustomTextInputProps {
  placeholder: string | '';
  isEyeIcon: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  secureTextEntry?: boolean;
  value: string | '';
  onChangeText?: ((text: string) => void) | undefined;
  containerStyle?: object | undefined;
  textInputStyle?: object | undefined;
  onChange?: (() => void) | undefined;
    editable?: boolean;
}

const CustomTextInput: FC<CustomTextInputProps> = (props) => {
  const textInputRef = useRef<TextInput>(null);
  const { secureTextEntry } = props;
  useEffect(() => {
    if (textInputRef && textInputRef.current && textInputRef.current.setNativeProps) {
      textInputRef.current.setNativeProps({
        secureTextEntry,
        style: {
          fontFamily: 'Poppins-Medium',
        },
      });
    }
  }, [secureTextEntry]);
  return (
    <View style={[styles.backgroundStyle, props.containerStyle]}>
      <TextInput
        ref={textInputRef}
        placeholder={props.placeholder}
        placeholderTextColor="#5C6360"
        style={[styles.textInputStyle, { fontFamily: 'Poppins-Medium' }, props.textInputStyle]}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
        onChange={props.onChange}
        editable={props.editable !== false}
      />
      {props.isEyeIcon ? (
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onPress={props.onPress}
        >
          <Icon
            name={props.secureTextEntry && props.secureTextEntry === true ? 'eye-off' : 'eye'}
            style={styles.iconEye}
          />
        </TouchableOpacity>
      ) : undefined}
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
  },
  iconEye: {
    alignSelf: 'center',
    fontSize: RFValue(26),
    marginHorizontal: wp('3%'),
    letterSpacing: RFValue(0.5),
    fontFamily: 'Poppins-Medium',
  },
  textInputStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: RFValue(14),
    letterSpacing: 0.5,
    paddingLeft: wp('4%'),
    color: COLOR.GREY,
  },
});

export default CustomTextInput;
