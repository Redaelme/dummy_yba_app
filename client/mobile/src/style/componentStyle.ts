import { StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { COLOR } from '../Lib/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const componentStyles = StyleSheet.create({
  itemStyle: {
    padding: RFValue(10),
  },
  textInput: {
    height: hp('6%'),
    borderWidth: 1,
    margin: 10,
    borderColor: '#009688',
    flex: 1,
    paddingTop: hp('1.2%'),
    paddingRight: wp('2.42%'),
    paddingBottom: hp('1.2%'),
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  contactFlatList: {
    // minHeight: hp('16%'),
    borderWidth: 0.5,
    borderColor: COLOR.GREEN,
    marginBottom: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('3%'),
    borderRadius: 4,
  },

  //***** */
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: hp('7%'),
    borderRadius: RFValue(4),
    backgroundColor: '#DBDBDB45',
    alignContent: 'center',
    justifyContent: 'flex-start',
    marginBottom: hp('2%'),
  },
  inputStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: RFValue(14),
    letterSpacing: RFValue(-0.19),
    paddingHorizontal: wp('2%'),
    color: COLOR.GREY,
    fontFamily: 'Poppins-Regular',
    lineHeight: RFValue(20),
  },
  buttonCreateMeeting: {
    zIndex: 1,
    lineHeight: RFValue(50),
    height: RFValue(48),
    backgroundColor: COLOR.GREEN,
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: RFValue(352),
    borderRadius: RFValue(5),
  },
});

export const postionStyles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
});
export const alignStyle = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
});
