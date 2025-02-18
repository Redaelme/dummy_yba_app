import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SignUpIntroSliderNavigationProps } from '../../routes/route';
import AppIntroSlider from 'react-native-app-intro-slider';
import { COLOR, FONTS } from '../../Lib/theme';
import { useTranslation } from 'react-i18next';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'react-native-elements';
import SignUpIntroSlide1 from '../../assets/images/SignUpIntroSlide1.svg';
import SignUpIntroSlide2 from '../../assets/images/SignUpIntroSlide2.svg';
import SignUpIntroSlide3 from '../../assets/images/SignUpIntroSlide3.svg';
import SignUpIntroSlide4 from '../../assets/images/SignUpIntroSlide4.svg';
import { storeInfosUserInAsync } from '../SignUp/CreateAccount/CreateAccountLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpIntroSlider: FC<SignUpIntroSliderNavigationProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const slides = [
    {
      key: 1,
      title: t('signUpIntroSlider.description.first.title'),
      text: t('signUpIntroSlider.description.text'),
      backgroundColor: COLOR.WHITE,
    },
    {
      key: 2,
      title: t('signUpIntroSlider.description.second.title'),
      text: t('signUpIntroSlider.description.text'),
      backgroundColor: COLOR.WHITE,
    },
    {
      key: 3,
      title: t('signUpIntroSlider.description.third.title'),
      backgroundColor: COLOR.WHITE,
    },
    {
      key: 4,
      title: t('signUpIntroSlider.description.fourth.title'),
      backgroundColor: COLOR.WHITE,
    },
  ];

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        {item.key === 1 ? (
          <View style={styles.imageAndTextView}>
            <View style={{ minHeight: hp('22%') }}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.imageView}>
              <SignUpIntroSlide1 />
            </View>
          </View>
        ) : item.key === 2 ? (
          <View style={styles.imageAndTextView}>
            <View style={{ minHeight: hp('22%') }}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.imageView}>
              <SignUpIntroSlide2 />
            </View>
          </View>
        ) : item.key === 3 ? (
          <View style={styles.imageAndTextView}>
            <View style={{ minHeight: hp('22%') }}>
              <Text style={{ ...styles.text, fontFamily: FONTS.BOLD }}>{item.title}</Text>
            </View>
            <View style={styles.imageView}>
              <SignUpIntroSlide3 />
            </View>
          </View>
        ) : (
          <View style={styles.imageAndTextView}>
            <View style={{ minHeight: hp('22%') }}>
              <Text style={{ ...styles.text, fontFamily: FONTS.BOLD }}>{item.title}</Text>
            </View>
            <View style={styles.imageView}>
              <SignUpIntroSlide4 />
            </View>
          </View>
        )}
        <View style={styles.buttonView}>{item.key === 4 ? getStartedButton() : null}</View>
      </View>
    );
  };

  const initializeUserInfo = async () => {
    await storeInfosUserInAsync('', '', '', '');
    await AsyncStorage.removeItem('userEmail');
  };

  const onPressGetStartedSignUp = () => {
    initializeUserInfo();
    navigation.navigate('SignUp');
  };

  const getStartedButton = () => {
    return (
      <Button
        title={t('signUpIntroSlider.button')}
        onPress={onPressGetStartedSignUp}
        containerStyle={{
          marginBottom: RFValue(20),
          width: '100%',
        }}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitle}
      />
    );
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      showNextButton={false}
      showDoneButton={false}
      activeDotStyle={styles.activeDotStyle}
      dotStyle={styles.dotStyle}
      initialNumToRender={2}
      maxToRenderPerBatch={1}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
  },
  imageAndTextView: {
    alignItems: 'center',
    height: hp('95%'),
    marginTop: hp('2%'),
  },
  imageView: { marginTop: hp('10%') },
  buttonView: {
    justifyContent: 'center',
    height: hp('10%'),
    position: 'absolute',
    bottom: hp('5%'),
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: COLOR.GREY,
    opacity: 1,
    fontSize: RFValue(12),
    lineHeight: RFValue(20),
    textAlign: 'center',
    marginHorizontal: wp('0.5%'),
    fontFamily: 'Poppins-Bold',
    marginTop: hp('3%'),
    letterSpacing: RFValue(-0.19),
  },
  text: {
    color: COLOR.GREY,
    marginTop: hp('1%'),
    textAlign: 'center',
    fontSize: RFValue(12),
    fontFamily: 'Poppins-Regular',
    lineHeight: RFValue(20),
    width: wp('96%'),
    letterSpacing: RFValue(-0.19),
  },
  buttonStyle: {
    minHeight: hp('6%'),
    borderRadius: RFValue(4),
    opacity: 1,
    backgroundColor: COLOR.GREEN,
  },
  buttonTitle: {
    color: COLOR.WHITE,
    fontSize: RFValue(16),
    textTransform: 'uppercase',
  },
  activeDotStyle: {
    backgroundColor: COLOR.GREEN,
    height: RFValue(6),
    width: RFValue(6),
    marginHorizontal: wp('2%'),
    marginBottom: hp('1%'),
    bottom: hp('-2%'),
  },
  dotStyle: {
    backgroundColor: COLOR.SOFT_GREY,
    height: RFValue(6),
    width: RFValue(6),
    marginHorizontal: wp('2%'),
    marginBottom: hp('1%'),
    bottom: hp('-2%'),
  },
});

export default SignUpIntroSlider;
