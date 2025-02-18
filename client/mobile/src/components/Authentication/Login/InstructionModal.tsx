import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLOR, FONTS } from '../../../Lib/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FC, useEffect, useState } from 'react';
import { CustomButton } from '../../Custom/Button';
import Modal from 'react-native-modal';

interface IProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  contentModal: string;
  btnLabel: string;
}

export const InstructionModal: FC<IProps> = ({
  isVisible,
  setIsVisible,
  contentModal,
  btnLabel,
}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
      <View
        style={{
          backgroundColor: COLOR.WHITE,
          borderRadius: RFValue(10),
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: wp('7%'),
        }}
      >
        <Text
          style={[
            styles.textStyle,
            {
              paddingVertical: hp('2%'),
              fontFamily: FONTS.REGULAR,
              fontSize: RFValue(13),
              lineHeight: RFValue(25),
            },
          ]}
        >
          {contentModal}
        </Text>
        <View style={{ minWidth: wp('38%') }}>
          <CustomButton onPress={() => setIsVisible(false)} title={btnLabel} type={'solid'} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: FONTS.MEDIUM,
    fontSize: RFValue(15),
    lineHeight: RFValue(20),
    letterSpacing: RFValue(-0.26),
    color: '#5C6360',
    textAlign: 'center',
    alignItems: 'center',
  },
});
