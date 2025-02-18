import React, { FC, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface SplashScreen {
  setIsSplashFinished: (value: boolean) => void;
}

const SplashScreen: FC<SplashScreen> = ({ setIsSplashFinished }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        duration: 1500,
        toValue: 1,
        delay: 500,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        duration: 1500,
        toValue: 0,
        delay: 500,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      setIsSplashFinished(finished);
    });
  });

  return (
    <Animated.Image
      style={[styles.splashScreenImage, { opacity: fadeAnim }]}
      source={require('../../assets/images/splashScreen.png')}
    />
  );
};

const styles = StyleSheet.create({
  splashScreenImage: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#3C7548',
  },
});

export default SplashScreen;
