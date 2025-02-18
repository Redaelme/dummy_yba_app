import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CustomButton } from '../../../Custom/Button';
import { TitleAndDescriptionComponent } from '../Utils/TitleAndDescriptionComponent';
import { StepScreenProps } from '../Utils/Utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CodeInputComponent } from '../Utils/CodeInputComponent';
import RefreshIcon from 'react-native-vector-icons/Ionicons';
import { COLOR, FONTS } from '../../../../Lib/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useCheckExpiredTokenMutation,
  useForgotPasswordMutation,
} from '../../../../generated/graphql';
import { PopUpModal } from '../../../Custom/Modal/PopUpModal';
import Loader from '../../../Loader/Loader';

const VerificationCodeField = (VerificationCodeFieldProps: StepScreenProps) => {
  const { setPage, setCurrentPage, setswipeScroll } = VerificationCodeFieldProps;
  const { t } = useTranslation();
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const [code5, setCode5] = useState('');
  const [code6, setCode6] = useState('');
  const ref = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const [mutationCheckExpiredToken, loading] = useCheckExpiredTokenMutation();
  const [isEmptyCode1, setIsEmptyCode1] = useState(false);
  const [isEmptyCode2, setIsEmptyCode2] = useState(false);
  const [isEmptyCode3, setIsEmptyCode3] = useState(false);
  const [isEmptyCode4, setIsEmptyCode4] = useState(false);
  const [isEmptyCode5, setIsEmptyCode5] = useState(false);
  const [isEmptyCode6, setIsEmptyCode6] = useState(false);
  const [mutationForgotPassword, loadingSentMail] = useForgotPasswordMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const assebleToken = (
    nb1: string,
    nb2: string,
    nb3: string,
    nb4: string,
    nb5: string,
    nb6: string,
  ) => {
    return nb1 + nb2 + nb3 + nb4 + nb5 + nb6;
  };

  const handleNext = async (position: number, instruction: string) => {
    if (instruction === 'prev') {
      setCurrentPage(position);
      setPage('Email');
    } else {
      if (
        code1 === '' &&
        code2 === '' &&
        code3 === '' &&
        code4 === '' &&
        code5 === '' &&
        code6 === ''
      ) {
        setIsEmptyCode1(true);
        setIsEmptyCode2(true);
        setIsEmptyCode3(true);
        setIsEmptyCode4(true);
        setIsEmptyCode5(true);
        setIsEmptyCode6(true);
      } else if (code1 === '') {
        setIsEmptyCode1(true);
      } else if (code2 === '') {
        setIsEmptyCode2(true);
      } else if (code3 === '') {
        setIsEmptyCode3(true);
      } else if (code4 === '') {
        setIsEmptyCode4(true);
      } else if (code5 === '') {
        setIsEmptyCode5(true);
      } else if (code6 === '') {
        setIsEmptyCode6(true);
      } else if (
        code1 !== '' &&
        code2 !== '' &&
        code3 !== '' &&
        code4 !== '' &&
        code5 !== '' &&
        code6 !== ''
      ) {
        const token = assebleToken(code1, code2, code3, code4, code5, code6);
        const email = await AsyncStorage.getItem('forgotPassEmail');
        if (email) {
          setIsLoading(true);
          mutationCheckExpiredToken({
            variables: {
              email: email.toLocaleLowerCase(),
              token: token,
            },
          }).then((successReturn) => {
            if (successReturn.data?.checkExpiredToken?.message === 'Valid code') {
              AsyncStorage.setItem('forgotPassToken', token);
              setIsLoading(false);
              setCurrentPage(position);
              setPage('Nouveau');
            } else if (successReturn.data?.checkExpiredToken?.message === 'Code expired') {
              setIsLoading(false);
              setIsVisible(true);
              setModalMessage(t('forgotPassword.verificationCode.token.expired'));
            } else if (successReturn.data?.checkExpiredToken?.message === 'User not found') {
              setIsLoading(false);
              setIsVisible(true);
              setModalMessage(t('forgotPassword.email.not.found'));
            } else {
              setIsLoading(false);
              setIsVisible(true);
              setModalMessage(t('forgotPassword.verificationCode.token.error'));
            }
          });
        }
      }
    }
  };

  const handleSentNewCode = async () => {
    const email = await AsyncStorage.getItem('forgotPassEmail');
    setIsLoading(true);
    if (email) {
      mutationForgotPassword({
        variables: {
          email: email.toLocaleLowerCase(),
        },
      }).then((returnSucces) => {
        if (returnSucces.data?.forgotPassword?.message === 'Mail sent successfully!') {
          setIsLoading(false);
          setIsVisible(true);
          setModalMessage(t('verificationCode.message.newCodeSending'));
          setCode1('');
          setCode2('');
          setCode3('');
          setCode4('');
          setCode5('');
          setCode6('');
        }
      });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Loader loading={isLoading} />
        <ScrollView>
          <TitleAndDescriptionComponent
            title={t('verificationCode.title')}
            description={t('verificationCode.description')}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <CodeInputComponent
              refProps={ref}
              placeholder=""
              value={code1}
              onChangeText={(newNumber) => {
                setCode1(newNumber);
                if (newNumber.length === 1) {
                  (ref1!.current! as any).focus();
                }
              }}
              onChange={() => setIsEmptyCode1(false)}
              containerStyle={isEmptyCode1 ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
            />
            <CodeInputComponent
              refProps={ref1}
              placeholder=""
              value={code2}
              onChangeText={(newNumber) => {
                setCode2(newNumber);
                if (newNumber.length === 1) {
                  (ref2!.current! as any).focus();
                }
                if (newNumber.length === 0) {
                  (ref!.current! as any).focus();
                }
              }}
              onChange={() => setIsEmptyCode2(false)}
              containerStyle={isEmptyCode2 ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
            />
            <CodeInputComponent
              refProps={ref2}
              placeholder=""
              value={code3}
              onChangeText={(newNumber) => {
                setCode3(newNumber);
                if (newNumber.length === 1) {
                  (ref3!.current! as any).focus();
                }
                if (newNumber.length === 0) {
                  (ref1!.current! as any).focus();
                }
              }}
              onChange={() => setIsEmptyCode3(false)}
              containerStyle={isEmptyCode3 ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
            />
            <CodeInputComponent
              refProps={ref3}
              placeholder=""
              value={code4}
              onChangeText={(newNumber) => {
                setCode4(newNumber);
                if (newNumber.length === 1) {
                  (ref4!.current! as any).focus();
                }
                if (newNumber.length === 0) {
                  (ref2!.current! as any).focus();
                }
              }}
              onChange={() => setIsEmptyCode4(false)}
              containerStyle={isEmptyCode4 ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
            />
            <CodeInputComponent
              refProps={ref4}
              placeholder=""
              value={code5}
              onChangeText={(newNumber) => {
                setCode5(newNumber);
                if (newNumber.length === 1) {
                  (ref5!.current! as any).focus();
                }
                if (newNumber.length === 0) {
                  (ref3!.current! as any).focus();
                }
              }}
              onChange={() => setIsEmptyCode5(false)}
              containerStyle={isEmptyCode5 ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
            />
            <CodeInputComponent
              refProps={ref5}
              placeholder=""
              value={code6}
              onChangeText={(newNumber) => {
                setCode6(newNumber);
                if (newNumber.length === 0) {
                  (ref4!.current! as any).focus();
                }
              }}
              onChange={() => setIsEmptyCode6(false)}
              containerStyle={isEmptyCode6 ? { borderColor: COLOR.RED, borderWidth: 1 } : undefined}
            />
          </View>
          <View style={styles.containerCodeIsNotReceived}>
            <Text style={[styles.textCodeIsNotReceived, { color: COLOR.GREY }]}>
              {t('verificationCode.label.tokenNotReceived')}
            </Text>
            <TouchableOpacity
              onPress={handleSentNewCode}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: hp('1%'),
              }}
            >
              <RefreshIcon
                name="refresh-outline"
                style={{
                  color: COLOR.GREEN,
                  fontSize: RFValue(24),
                  textAlign: 'center',
                  lineHeight: RFValue(20),
                }}
              />
              <Text style={[styles.textCodeIsNotReceived, { color: COLOR.GREEN }]}>
                {t('verificationCode.label.returnTheCode')}
              </Text>
            </TouchableOpacity>
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: wp('43') }}>
          <CustomButton onPress={() => handleNext(0, 'prev')} title={t('layout.back.upper')} type="outline" />
        </View>
        <View style={{ width: wp('43') }}>
          <CustomButton onPress={() => handleNext(2, 'next')} title={t('layout.next.upper')} type="solid" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerCodeIsNotReceived: {
    marginTop: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCodeIsNotReceived: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(12),
    lineHeight: RFValue(20),
    textAlign: 'center',
  },
});

export default VerificationCodeField;
