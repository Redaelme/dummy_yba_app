import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { ForgotPasswordNavigationProps } from '../../../routes/route';
import CustomHeader from '../../Custom/Header/Header';
import { CustomStepIndicator } from '../../Custom/StepIndicator';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { EmailField } from './EmailField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VerificationCodeField } from './VerificationCodeField';
import { NewPasswordField } from './NewPasswordInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgotPassword: FC<ForgotPasswordNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const labels = [
    t('forgotPassword.step1.name'),
    t('forgotPassword.step2.name'),
    t('forgotPassword.step3.name'),
  ];
  const [page, setPage] = useState('Email');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [swipeScroll, setswipeScroll] = useState(false);

  const onPressBackButton = async () => {
    await AsyncStorage.removeItem('forgotPassEmail');
    await AsyncStorage.removeItem('forgotPassToken');
    navigation.navigate('Login');
  };

  const renderViewPagerPage = (data: string) => {
    if (data === 'Email') {
      return (
        <View key={data} style={styles.page}>
          <EmailField
            setPage={setPage}
            setswipeScroll={setswipeScroll}
            setCurrentPage={setCurrentPage}
          />
        </View>
      );
    } else if (data === 'Code') {
      return (
        <View key={data} style={styles.page}>
          <VerificationCodeField setPage={setPage} setCurrentPage={setCurrentPage} />
        </View>
      );
    } else {
      return (
        <View key={data} style={styles.page}>
          <NewPasswordField
            setPage={setPage}
            setCurrentPage={setCurrentPage}
            navigation={navigation}
            route={route}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <CustomHeader
          backContext={t('Common.cancel')}
          headerTitle={t('forgotPassword.title')}
          onPress={onPressBackButton}
        />
      </View>
      <View style={styles.stepIndicator}>
        <CustomStepIndicator
          labels={labels}
          stepCount={labels.length}
          currentPosition={currentPage}
        />
      </View>
      {renderViewPagerPage(page)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp('1%'),
    marginHorizontal: wp('4.85%'),
  },
  stepIndicator: {
    marginTop: hp('3%'),
    marginHorizontal: wp('5%'),
    marginBottom: hp('3.778%'),
  },
  page: {
    flex: 1,
  },
});

export default ForgotPassword;
