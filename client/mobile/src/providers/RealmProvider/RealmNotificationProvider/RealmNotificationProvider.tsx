import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { NOTIFICATION_SCHEMA } from '../../../models/Notification';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import { RealmNotification } from '../interfaces';
import { RealmMeContext } from '../RealmMeProvider/RealmMeProvider';
import { RealmContext } from '../RealmProvider';
import IAP, { Subscription, SubscriptionPurchase } from 'react-native-iap';
import { useGetUserProfileQuery, useSubmcheckMutation } from '../../../generated/graphql';
import { MeContext, purchaseState } from '../../me/meProvider';
import { RNToasty } from 'react-native-toasty';
import { COLOR, FONTS } from '../../../Lib/theme';
import { RFValue } from 'react-native-responsive-fontsize';

interface RealmNotificationProviderProps {
  createRealmNotification: (notification: RealmNotification) => void;
  listRealmNotifications: () => RealmNotification[];
  getRealmNotification: (id: string) => RealmNotification | null;
  setSubModalVisible: (visible: boolean) => void;
}

const RealmNotificationContext = createContext<RealmNotificationProviderProps>({
  createRealmNotification: () => {},
  listRealmNotifications: () => [],
  getRealmNotification: () => null,
  setSubModalVisible: () => {},
});

