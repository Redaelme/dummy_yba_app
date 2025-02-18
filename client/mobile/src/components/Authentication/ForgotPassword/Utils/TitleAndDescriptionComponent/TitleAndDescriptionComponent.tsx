import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLOR, FONTS } from '../../../../../Lib/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';

interface TitleAndDescriptionProps {
  title: string;
  description: string;
}

const TitleAndDescriptionComponent = ({ title, description }: TitleAndDescriptionProps) => {
  return (
    <View style={styles.containerTextView}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerTextView: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.BOLD,
    fontSize: RFValue(20),
    lineHeight: RFValue(26),
    color: COLOR.GREY,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(12),
    lineHeight: RFValue(20),
    color: COLOR.GREY,
    textAlign: 'center',
    marginTop: hp('1%'),
    marginHorizontal: wp('4%'),
  },
});

export default TitleAndDescriptionComponent;
