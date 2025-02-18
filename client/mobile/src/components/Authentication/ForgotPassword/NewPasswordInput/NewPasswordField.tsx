import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { CustomButton } from '../../../Custom/Button';
import { CustomTextInput } from '../../../Custom/TextInput';
import { TitleAndDescriptionComponent } from '../Utils/TitleAndDescriptionComponent';
import { StepScreenProps } from '../Utils/Utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useState } from 'react';
import { COLOR, FONTS } from '../../../../Lib/theme';
import { PopUpModal } from '../../../Custom/Modal/PopUpModal';
import { RFValue } from 'react-native-responsive-fontsize';
import { useResetPasswordMutation } from '../../../../generated/graphql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ForgotPasswordNavigationProps } from '../../../../routes/route';
import Loader from '../../../Loader/Loader';

const NewPasswordField: FC<StepScreenProps & ForgotPasswordNavigationProps> = ({
  setPage,
  setCurrentPage,
  setswipeScroll,
  navigation,
}) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isNewPasswordError, setIsEmptyNewPasswordError] = useState(false);
  const [isConfirmNewPasswordError, setIsConfirmNewPasswordError] = useState(false);
  const [validePassword, setValidePassword] = useState(true);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
  const [confirmNewPasswordErrorMessage, setConfirmNewPasswordErrorMessage] = useState('');
  const [isSecureNewPassword, setIsSecureNewPassword] = useState(true);
  const [isSecureConfirmNewPassword, setIsSecureConfirmNewPassword] = useState(true);
  const [mutationRestPassword, { loading }] = useResetPasswordMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async (position: number, instruction: string) => {
    if (instruction === 'prev') {
      setCurrentPage(position);
      setPage('Code');
    } else {
      if (newPassword === '' && confirmNewPassword === '') {
        setIsEmptyNewPasswordError(true);
        setIsSecureConfirmNewPassword(true);
        setNewPasswordErrorMessage(t('forgotPassword.infos.msg.error.pass'));
        setConfirmNewPasswordErrorMessage(t('forgotPassword.infos.msg.error.passconfirm'));
        setIsConfirmNewPasswordError(true);
      } else if (newPassword === '') {
        setIsEmptyNewPasswordError(true);
        setNewPasswordErrorMessage(t('forgotPassword.infos.msg.error.pass'));
      } else if (confirmNewPassword === '') {
        setIsConfirmNewPasswordError(true);
        setConfirmNewPasswordErrorMessage(t('forgotPassword.infos.msg.error.passconfirm'));
      } else if (newPassword !== '' && confirmNewPassword !== '') {
        if (
          /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(newPassword)
        ) {
          setValidePassword(true);
          if (newPassword === confirmNewPassword) {
            const email = await AsyncStorage.getItem('forgotPassEmail');
            const token = await AsyncStorage.getItem('forgotPassToken');
            if (email && token && newPassword) {
              const data = {
                token: token,
                email: email,
                newPassword: newPassword,
              };
              setIsLoading(true);
              mutationRestPassword({
                variables: {
                  resetPasswordInput: data,
                },
              }).then((successReturn) => {
                if (successReturn.data?.resetPassword?.message === 'Password reset') {
                  setIsLoading(false);
                  setIsVisible(true);
                  setModalMessage(t('forgotPassword.infos.msg.success'));
                }
                if (successReturn.data?.resetPassword?.message === 'Code expired') {
                  setIsLoading(false);
                  setIsVisible(true);
                  setModalMessage(t('forgotPassword.infos.msg.error.expired'));
                }
                if (successReturn.data?.resetPassword?.message === 'User not found') {
                  setIsLoading(false);
                  setIsVisible(true);
                  setModalMessage(t('forgotPassword.infos.msg.error.user'));
                }
              });
            }
          } else {
            setIsConfirmNewPasswordError(true);
            setConfirmNewPasswordErrorMessage(
              t('forgotPassword.infos.msg.error.instruction.passconfirm'),
            );
          }
        } else {
          setIsEmptyNewPasswordError(true);
          setValidePassword(false);
          setNewPasswordErrorMessage(t('forgotPassword.infos.msg.error.instruction.pass'));
        }
      }
    }
  };

  const onHideModal = async () => {
    await AsyncStorage.removeItem('forgotPassEmail');
    await AsyncStorage.removeItem('forgotPassToken');
    setIsVisible(false);
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <ScrollView>
          <TitleAndDescriptionComponent
            title={t('newPassword.title')}
            description={t('newPassword.description')}
          />
          <CustomTextInput
            placeholder={t('fields.holder.newPassword')}
            secureTextEntry={isSecureNewPassword}
            isEyeIcon
            value={newPassword}
            onChangeText={(newValue) => setNewPassword(newValue)}
            onChange={() => setIsEmptyNewPasswordError(false)}
            onPress={() => setIsSecureNewPassword(!isSecureNewPassword)}
            containerStyle={
              isNewPasswordError ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined
            }
          />
          {isNewPasswordError ? (
            <Text style={styles.inputRequiredMessageStyle}>{newPasswordErrorMessage}</Text>
          ) : undefined}
          <CustomTextInput
            placeholder={t('fields.holder.confirmPassword')}
            secureTextEntry={isSecureConfirmNewPassword}
            isEyeIcon
            value={confirmNewPassword}
            onChangeText={(newValue) => setConfirmNewPassword(newValue)}
            onChange={() => setIsConfirmNewPasswordError(false)}
            onPress={() => setIsSecureConfirmNewPassword(!isSecureConfirmNewPassword)}
            containerStyle={
              isConfirmNewPasswordError ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined
            }
          />
          {isConfirmNewPasswordError ? (
            <Text style={styles.inputRequiredMessageStyle}>{confirmNewPasswordErrorMessage}</Text>
          ) : undefined}
        </ScrollView>
        <PopUpModal
          isVisible={isVisible}
          dropPress={async () => onHideModal}
          animationOutTiming={1000}
          msgModal={modalMessage}
          btnOk={{ onPress: onHideModal, title: t('forgotPassword.connect'), type: 'solid' }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: wp('43') }}>
          <CustomButton onPress={() => handleNext(1, 'prev')} title={t('forgotPassword.back')} type="outline" />
        </View>
        <View style={{ width: wp('43') }}>
          <CustomButton onPress={() => handleNext(2, 'next')} title={t('forgotPassword.reset')} type="solid" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputRequiredMessageStyle: {
    alignSelf: 'flex-start',
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(8),
    color: COLOR.RED,
  },
});

export default NewPasswordField;
