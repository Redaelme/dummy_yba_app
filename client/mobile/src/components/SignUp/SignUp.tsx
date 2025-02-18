import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomHeader from '../Custom/Header/Header';
import { CreateAccount } from './CreateAccount';
import { useTranslation } from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { COLOR, FONTS } from '../../Lib/theme';
import { SignUpNavigationProps, UserProfileNavigationProps } from '../../routes/route';


const SignUp: FC<SignUpNavigationProps & UserProfileNavigationProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [titlePage, setTitlePage] = useState(t('signup.label.step1'));

  const { params } = route;
  const props = (params as { name: string; lastName: string; mail: string; id: string | undefined })
    ? (params as { name: string; lastName: string; mail: string; id: string | undefined })
    : undefined;

  const renderPage = (pageTitle: string) => {
    if (pageTitle === t('signup.label.step1')) {
      return (
        <View key={pageTitle} style={{ flex: 1 }}>
          <CreateAccount setPage={setTitlePage} setCurrentPage={setCurrentPage} props={props}/>
        </View>
      );
    }
  };


  return (
    <View style={styles.container}>
      <CustomHeader
        backContext={t('layout.back')}
        headerTitle={t('signup.title.signup')}
        onPress={() => navigation.navigate('Authentication')}
      />
      {renderPage(titlePage)}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    backgroundColor: COLOR.WHITE,
  },
  containerSteper: {
    paddingVertical: hp('3.78%'),
  },
  page: {
    flex: 1,
  },
  step1Label: {
    fontSize: RFValue(12),
    textAlign: 'center',
    color: COLOR.SOFT_BLACK,
    fontFamily: FONTS.MEDIUM,
    minHeight: hp('5%'),
    width: wp('30%'),
  },
  step1LabelSelected: {
    fontSize: RFValue(12),
    lineHeight: RFValue(16),
    textAlign: 'center',
    color: COLOR.SOFT_BLACK,
    fontFamily: FONTS.MEDIUM,
    minHeight: hp('5%'),
    width: wp('18.5%'),
    letterSpacing: RFValue(-0.19),
  },
  step2Label: {
    fontSize: RFValue(12),
    lineHeight: RFValue(16),
    textAlign: 'center',
    color: COLOR.SOFT_BLACK,
    fontFamily: FONTS.MEDIUM,
    minHeight: hp('5%'),
    width: wp('18.5%'),
    letterSpacing: RFValue(-0.19),
  },
  step2LabelSelected: {
    fontSize: RFValue(12),
    textAlign: 'center',
    color: COLOR.SOFT_BLACK,
    fontFamily: FONTS.MEDIUM,
    minHeight: hp('5%'),
    width: wp('30%'),
  },
});
