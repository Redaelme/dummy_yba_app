import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CheckBoxICon from 'react-native-vector-icons/Ionicons';
import { GoogleAuthManager } from '../../../../emailService/gmail/googleAuthManager';
import GmailIcon from '../../../assets/images/gmailIcon.svg';
import OutlookIcon from '../../../assets/images/outlookIcon.svg';
import { COLOR, FONTS, LETTER_SPACING } from '../../../Lib/theme';
import { AuthContext, useAuthContext } from '../../../providers/AuthProvider/AuthProvider';
import { CustomButton } from '../../Custom/Button';
import { PopUpModal } from '../../Custom/Modal';
import { CustomTextInput } from '../../Custom/TextInput';
import { signInOutlook, signOutOutlook } from './CreateAccountLogic';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import i18n from 'i18next';
import moment from 'moment-timezone';
import Loader from '../../Loader/Loader';
import { useSignUpMutation } from '../../../generated/graphql';
import { NOTIFICATION_TOKEN } from '../../../commons/constant';
import { StatusBarContext } from '../../../providers/StatusBarValueProvider/StatusBarValueProvider';
import { useNotifications } from '../../../hooks/useNotifications';

interface ICreateAccountProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  props?: {
    id?: string;
    name: string;
    lastName: string;
    mail: string;
  };
}

type CalendarType = 'APPLE_CALENDAR' | 'GOOGLE';

const GOOGLE_OAUTH_URL = 'http://localhost:4002/auth/google';
const REDIRECT_URL = 'myapp://callback'; // same as the server's redirect

