import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { CustomButton } from '../Custom/Button';
import { AuthenticationScreenNavigationProps } from '../../routes/route';
import YesBossLogoGreen from '../../assets/images/YesBossLogoGreen.svg';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLOR } from '../../Lib/theme';
import { useAuthContext } from '../../providers/AuthProvider/AuthProvider';

const Authentication: FC<AuthenticationScreenNavigationProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { googleSignIn, googleSignOut } = useAuthContext();
  const onPressLoginButton = () => {
    navigation.navigate('Login');
  };

  const onPressSignUpButton = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <YesBossLogoGreen style={styles.yesBossLogoGreen} width={wp('30%')} height={hp('15%')} />
      <Text style={styles.textStyle}>{t('auth.text.accessYourAccount')}</Text>
      <CustomButton title={t('auth.button.login')} onPress={onPressLoginButton} type="solid" />
      <CustomButton
        title={t('auth.button.registration')}
        onPress={onPressSignUpButton}
        type="outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: wp('5%'),
  },
  textStyle: {
    textAlign: 'center',
    color: COLOR.GREY,
    fontSize: RFValue(16),
    marginBottom: hp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  logoImage: {
    justifyContent: 'center',
  },
  yesBossLogoGreen: {
    alignSelf: 'center',
    marginBottom: hp('12%'),
  },
});

export default Authentication;
