import React, {FC, useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
    useAddNotificationTokenMutation,
    useGenerateAccessTokenMutation,
    useGetUserProfileQuery,
    useLoginMutation,
    User,
    useUpdateAuthMutation,
} from '../../../generated/graphql';
import {CustomButton} from '../../Custom/Button';
import {CustomTextInput} from '../../Custom/TextInput';
import {isValidEmail} from '../../../commons/validator/validator';
import {AuthContext, useAuthContext} from '../../../providers/AuthProvider/AuthProvider';
import {LoginScreenNavigationProps, UserModeScreeComponentProps} from '../../../routes/route';
import CustomHeader from '../../Custom/Header/Header';
import {useTranslation} from 'react-i18next';
import {RFValue} from 'react-native-responsive-fontsize';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {PopUpModal} from '../../Custom/Modal';
import {COLOR} from '../../../Lib/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NO_REFRESH_TOKEN_IS_SET_ERROR, NOTIFICATION_TOKEN} from '../../../commons/constant';
import {InstructionModal} from './InstructionModal';
import {useNotifications} from "../../../hooks/useNotifications";

const Login: FC<LoginScreenNavigationProps & UserModeScreeComponentProps> = ({navigation}) => {
    const {t} = useTranslation();
    const { getToken } = useNotifications(); // Destructure the getToken function

    const [visibleModalWithBanedInstruction, setVisibleModalWithBanedInstruction] = useState(false);
    const [isSecureText, setIsSecureText] = useState(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isEmptyEmail, setIsEmptyEmail] = useState(false);
    const [isEmptyPassword, setIsEmptyPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const {login} = useContext(AuthContext);
    const [mutationLogin] = useLoginMutation();
    const {data} = useGetUserProfileQuery();
    const {googleSignIn} = useAuthContext();
    const [mutationGenerateAccessToken] = useGenerateAccessTokenMutation();
    const [updateUserAuth] = useUpdateAuthMutation();
    const [isVisibleToSignIn, setIsVisibleToSignIn] = useState<boolean>(false);

    const [addNotificationTokenMutation] = useAddNotificationTokenMutation(
        {
            onCompleted: () => {
                console.log('Notification token added with useAddNotificationTokenMutation');
            },
            onError: (error) => {
                console.log('Error adding notification token with useAddNotificationTokenMutation', error);
            }
        },
    );
    const onPressedEyeIcon = () => {
        setIsSecureText(!isSecureText);
    };

    const isValid = (): boolean => {
        return isValidEmail(email);
    };

    const handleSignInGoogle = async () => {
        const notificationToken = await getToken();
        console.log("notificationToken from handleSignInGoogle", notificationToken);
        const result = await googleSignIn();
        if (result && result.serverCode) {
            mutationGenerateAccessToken({variables: {code: result.serverCode}})
                .then((res) => {
                    if (res?.data?.generateAccessToken) {
                        const newAuth = {
                            token: res.data.generateAccessToken.token,
                            refreshToken: res.data.generateAccessToken.refresh_token,
                            tokenExpiryDateTime: new Date(res.data.generateAccessToken.expiry_date).toISOString(),
                            email: result.user.email,
                        };

                        updateUserAuth({variables: {oauthUpdateInput: {...newAuth}}}).then((res) => {
                            mutationLogin({
                                variables: {
                                    email: email.toLocaleLowerCase(),
                                    password: password,
                                    deviceToken: notificationToken,
                                },
                            }).then((authData) => {
                                const {
                                    data: {
                                        login: {user, token, completedSignUp},
                                    },
                                } = authData;

                                if (!user?.isActive) {
                                    setVisibleModalWithBanedInstruction(true);
                                    setIsLoading(false);
                                    return;
                                }

                                checkInFreeModeUnpaidMode(user, token);

                                if (!completedSignUp) {
                                    navigation.navigate('SignUp', {
                                        name: user?.firstName || '',
                                        lastName: user?.lastName || '',
                                        mail: user?.email || '',
                                        id: user?.id || undefined,
                                    });
                                } else if (completedSignUp && token) {
                                    if (!user.modeFree && user.beginModeFree === null) {
                                        logInFreeModeIfNecessary(user, token, notificationToken);
                                    } else {
                                        console.log("notificationToken from handleSignInGoogle not modeFree");
                                        // addNotificationTokenMutation({
                                        //     variables: {token: notificationToken!, userId: user.id},
                                        // });
                                        login(token);
                                    }
                                    setIsLoading(false);
                                }
                            });
                        });
                    }
                })
                .catch((e) => {
                    setIsLoading(false);
                });
        }
    };

    const handleLogin = async () => {
        const notificationToken = await getToken();
        console.log("notificationToken from handleLogin", notificationToken);

        const isEmptyField = {
            email: email === '',
            password: password === '',
        };
        if (isEmptyField.email || isEmptyField.password) {
            setIsEmptyEmail(isEmptyField.email);
            setIsEmptyPassword(isEmptyField.password);
        } else {
            setIsLoading(true);
            setIsEmptyEmail(false);
            setIsEmptyPassword(false);
            if (isValid()) {
                console.log('email', email);
                mutationLogin({
                    variables: {
                        email: email.toLocaleLowerCase(),
                        password: password,
                        deviceToken: notificationToken,
                    },
                })
                    .then((authData) => {
                        const {
                            data: {
                                login: {user, token, completedSignUp},
                            },
                        } = authData;
                        console.log({user});

                        if (!user?.isActive) {
                            setVisibleModalWithBanedInstruction(true);
                            setIsLoading(false);
                            return;
                        }

                        checkInFreeModeUnpaidMode(user, token);

                        if (!completedSignUp) {
                            navigation.navigate('SignUp', {
                                name: user?.firstName || '',
                                lastName: user?.lastName || '',
                                mail: user?.email || '',
                                id: user?.id || undefined,
                            });
                        } else if (completedSignUp && token) {
                            if (!user.modeFree && user.beginModeFree === null) {
                                console.log("notificationToken from handleLogin in modeFree", notificationToken);
                                logInFreeModeIfNecessary(user, token, notificationToken);
                            } else {
                                console.log("notificationToken from handleLogin not modeFree", notificationToken);
                                // addNotificationTokenMutation({
                                //     variables: {token: notificationToken!, userId: user.id},
                                // });
                                login(token);
                            }
                            setIsLoading(false);
                        }
                    })
                    .catch(async (error: Error) => {
                        handleError(error?.message);
                    });
            } else {
                setModalMessage(t('login.error.invalidEmail.message'));
                setIsVisible(true);
                setIsLoading(false);
            }
        }
    };

    const checkInFreeModeUnpaidMode = (user: User, token: string) => {
        if (user?.beginModeFree && !user?.modeFree && !user?.isPayed) {
            login(token);
            setIsLoading(false);
            return;
        }
    };

    const logInFreeModeIfNecessary = (
        user: User,
        userToken: string,
        notificationToken: string | null,
    ) => {
        if (userToken && !user?.modeFree && user?.beginModeFree === null) {
            // addNotificationTokenMutation({
            //     variables: {token: notificationToken!, userId: user?.id},
            // });
            login(userToken);
        }
    };

    const handleError = async (errorType: string) => {
        let errorMessage = '';
        switch (errorType) {
            case 'invalid-email':
                errorMessage = t('login.error.emailNotFound.message');
                break;
            case 'Network request failed':
                errorMessage = t('login.error.networkFailed.message');
                break;
            case 'invalid-password':
                errorMessage = t('login.error.invalidPassword.message');
                break;
            case 'bannedInstruction':
                setVisibleModalWithBanedInstruction(true);
                return;
            case NO_REFRESH_TOKEN_IS_SET_ERROR:
                setIsVisibleToSignIn(true);
                return;
            default:
                errorMessage = t('login.another.errors.message');
        }
        setModalMessage(errorMessage);
        setIsLoading(false);
        setIsVisible(true);
    };

    const onPressHeadeerBackButton = () => {
        navigation.navigate('Authentication');
    };

    const handleForgotPassword = () => {
        setPassword('');
        navigation.navigate('ForgotPassword');
    };

    return (
        <View style={styles.container}>
            <InstructionModal
                isVisible={visibleModalWithBanedInstruction}
                setIsVisible={setVisibleModalWithBanedInstruction}
                contentModal={t('login.error.bannedInstruction.message')}
                btnLabel={t('layout.close')}
            />
            {isVisibleToSignIn && (
                <PopUpModal
                    isVisible={isVisibleToSignIn}
                    animationOutTiming={1000}
                    btnOk={{
                        onPress: async () => {
                            setIsVisibleToSignIn(false);
                            await handleSignInGoogle();
                        },
                        title: t('layout.continue'),
                        type: 'solid',
                    }}
                    dropPress={() => {
                        setIsVisibleToSignIn(false);
                        setIsLoading(false);
                    }}
                    msgModal={t('login.error.signInGoogle.message')}
                />
            )}
            <View style={{flex: 1}}>
                <CustomHeader backContext={t('layout.back')} onPress={onPressHeadeerBackButton}/>
            </View>
            <View style={styles.containerLogin}>
                <View style={styles.viewTextStyle}>
                    <Text style={styles.connexionText}>{t('login.text.login')}</Text>
                </View>
                <View>
                    <CustomTextInput
                        placeholder={t('login.input.placeholder.email')}
                        isEyeIcon={false}
                        value={email}
                        onChangeText={(newEmail) => setEmail(newEmail.trim())}
                        containerStyle={isEmptyEmail ? {borderColor: COLOR.RED, borderWidth: 1} : undefined}
                        onChange={() => setIsEmptyEmail(false)}
                    />
                    {isEmptyEmail ? (
                        <Text style={styles.inputRequiredMessageStyle}>
                            {t('login.textInput.email.required')}
                        </Text>
                    ) : undefined}
                    <CustomTextInput
                        placeholder={t('login.input.placeholder.password')}
                        isEyeIcon
                        value={password}
                        onPress={onPressedEyeIcon}
                        secureTextEntry={isSecureText}
                        onChangeText={(newPassword) => setPassword(newPassword.trim())}
                        containerStyle={
                            isEmptyPassword ? {borderColor: COLOR.RED, borderWidth: 1} : undefined
                        }
                        onChange={() => setIsEmptyPassword(false)}
                    />
                    {isEmptyPassword ? (
                        <Text style={styles.inputRequiredMessageStyle}>
                            {t('login.textInput.password.required')}
                        </Text>
                    ) : undefined}
                </View>
                <View
                    style={{
                        marginTop: hp('2%'),
                        marginBottom: hp('5%'),
                    }}
                >
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordStyle}>{t('login.text.forgotPassword')}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <CustomButton
                        title={t('login.button.toLogIn')}
                        onPress={handleLogin}
                        type="solid"
                        loading={isLoading}
                        desabled={isLoading ? true : false}
                    />
                </View>
            </View>
            {isVisible ? (
                <PopUpModal
                    isVisible={isVisible}
                    dropPress={() => setIsVisible(false)}
                    animationOutTiming={1000}
                    msgModal={modalMessage}
                    btnOk={{onPress: () => setIsVisible(false), title: t('layout.close'), type: 'solid'}}
                />
            ) : undefined}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: COLOR.WHITE,
        paddingHorizontal: wp('4,85%'),
        paddingTop: hp('1.65%'),
    },
    containerLogin: {
        justifyContent: 'center',
        flex: 15,
    },
    viewTextStyle: {
        marginBottom: hp('0.5%'),
    },
    connexionText: {
        textAlign: 'center',
        letterSpacing: 0.5,
        color: COLOR.GREY,
        opacity: 1,
        fontSize: RFValue(32),
        fontFamily: 'Poppins-Bold',
    },
    forgotPasswordStyle: {
        textAlign: 'center',
        color: COLOR.GREY,
        opacity: 1,
        textDecorationLine: 'underline',
        fontSize: RFValue(12),
        fontFamily: 'Poppins-Medium',
    },
    inputRequiredMessageStyle: {
        marginTop: hp('0.5%'),
        alignSelf: 'flex-start',
        color: COLOR.RED,
    },
});

export default Login;
