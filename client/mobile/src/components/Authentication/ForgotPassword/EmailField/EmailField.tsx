import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLOR, FONTS } from '../../../../Lib/theme';
import { CustomButton } from '../../../Custom/Button';
import { CustomTextInput } from '../../../Custom/TextInput';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StepScreenProps } from '../Utils/Utils';
import { TitleAndDescriptionComponent } from '../Utils/TitleAndDescriptionComponent';
import { useForgotPasswordMutation } from '../../../../generated/graphql';
import { isValidEmail } from '../../../../commons/validator/validator';
import { PopUpModal } from '../../../Custom/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../Loader/Loader';

const EmailField = ({ setCurrentPage, setswipeScroll, setPage }: StepScreenProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isEmptyEmail, setIsEmptyEmail] = useState(false);
  const [mutationForgotPassword, loading] = useForgotPasswordMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValid = (): boolean => {
    return isValidEmail(email);
  };

  const handleNextButton = (position: number) => {
    if (email === '') {
      setIsEmptyEmail(true);
    } else {
      setIsLoading(true);
      if (isValid()) {
        mutationForgotPassword({
          variables: {
            email: email.toLocaleLowerCase(),
          },
        })
          .then((successReturn) => {
            if (successReturn.data?.forgotPassword?.message === 'Mail sent successfully!') {
              AsyncStorage.setItem('forgotPassEmail', email.toLocaleLowerCase());
              setCurrentPage(position);
              setPage('Code');
              setIsLoading(false);
            } else if (successReturn.data?.forgotPassword?.message === 'User not found') {
              setModalMessage(t('forgotPassword.email.not.found'));
              setIsVisible(true);
              setIsLoading(false);
            } else if (successReturn.data?.forgotPassword?.message === 'An error is occurred') {
              setModalMessage(t('forgotPassword.email.error'));
              setIsVisible(true);
              setIsLoading(false);
            }
          })
          .catch((notSuccessReturn: Error) => {
            setModalMessage(notSuccessReturn.message);
            setIsVisible(true);
            setIsLoading(false);
          });
      } else {
        setModalMessage(t('forgotPassword.error.invalidEmail.message'));
        setIsVisible(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Loader loading={isLoading} />
      <View style={{ flex: 1 }}>
        <ScrollView>
          <TitleAndDescriptionComponent
            title={t('emailField.title')}
            description={t('emailField.description')}
          />
          <View>
            <CustomTextInput
              placeholder={t('fields.holder.email')}
              isEyeIcon={false}
              value={email}
              onChangeText={(newEmail) => setEmail(newEmail)}
              containerStyle={isEmptyEmail ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
              onChange={() => setIsEmptyEmail(false)}
            />
            {isEmptyEmail ? (
              <Text style={styles.inputRequiredMessageStyle}>
                {t('forgotPassword.textInput.email.required')}
              </Text>
            ) : undefined}
          </View>
        </ScrollView>
        {isVisible ? (
          <PopUpModal
            isVisible={isVisible}
            dropPress={() => setIsVisible(false)}
            animationOutTiming={1000}
            msgModal={modalMessage}
            btnOk={{ onPress: () => setIsVisible(false), title: t('layout.close'), type: 'solid' }}
          />
        ) : undefined}
      </View>
      <View style={{ paddingBottom: hp('1.5%') }}>
        <CustomButton title={t('layout.next.upper')} type="solid" onPress={() => handleNextButton(1)} />
      </View>
    </KeyboardAvoidingView>
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
  inputRequiredMessageStyle: {
    marginTop: hp('0.5%'),
    alignSelf: 'flex-start',
    color: COLOR.RED,
  },
});

export default EmailField;
