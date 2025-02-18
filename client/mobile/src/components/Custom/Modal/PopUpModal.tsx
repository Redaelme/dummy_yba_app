import React, { FC } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from '../Button';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

import Modal from 'react-native-modal';
import {useTranslation} from "react-i18next";

interface IBtnProps {
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  title: string;
  type: 'outline' | 'solid';
}
interface IPropsModal {
  isVisible: boolean;
  dropPress: (() => void) | undefined;
  animationOutTiming: number;
  msgModal: string;
  msgInstructionModatl?: string;
  btnOk: IBtnProps;
  btnCancel?: IBtnProps;
  height?: number;
  loading?: boolean;
}

export const PopUpModal: FC<IPropsModal> = (props) => {
  const {
    isVisible,
    dropPress,
    animationOutTiming,
    msgModal,
    msgInstructionModatl,
    btnOk,
    btnCancel,
    height,
    loading,
  } = props;

  const newHeight = height ? height.toString() + '%' : undefined;

  return (
    <Modal
      key={Math.random()} // used to make all modal usage to not depend on other modal
      isVisible={isVisible}
      onBackdropPress={dropPress}
      animationOutTiming={animationOutTiming}
      hideModalContentWhileAnimating
      useNativeDriver
      coverScreen={isVisible}
    >
      <View
        style={
          height
            ? [
                styles.modalContent,
                {
                  height: newHeight,
                },
              ]
            : styles.modalContent
        }
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.textStyle}>{msgModal}</Text>
          <Text style={styles.textStyle}>{msgInstructionModatl} </Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {btnCancel && (
            <View>
              <CustomButton
                onPress={btnCancel.onPress}
                title={btnCancel?.title}
                type={btnCancel?.type}
              />
            </View>
          )}
          {
            <View style={!btnCancel ? { width: wp('35%'), marginLeft: wp('2.2%') } : undefined}>
              <CustomButton
                loading={loading}
                onPress={btnOk.onPress}
                title={btnOk.title}
                type={btnOk.type}
              />
            </View>
          }
        </View>
      </View>
    </Modal>
  );
};

interface IPropsBottomModal {
  isVisible: boolean;
  dropPress: (() => void) | undefined;
  animationOutTiming: number;
  msgModal: string;
  setIsSwitch?: (value: React.SetStateAction<boolean>) => void;
  confirmButton?: boolean;
  confirmAction?: (params: any) => void;
  btnTitleConfirm?: string;
  btnTitleCancel?: string;
  btnCancelType?: 'solid' | 'outline';
  height?: number;
}

export const BottomModal: FC<IPropsBottomModal> = (props) => {
  const { t } = useTranslation();
  const {
    isVisible,
    dropPress,
    animationOutTiming,
    msgModal,
    setIsSwitch,
    confirmAction,
    confirmButton,
    btnTitleConfirm,
    btnTitleCancel,
    btnCancelType,
    height,
  } = props;

  const handleClick = () => {
    if (setIsSwitch) {
      setIsSwitch(false);
    }
    if (dropPress) dropPress();
  };

  const newHeight = height ? height.toString() + '%' : undefined;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClick}
      animationOutTiming={animationOutTiming}
      style={{
        justifyContent: 'flex-end',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
      }}
    >
      <View
        style={{
          ...styles.modalBottomContent,
          height: newHeight ? hp(newHeight) : hp('30%'),
        }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: hp('2%') }}
        >
          <Text style={{ ...styles.textStyle, marginBottom: hp('2%') }}>{msgModal}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: confirmButton && confirmAction ? 'space-between' : 'center',
            paddingHorizontal: wp('5%'),
          }}
        >
          <View style={{ width: wp('43%') }}>
            <CustomButton
              onPress={handleClick}
              title={btnTitleCancel ? btnTitleCancel : t('layout.close')}
              type={btnCancelType ? btnCancelType : 'solid'}
            />
          </View>
          {confirmButton && confirmAction && (
            <View style={{ width: wp('43%') }}>
              <CustomButton
                onPress={confirmAction}
                title={btnTitleConfirm ? btnTitleConfirm : 'ok'}
                type="solid"
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    marginBottom: hp('0.6%'),
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(14),
    color: 'gray',
    width: wp('80%'),
    textAlign: 'center',
  },
  modalContent: {
    opacity: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('1.21%'),
    marginRight: wp('1.21%'),
    borderRadius: RFValue(4),
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: hp('23.6%'),
  },
  modalBottomContent: {
    opacity: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    borderRadius: RFValue(4),
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: hp('1.5%'),
    borderTopLeftRadius: RFValue(40),
    borderTopRightRadius: RFValue(40),
    paddingTop: hp('5%'),
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: hp('9.44%'),
    width: wp('48.54%'),
    borderRadius: RFValue(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