const RealmNotificationProvider: FC = ({ children }) => {
  const { realm } = useContext(RealmContext);
  const { me, setMe } = useContext(MeContext);
  const { setMailToClassify } = useContext(RealmMeContext);
  const { logout, fromSignUp, setFromSignUp, token } = useContext(AuthContext);
  const { t } = useTranslation();
  const [isVisible, setSubModalVisible] = useState((me && me.isPayed === false) || false);
  const [isVisibleDetailOfSub, setIsVisibleDetailOfSub] = useState<boolean>(false);
  const [products, setProducts] = useState<Subscription[]>([]);
  const [isSubPending, setIsSubPending] = useState<boolean>(false);
  const [isExistToken, setIsExistToken] = useState<boolean>(true);
  const { data: dataMe, loading } = useGetUserProfileQuery();

  const { isPurchased, setIsPurchased, setIsUserClickSub } = purchaseState();

  const [btnLoading, setBtnLoading] = useState(false);
  const SubErrorNotifier = () => {
    Platform.OS === 'ios'
      ? RNToasty.Error({
          title: "Une erreur s'est produite",
          fontFamily: FONTS.MEDIUM,
          position: 'top',
          duration: 1,
          titleSize: RFValue(12),
          tintColor: COLOR.RED,
        })
      : ToastAndroid.showWithGravity(
          "Une erreur s'est produite",
          ToastAndroid.BOTTOM,
          ToastAndroid.LONG,
        );
    setIsSubPending(false);
    setSubModalVisible(true);
  };
  const [mutationSubMounthly, { loading: subLoading }] = useSubmcheckMutation({
    onCompleted: (res) => {
      if (res && res.subscriptionValidation) {
        setIsSubPending(false);
        const { id, firstName, lastName, email } = res.subscriptionValidation;
        setMe({
          id: id || '',
          nom: firstName || '',
          prenom: lastName || '',
          mail: email || '',
          isPayed: true,
        });
        setIsUserClickSub();
        setIsPurchased();
        Platform.OS === 'ios'
          ? RNToasty.Success({
              title: 'Vous avez maintenant un accès entier',
              fontFamily: FONTS.MEDIUM,
              position: 'top',
              duration: 1,
              titleSize: RFValue(12),
              tintColor: COLOR.GREEN,
            })
          : ToastAndroid.showWithGravity(
              'Vous avez maintenant un accès entier',
              ToastAndroid.BOTTOM,
              ToastAndroid.LONG,
            );
      }

      setSubModalVisible(false);
    },
    onError: () => {
      SubErrorNotifier();
    },
  });

  const initIAP = () => {
    setSubModalVisible(false);

    const items = Platform.select({
      ios: [],
      android: ['ybiap_1499_1m'],
    });

    IAP.initConnection()
      .catch((err) => console.log('error in sub connexion==>', err))
      .then((rr) => {
        console.log(items);
        setIsSubPending(true);
        IAP.getSubscriptions(items || [])
          .catch((err) => {
            // SubErrorNotifier(), console.log('error finding items:', err);
            Alert.alert(
              'Error',
              "Il y a eu une erreur avec votre achat, code d'erreur:  " + err['code'],
              [
                {
                  text: 'OK',
                  onPress: () => {
                    isExistToken ? SubErrorNotifier() : null;
                  },
                },
              ],
            );
          })
          .then((res) => {
            console.log('RNIAP res:', res);
            setIsSubPending(false);
            res &&
              res.map((p) => {
                setSubModalVisible(false);
                IAP.requestSubscription(p['productId']).catch((err) => {
                  setIsSubPending(false);
                  console.log('requestSubError:', err);
                  setSubModalVisible(true);
                });
              });
          });

        IAP.getPurchaseHistory()
          .catch((err) => {
            console.log('ERROR:', err);
          })
          .then((res) => {
            const result: SubscriptionPurchase[] = res as SubscriptionPurchase[];
            try {
              const receipt = result[result.length - 1].transactionReceipt;

              if (receipt) {
                validate();
              }
            } catch (error) {
              setSubModalVisible(true);
            }
          });
      });
  };

  const validate = () => {
    mutationSubMounthly({
      variables: {
        free: false,
      },
    });
  };

  const initIapIos = () => {
    setSubModalVisible(false);
    setIsUserClickSub();
    setIsPurchased();
    const items = Platform.select({
      ios: ['yesbossiap_1499_1m'],
      android: ['ybiap_1499_1m'],
    });

    IAP.initConnection()
      .catch(() => {
        console.log('Error connecting to store');
      })
      .then(() => {
        console.log('connected to store...');
        setIsSubPending(true);
        IAP.getSubscriptions(items || [])
          .catch((err) => {
            Alert.alert(
              'Error',
              "Il y a eu une erreur avec votre achat, code d'erreur:  " + err['code'],
              [{ text: 'OK', onPress: () => SubErrorNotifier() }],
            );
          })
          .then((res) => {
            if (res) {
              setProducts(res as Subscription[]);
              setIsSubPending(false);
              setIsVisibleDetailOfSub(true);
            }
          });
      });
  };

  const subscribeOnProductIOS = () => {
    setIsVisibleDetailOfSub(false);
    setIsSubPending(true);
    IAP.requestSubscription(products[0]['productId'])
      .catch((err) => {
        console.log('Error when request subscription', err);
        setIsSubPending(false);
        setSubModalVisible(true);
      })
      .then((requestRes) => {
        IAP.purchaseUpdatedListener((purchase) => {
          try {
            const receipt = purchase.transactionReceipt;
            if (requestRes && receipt === requestRes.transactionReceipt) {
              Platform.OS === 'ios' ? validateIos(receipt) : validate();
            }
          } catch (error) {}
        });
      });
  };

  const cancelSubscriptionOnProduct = () => {
    setIsVisibleDetailOfSub(false);
    setSubModalVisible(true);
  };

  const validateIos = async (receipt: string) => {
    const receiptBody = {
      'receipt-data': receipt,
      password: '9b1b795d6012462cb9e58cdfbe56ae9f',
    };

    const result = await IAP.validateReceiptIos(receiptBody, true)
      .catch(() => {})
      .then((receipt) => {
        try {
          console.log({ receipt });
          const renewlHistory = receipt && receipt.latest_receipt_info;
          renewlHistory && validate();
        } catch (error) {}
      });
  };

  React.useEffect(() => {
    // Check whether an initial notification is available
    // messaging()
    //   .getToken()
    //   .then(async (token) => {
    //     await AsyncStorage.setItem(NOTIFICATION_TOKEN, token);
    //     console.log('Token notification:', token);
    //
    //   });
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   const { data } = remoteMessage;
    //   setRefetch(true);
    //   // pushLocalNotification(remoteMessage);
    //
    //   if (data) {
    //     if (!data.handled) {
    //       data.handled = true; // Mark the notification as handled
    //       pushLocalNotification(remoteMessage);
    //     }
    //   const { type, mail } = data;
    //     if (type === NotificationTypes.SUB && dataMe && dataMe.me) {
    //         getMe();
    //         setSubModalVisible(true);
    //     }
    //   }
    // });

    // const purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
    //   if (!(error.responseCode && error.responseCode === 2)) {
    //     setBtnLoading(false);
    //     Alert.alert('Erreur', "Vous avez annulé l'achat", [
    //       { text: 'OK', onPress: () => SubErrorNotifier() },
    //     ]);
    //   } else {
    //     setBtnLoading(false);
    //     Alert.alert('Erreur', 'Une erreur est survenue lors de votre abonnement', [
    //       { text: 'OK', onPress: () => SubErrorNotifier() },
    //     ]);
    //   }
    // });

    // const purchasedUpdatedListner = IAP.purchaseUpdatedListener((purchase) => {
    //   try {
    //     const receipt = purchase.transactionReceipt;
    //     if (receipt) {
    //       console.log('=======================================');
    //       validateIos(receipt);
    //     }
    //   } catch (error) {}
    // });

    token ? setIsExistToken(true) : setIsExistToken(false);

    return () => {
      // unsubscribe();
      // try {
      //   purchaseUpdateSubscription.remove();
      // } catch (error) {}
      // try {
      //   purchaseErrorSubscription.remove();
      // } catch (error) {}
      // try {
      //   IAP.endConnection();
      // } catch (error) {}
    };
  }, [isExistToken, dataMe]);

  const createRealmNotification = (notification: RealmNotification) => {
    if (realm) {
      realm.write(() => {
        realm.create<RealmNotification>(NOTIFICATION_SCHEMA, notification, Realm.UpdateMode.All);
      });
    }
  };

  const onHideModal = async () => {
    setSubModalVisible(false);
    logout();
  };

  const listRealmNotifications = (): RealmNotification[] => {
    if (realm) {
      const res = realm.objects<RealmNotification>(NOTIFICATION_SCHEMA).map((result) => result);
      return res;
    }
    return [];
  };

  const getRealmNotification = (id: string): RealmNotification | null => {
    if (realm) {
      const res = realm
        .objects<RealmNotification>(NOTIFICATION_SCHEMA)
        .filtered(`id=${id}`)
        .map((result) => result);
      return res.length ? res[0] : null;
    }
    return null;
  };

  return useMemo(() => {
    return (
      <RealmNotificationContext.Provider
        {...{
          value: {
            createRealmNotification,
            getRealmNotification,
            listRealmNotifications,
            setSubModalVisible,
          },
        }}
      >
        {/*{isSubPending ? (*/}
        {/*  <Loader loading={isSubPending} />*/}
        {/*) : (*/}
        {/*  <>*/}
        {/*    {isVisible && (*/}
        {/*      <PopUpModal*/}
        {/*        isVisible={isVisible}*/}
        {/*        dropPress={onHideModal}*/}
        {/*        animationOutTiming={1000}*/}
        {/*        msgModal={t('sub.expiration.message')}*/}
        {/*        btnOk={{*/}
        {/*          onPress: initIapIos,*/}
        {/*          title: "S'ABONNER",*/}
        {/*          type: 'solid',*/}
        {/*        }}*/}
        {/*        height={hp('4.5%')}*/}
        {/*        loading={btnLoading}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*    {isVisibleDetailOfSub && (*/}
        {/*      <BottomModal*/}
        {/*        isVisible={isVisibleDetailOfSub}*/}
        {/*        dropPress={cancelSubscriptionOnProduct}*/}
        {/*        animationOutTiming={1000}*/}
        {/*        msgModal={*/}
        {/*          `${*/}
        {/*            products[0].title.length > 0 ? products[0].title : 'Accès Premium à YesBoss'*/}
        {/*          }` +*/}
        {/*          '\n' +*/}
        {/*          `${*/}
        {/*            products[0].description.length > 0*/}
        {/*              ? products[0].description*/}
        {/*              : 'Accès illimité pendant un mois'*/}
        {/*          }` +*/}
        {/*          "\n Le prix de l'abonnement est de: \n" +*/}
        {/*          products[0].localizedPrice +*/}
        {/*          '/Mois (sans engagement)'*/}
        {/*        }*/}
        {/*        confirmButton*/}
        {/*        btnTitleConfirm="ACHETER"*/}
        {/*        btnTitleCancel="ANNULER"*/}
        {/*        btnCancelType="outline"*/}
        {/*        confirmAction={subscribeOnProductIOS}*/}
        {/*        height={hp('4%')}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*    <Loader loading={subLoading} />*/}
        {/*    {children}*/}
        {/*  </>*/}
        {/*)}*/}
      </RealmNotificationContext.Provider>
    );
  }, [isVisible, isVisibleDetailOfSub, isSubPending]);
};
export const useRealmNotificationContext = () => useContext(RealmNotificationContext);

export default RealmNotificationProvider;
