import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { COLOR } from '../../Lib/theme';
import SignUpIntroSlide2 from '../../assets/images/SignUpIntroSlide2.svg';

interface AppIntro {
  onPressGetStarted: () => void;
}

const AppIntro: FC<AppIntro> = ({ onPressGetStarted }) => {
  const { t } = useTranslation();

  const slides = [
    {
      key: 1,
      title: t('appIntro.first.title'),
      text: t('appIntro.first.description'),
      backgroundColor: COLOR.WHITE,
    }
  ];

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageAndTextView}>
          <Text style={{...styles.title,
            fontSize: RFValue(24),
            fontWeight: 'bold',
            marginBottom: hp('2.5%'),
          }}>Hey Boss!</Text>
          <Text style={{
            color: COLOR.GREY,
            opacity: 1,
            fontWeight: 'bold',
            // lineHeight: RFValue(20),
            textAlign: 'center',
            marginHorizontal: wp('0.5%'),
            fontFamily: 'Poppins-Regular',
            fontSize: RFValue(16),
          }}>{item.title}</Text>
          <View style={{
          // backgroundColor: 'red',
            width: wp('100%'),
            height: hp('40%'),
            justifyContent: 'center',
            alignItems: 'center',
            // marginBottom: hp('3%'),
          }}>
            <SignUpIntroSlide2 />
          </View>
          <Text style={{
            color: COLOR.GREY,
            opacity: 1,
            // lineHeight: RFValue(46),
            textAlign: 'center',
            marginHorizontal: wp('0.5%'),
            fontFamily: 'Poppins-Regular',
            fontSize: RFValue(14),
          }}>{item.text}</Text>
        </View>
          <View style={styles.buttonView}>{getStartedButton()}</View>
      </View>
    );
  };

  const getStartedButton = () => {
    return (
      <Button
        title={t('app.intro.button.getStarted')}
        onPress={onPressGetStarted}
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
      initialNumToRender={1}
      maxToRenderPerBatch={1}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('4%'),
  },
  imageAndTextView: {
    alignItems: 'center',
    height: hp('85%'),
    marginTop: hp('4%'),
    paddingHorizontal: wp('5%'),
  },
  imageView: {
    paddingHorizontal: wp('2%'),
  },
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
    // textTransform: 'uppercase',
    opacity: 1,
    // fontSize: RFValue(16),
    // lineHeight: RFValue(46),
    textAlign: 'center',
    marginHorizontal: wp('0.5%'),
    fontFamily: 'Poppins-SemiBold',
  },
  text: {
    color: COLOR.GREY,
    marginTop: hp('1%'),
    textAlign: 'center',
    fontSize: RFValue(14),
    fontFamily: 'Poppins-SemiBold',
    lineHeight: RFValue(19),
    paddingHorizontal: wp('2%'),
  },
  buttonStyle: {
    height: hp('6%'),
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

export default AppIntro;