const CreateAccount: FC<ICreateAccountProps> = (props) => {
  const { t } = useTranslation();
  const { googleSignIn, googleSignOut, setGoogleToken, googleToken } = useAuthContext();
  useEffect(() => {
    getDefaultData();
    GoogleAuthManager.configureGoogleSignIn();
  }, []);

  const userLanguage = i18n.language; // Get the current language
  const deviceTimezone = moment.tz.guess();
  const extractParams = (url:string) => {
    try {
      // Option 1: Use manual string splitting:
      // 1) separate the query string from "?"
      let [_, query] = url.split('?');
      if (!query) return {};
      // 2) remove trailing slash if present
      query = query.replace(/\/$/, '');
      // 3) split key=value pairs
      const pairs = query.split('&');
      const params = {};
      pairs.forEach((pair) => {
        const [key, val] = pair.split('=');
        params[key] = decodeURIComponent(val || '');
      });
      return params;
    } catch (err) {
      console.warn('Error parsing URL params:', err);
      return {};
    }
  };

  const handleOpenInAppBrowserAuth = async () => {
    try {
      // Ensure the module is available
      const isAvailable = await InAppBrowser.isAvailable();
      if (isAvailable) {
        const result = await InAppBrowser.openAuth(GOOGLE_OAUTH_URL, REDIRECT_URL, {
          // iOS
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          modalPresentationStyle: 'fullScreen',
          animated: true,
          modalEnabled: true,
          enableBarCollapsing: false,

          // Android
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: false,
          forceCloseOnRedirection: false,
        });

        console.log('openAuth result ->', result);

        // If the user completes sign-in and is redirected back:

        if (result.type === 'success' && result.url) {
          // Parse the final redirect URL
          const params = extractParams(result.url);
          if (params?.accessToken) {
            console.log("params from signon", params)
            setMailServiceAdress(params?.email);
            setFirstName(params?.firstName);
            setLastName(params?.lastName);
            await AsyncStorage.setItem('userEmail', params?.email);

            const mailServiceAuth = {
              accessToken: params?.accessToken,
              refreshToken: params?.refreshToken,
              tokenExpiryDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            };
            setGoogleToken(JSON.stringify(mailServiceAuth));
          }
          // TODO: handle the tokens (e.g. save to Redux, navigate, etc.)
        }
      } else {
        // Fallback - open in the default browser
        // Linking.openURL(GOOGLE_OAUTH_URL);
        Alert.alert('Unable to authenticate with Google. Please try again.');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const optionsMailService = [
    {
      icon: <GmailIcon style={{ marginHorizontal: wp('1%') }} />,
      label: t('signup.infos.mailService.google'),
      value: 'GOOGLE',
    },
    {
      icon: <OutlookIcon style={{ marginHorizontal: wp('1%') }} />,
      label: t('signup.infos.mailService.outlook'),
      value: 'MICROSOFT',
    },
  ];

  const { setPage, setCurrentPage, props: userInfoFromLogin } = props;

  const [firstName, setFirstName] = useState(userInfoFromLogin ? userInfoFromLogin.name : '');
  const [isValideFirstName, setIsValideFirstName] = useState(true);
  const [lastName, setLastName] = useState(userInfoFromLogin ? userInfoFromLogin.lastName : '');
  const [isValideLastName, setIsValideLastName] = useState(true);
  const [pass, setPass] = useState('');
  const [isValidePass, setIsValidePass] = useState(true);
  const [errorMsgPass, setErrorMsgPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [IsPassMatched, setIsPassMatched] = useState(true);
  const [errorMsgPassConfirm, setErrorMsgPassConfirm] = useState('');
  const [mailServiceLabel, setMailServiceLabel] = useState('Services de messagerie');
  const [mailServiceIcon, setMailServiceIcon] = useState<JSX.Element>();
  const [mailServiceValue, setMailServiceValue] = useState('');
  const [mailServiceAdress, setMailServiceAdress] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [securePass, setSecurePass] = useState(true);
  const [securePassCofirm, setSecurePassConfirm] = useState(true);
  const [isCheckedCGU, setIsCheckedCGU] = useState(userInfoFromLogin ? true : false);
  const [isCheckedNotification, setIsCheckedNotification] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [isEmptyConfirmPassword, setIsEmptyConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(userInfoFromLogin ? true : false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsgModal, setErrorMsgModal] = useState(
    userInfoFromLogin
      ? t('singup.infos.followSteps.message')
      : '',
  );
  const [visible, setVisible] = useState(false);
  const [msgModal, setMsgModal] = useState('');
  const [value, setValue] = useState<CalendarType>('GOOGLE');
  const { setStatusBarValues } = useContext(StatusBarContext);
  const { login, fromSignUp, setFromSignUp } = useContext(AuthContext);
  const { getToken } = useNotifications(); // Destructure the getToken function


  const [loading, setLoading] = useState(false);
  const [googleMessage, setGoogleMessage] = useState(false);
  const getDefaultData = async () => {
    const userInfo = await AsyncStorage.getItem('userInfos');
    const userEmail = await AsyncStorage.getItem('userEmail');


    if (userInfo && userEmail) {
      setMailServiceAdress(userEmail);
      setFirstName(JSON.parse(userInfo)[0]);
      setLastName(JSON.parse(userInfo)[1]);
      setPass(JSON.parse(userInfo)[2]);
      setPassConfirm(JSON.parse(userInfo)[2]);
      const newData = optionsMailService.filter(
        (optionsMailService: { icon: JSX.Element; label: string; value: string }) => {
          const itemData = optionsMailService.value ? optionsMailService.value : '';
          const textData = JSON.parse(userInfo)[3];
          return itemData.indexOf(textData) > -1;
        },
      );
      setMailServiceLabel(newData[0].label);
      setMailServiceValue(newData[0].value);
      setMailServiceIcon(newData[0].icon);
      setIsCheckedCGU(true);
    }
  };


  const [mutationSignUp] = useSignUpMutation({
    onCompleted: async (authData) => {
      setIsLoading(false);
      if (authData.signUp?.token) {
        await AsyncStorage.setItem('tokenTmp', authData.signUp.token);
        if (authData.signUp.user.isSingupBO) {
          setStatusBarValues({
            bgColor: COLOR.GREEN,
            newBarStyle: 'light-content',
          });
          setFromSignUp(true);
          login(authData.signUp.token);
        } else {
          // Remove the setFromSignUp and setStatusBarValues when you were going to change the application to a paid application
          setStatusBarValues({
            bgColor: COLOR.GREEN,
            newBarStyle: 'light-content',
          });
          setFromSignUp(true);
          login(authData.signUp.token);
        }
        await AsyncStorage.removeItem('userInfos');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('expireTime');
        await AsyncStorage.removeItem('serverCode');
        await AsyncStorage.removeItem(NOTIFICATION_TOKEN);
      }
    },
    onError: (res: Error) => {
      console.log('res ==> ', res);
      if (res.message === 'User already exists') {
        setIsLoading(false);
        setMsgModal(t('singup.infos.emailAlreadyExist.message'));
        setVisible(true);
      }
    },
  });

  const handleNext = async (titlePage: string) => {
    let ValidePass = false;
    if (firstName === '') {
      setIsValideFirstName(false);
    }
    if (lastName === '') {
      setIsValideLastName(false);
    }

    if (pass === '') {
      setErrorMsgPass(t('signup.infos.msg.error.pass'));
      setIsEmptyPassword(true);
    } else {
      setErrorMsgPass(t('signup.infos.msg.error.instruction.pass'));
      setIsValidePass(false);
      if (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(pass)) {
        setIsValidePass(true);
        ValidePass = true;
        if (pass === passConfirm) {
          setIsPassMatched(true);
        } else {
          setIsEmptyConfirmPassword(true);
          setErrorMsgPassConfirm(t('signup.infos.msg.error.instruction.passconfirm'));
        }
      } else {
        setIsEmptyPassword(true);
        setIsValidePass(false);
        ValidePass = false;
        setErrorMsgPass(t('signup.infos.msg.error.instruction.pass'));
      }
    }
    if (passConfirm === '') {
      setErrorMsgPassConfirm(t('signup.infos.msg.error.passconfirm'));
      setIsEmptyConfirmPassword(true);
    } else {
      setErrorMsgPassConfirm(t('signup.infos.msg.error.instruction.passconfirm'));
      setIsPassMatched(false);
    }

    if (!isCheckedNotification) {
      setMsgModal(t('singup.infos.pushNotifAuthorization.message'));
      setVisible(true);
    }

    if (!isCheckedCGU) {
      setErrorMsgModal(t('singup.infos.termsAndConditions.message'));
      setIsVisible(true);
    }

    if (mailServiceValue.length === 0 || mailServiceAdress.length === 0) {
      setErrorMsgModal(t('singup.infos.selectMailService.message'));
      setIsVisible(true);
    }
    if (
        userInfoFromLogin &&
        mailServiceAdress.length &&
        mailServiceAdress !== userInfoFromLogin.mail
    ) {
      setErrorMsgModal(t('singup.infos.mailService.error.message'));
      setIsVisible(true);
    }

    if (
      firstName !== '' &&
      lastName !== '' &&
      pass !== '' &&
      passConfirm !== '' &&
      ValidePass &&
      pass === passConfirm &&
      isCheckedCGU &&
        isCheckedNotification &&
      mailServiceValue.length > 0 &&
      mailServiceAdress.length > 0
    ) {
      // await storeInfosUserInAsync(firstName, lastName, pass, mailServiceValue);
      const notificationToken = await getToken();

      setIsLoading(true);
      if (mailServiceValue === 'GOOGLE') {
        if (googleToken) {
          const dataGoogle = {
            email: mailServiceAdress,
            firstName: firstName,
            lastName: lastName,
            password: pass,
            mailService: mailServiceValue,
            calendarType: 'GOOGLE',
            notificationToken: notificationToken ? notificationToken : '',
            mailServiceAuth: JSON.parse(googleToken),
            id: props.props?.id,
            timezone: deviceTimezone,
            lang: userLanguage,
          };

          await mutationSignUp({
            variables: {
              userInput: dataGoogle,
            },
          });
        }
      } else if (mailServiceValue === 'MICROSOFT' && notificationToken) {
        const userOutlookToken = await AsyncStorage.getItem('userToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const expireTime = await AsyncStorage.getItem('expireTime');
        const dataOutlook = {
          email: mailServiceAdress,
          firstName: firstName,
          lastName: lastName,
          password: pass,
          mailService: mailServiceValue,
          calendarType: 'GOOGLE',
          notificationToken: notificationToken,
          mailServiceAuth: {
            accessToken: userOutlookToken,
            refreshToken: refreshToken,
            tokenExpiryDateTime: expireTime,
          },
          id: props.props?.id,
          timezone: deviceTimezone,
          lang: userLanguage,
        };
        await mutationSignUp({
          variables: {
            userInput: dataOutlook,
          },
        });
      }



    }
  };

  const changeModalVisibility = (bool: boolean) => {
    setIsModalVisible(bool);
  };

  const setDataChoiceMailService = async (option: {
    icon?: JSX.Element;
    label: string;
    value: string;
  }) => {
    setMailServiceLabel(option.label);
    setMailServiceValue(option.value);
    setMailServiceIcon(option.icon);
    await googleSignOut();

    if (option.value === 'MICROSOFT') {
      const google_userMail = await AsyncStorage.getItem('userMail');
      if (google_userMail) {
        await AsyncStorage.removeItem('userMail');
      }
      const userInfo = await signInOutlook(setLoading);
      setMailServiceAdress(userInfo.email);
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)

    } else if (option.value === 'GOOGLE') {
      setGoogleMessage(true);
      setErrorMsgModal(
        t('signup.infos.msg.error.google')
      );
      setIsVisible(true);
    }
  };
  const handleSingnUpGoogle = async () => {
    const outLook_userMail = await AsyncStorage.getItem('userEmail');
    if (outLook_userMail) {
      await AsyncStorage.removeItem('userEmail');
      await signOutOutlook();
    }
    handleOpenInAppBrowserAuth();
  };

  const handleChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setValidator?: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (setValidator) {
      setValidator(true);
    }
    setValue(value);
  };

  const onPressEye = (state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setState(!state);
  };

  const handlePressCgu = useCallback(async () => {
    const linkToOpen = 'https://yba.ai/terms-of-service-1/';

    const supportedLink = await Linking.canOpenURL(linkToOpen);

    supportedLink && (await Linking.openURL(linkToOpen));
  }, []);


  const handlePressOutlook = async () => {
    await  setDataChoiceMailService({
        icon: <OutlookIcon style={{ marginHorizontal: wp('1%') }} />,
        label: t('signup.infos.mailService.outlook'),
        value: 'MICROSOFT',
    }
    );
  }

    const handlePressGoogle = async () => {
        await setDataChoiceMailService({
        icon: <GmailIcon style={{ marginHorizontal: wp('1%') }} />,
        label: t('signup.infos.mailService.google'),
        value: 'GOOGLE',
        });
    }




  return (
    <View style={{ flex: 1 }}>
      {/*<Loader {...{ loading }} />*/}
      {isLoading ? <Loader loading={isLoading} /> : undefined}
      {isVisible && (
        <PopUpModal
          isVisible={isVisible}
          dropPress={() => setIsVisible(false)}
          animationOutTiming={1000}
          btnOk={{
            onPress: () => {
              setIsVisible(false);
              if (googleMessage) {
                handleSingnUpGoogle();
                setGoogleMessage(false);
              }
            },
            title: googleMessage ? t('layout.continue') : t('layout.close'),
            type: 'solid',
          }}
          msgModal={errorMsgModal}
          height={30}
        />
      )}

      {visible && (
          <PopUpModal
              isVisible={visible}
              dropPress={() => setVisible(false)}
              animationOutTiming={1000}
              btnOk={{
                onPress: () => setVisible(false),
                title: t('layout.close'),
                type: 'solid',
              }}
              msgModal={msgModal}
              height={30}
          />
      )}

      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.containerInstruction}>
            <Text style={styles.textInstruction}>{t('signup.infos.instruction.service.mail')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: hp('2%') }}>
            <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: wp('45%'),
                  paddingVertical: hp('4%'),
                  backgroundColor: COLOR.BG_INPUT,
                  borderRadius: RFValue(4),
                }}
                onPress={async () => {
                    await handlePressGoogle();
                }}
            >
              <GmailIcon style={{ marginRight: wp('2%') }} />
              <Text style={styles.buttonText}>{t('signup.infos.mailService.google')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: wp('45%'),
                  paddingVertical: hp('1%'),
                  backgroundColor: COLOR.BG_INPUT,
                  borderRadius: RFValue(4),
                }}
                onPress={async () => {
                    await handlePressOutlook();

                }}
            >
              <OutlookIcon style={{ marginRight: wp('2%') }} />
              <Text style={styles.buttonText}>{t('signup.infos.mailService.outlook')}</Text>
            </TouchableOpacity>
          </View>

          { mailServiceAdress.length > 0 && (<View style={styles.containerInputText}>
            <CustomTextInput
                isEyeIcon={false}
                placeholder=""
                value={mailServiceAdress}
                containerStyle={{marginTop: 0}}
                editable={false}
            />
          </View>)}
          <View style={styles.containerInputText}>
            <CustomTextInput
              isEyeIcon={false}
              placeholder={t('signup.infos.placeholder.nom')}
              value={lastName}
              onChangeText={(text) => handleChange(text, setLastName, setIsValideLastName)}
              containerStyle={
                !isValideLastName
                  ? { borderColor: COLOR.RED, borderWidth: 1, marginTop: 0 }
                  : { marginTop: 0 }
              }
              onChange={() => setIsValideLastName(false)}
            />
          </View>
          {!isValideLastName ? (
            <Text style={styles.inputRequiredMessageStyle}>{t('signup.infos.msg.error.nom')}</Text>
          ) : undefined}
          <View style={styles.containerInputText}>
            <CustomTextInput
              isEyeIcon={false}
              placeholder={t('signup.infos.placeholder.prenom')}
              value={firstName}
              onChangeText={(text) => handleChange(text, setFirstName, setIsValideFirstName)}
              containerStyle={
                !isValideFirstName
                  ? { borderColor: COLOR.RED, borderWidth: 1, marginTop: 0 }
                  : { marginTop: 0 }
              }
              onChange={() => setIsValideFirstName(false)}
            />
          </View>
          {!isValideFirstName ? (
            <Text style={styles.inputRequiredMessageStyle}>
              {t('signup.infos.msg.error.prenom')}
            </Text>
          ) : undefined}
          <View style={styles.containerInputText}>
            <CustomTextInput
              isEyeIcon={true}
              secureTextEntry={securePass}
              onPress={() => onPressEye(securePass, setSecurePass)}
              placeholder={t('signup.infos.placeholder.pass')}
              value={pass}
              onChangeText={(text) => handleChange(text, setPass)}
              containerStyle={
                isEmptyPassword
                  ? { borderColor: COLOR.RED, borderWidth: 1, marginTop: 0 }
                  : { marginTop: 0 }
              }
              onChange={() => setIsEmptyPassword(false)}
            />
          </View>
          {isEmptyPassword ? (
            <Text style={styles.inputRequiredMessageStyle}>{errorMsgPass}</Text>
          ) : undefined}
          <View style={styles.containerInputText}>
            <CustomTextInput
              isEyeIcon={true}
              secureTextEntry={securePassCofirm}
              onPress={() => onPressEye(securePassCofirm, setSecurePassConfirm)}
              placeholder={t('signup.infos.placeholder.passconfirm')}
              value={passConfirm}
              onChangeText={(text) => handleChange(text, setPassConfirm)}
              containerStyle={
                isEmptyConfirmPassword
                  ? { borderColor: COLOR.RED, borderWidth: 1, marginTop: 0 }
                  : { marginTop: 0 }
              }
              onChange={() => setIsEmptyConfirmPassword(false)}
            />
          </View>
          {isEmptyConfirmPassword ? (
            <Text style={styles.inputRequiredMessageStyle}>{errorMsgPassConfirm}</Text>
          ) : undefined}

          <View
              style={{
                flexDirection: 'row',
                marginRight: wp('17%'),
                marginVertical: hp('2.36%'),
              }}
          >
            {isCheckedCGU ? (
                <CheckBoxICon
                    onPress={() => setIsCheckedCGU(false)}
                    name="checkbox-outline"
                    size={RFValue(18)}
                    color={COLOR.GREY}
                />
            ) : (
                <CheckBoxICon
                    onPress={() => setIsCheckedCGU(true)}
                    name="square-outline"
                    size={RFValue(18)}
                    color={COLOR.GREY}
                />
            )}
            <View style={{ marginLeft: wp('2%') }}>
              <Text>
                <Text
                    style={{
                      fontSize: RFValue(14),
                      fontFamily: FONTS.REGULAR,
                      letterSpacing: RFValue(-0.22),
                      color: COLOR.SOFT_BLACK,
                      lineHeight: RFValue(20),
                      opacity: 1,
                    }}
                >
                  {t('signup.infos.condition.label') + ' '}
                </Text>
                <Text
                    style={{
                      fontSize: RFValue(14),
                      fontFamily: FONTS.BOLD,
                      letterSpacing: RFValue(-0.22),
                      color: COLOR.SOFT_BLACK,
                      lineHeight: RFValue(20),
                      opacity: 1,
                    }}
                    onPress={handlePressCgu}
                >
                  {t('signup.infos.conditionToClick.label')}
                </Text>
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {isCheckedNotification ? (
                <CheckBoxICon
                    onPress={() => setIsCheckedNotification(false)}
                    name="checkbox-outline"
                    size={RFValue(18)}
                    color={COLOR.GREY}
                />
            ) : (
                <CheckBoxICon
                    onPress={() => setIsCheckedNotification(true)}
                    name="square-outline"
                    size={RFValue(18)}
                    color={COLOR.GREY}
                />
            )}
            <View style={{ marginBottom: hp('3.77%'), marginLeft: wp('2%'), maxWidth: wp('85%') }}>
              <Text
                  style={{
                    fontSize: RFValue(13),
                    fontFamily: FONTS.REGULAR,
                    letterSpacing: RFValue(-0.2),
                    lineHeight: RFValue(20),
                    color: COLOR.SOFT_BLACK,
                  }}
              >
                {t('signup.infos.agenda.check.label')}
              </Text>
            </View>
          </View>

        </ScrollView>
      </View>
      <View>
        <CustomButton
          onPress={() => handleNext(t('signup.label.step2'))}
          title={t('auth.button.registration')}
          type="solid"
        />
      </View>
    </View>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  buttonText: {
    fontSize: RFValue(14),
    fontFamily: FONTS.REGULAR,
    color: COLOR.GREY,
  },
  containerInputText: {
    paddingVertical: hp('1%'),
  },
  containerInstruction: {
    justifyContent: 'center',
    marginTop: hp('5%'),
    marginHorizontal: wp('1%'),
  },
  featherStyle: {
    fontSize: RFValue(16),
    color: COLOR.GREY,
  },
  textInstruction: {
    color: COLOR.SOFT_BLACK,
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(12),
    letterSpacing: LETTER_SPACING.LETTER_SPACING,
    textAlign: 'center',
  },
  textStyle: {
    marginBottom: hp('0.5%'),
    fontFamily: 'Poppins-Regular',
    color: 'gray',
    fontSize: RFValue(10),
  },
  textInput: {
    marginHorizontal: wp('2.43%'),
    textAlign: 'center',
    fontSize: RFValue(14),
    fontFamily: FONTS.REGULAR,
    color: COLOR.GREY,
    marginBottom: RFValue(4),
    lineHeight: RFValue(20),
  },
  iconInstruction: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('4.01%'),
  },
  touchableOpacity: {
    flex: 1,
    paddingHorizontal: wp('1.21%'),
    paddingVertical: hp('1%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: RFValue(4),
    textAlignVertical: 'center',
    paddingRight: wp('3.8%'),
    backgroundColor: COLOR.BG_INPUT,
    marginTop: hp('4%'),
    minHeight: hp('6%'),
  },
  inputRequiredMessageStyle: {
    // marginTop: hp('0.5%'),
    alignSelf: 'flex-start',
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(8),
    color: COLOR.RED,
  },
});
