import React, {FC, useContext, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, StyleSheet, View,} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import WelcomeBoss from '../../assets/images/WelcomeBoss.svg';
import YesBossWithoutText from '../../assets/images/YesBossWithoutText.svg';
import {WelcomeBossScreenNavigationProps} from '../../routes/route';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import {MeContext} from '../../providers/me/meProvider';
import {useNotificationContext} from "../../providers/NotificationProvider/NotificationProvider";

const WeclomeBoss: FC<WelcomeBossScreenNavigationProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { me } = useContext(MeContext);
  const { requestPermissions } = useNotificationContext();


  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        duration: 2000,
        toValue: 1,
        delay: 500,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        duration: 2000,
        toValue: 0,
        delay: 500,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        navigation.navigate('Tabs');
      }
    });
  });

  useEffect(() => {
    (async () => {
      console.log('requesting permissions');
      if (me?.id)
        await requestPermissions();
    })();
  }, [me]);


  return (
    <View style={styles.container}>
      <WelcomeBoss style={styles.welcomeBossStyle} width={wp('100%')} height={hp('40%')} />
      <YesBossWithoutText style={styles.yesBossLogo} width={wp('20%')} height={hp('10%')} />
      <Animated.Text style={[styles.textStyle, { opacity: fadeAnim }]}>
        {t('login.success.text.welcomeBoss')}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  welcomeBossStyle: {
    marginTop: hp('3%'),
    alignSelf: 'center',
  },
  yesBossLogo: {
    marginTop: hp('-5%'),
  },
  textStyle: {
    color: '#5C6360',
    marginTop: hp('1%'),
    fontSize: RFValue(19),
    fontFamily: 'Poppins-Bold',
  },
});

export default WeclomeBoss;
