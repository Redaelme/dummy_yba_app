import React, { FC } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import ArrowBack from '../../../assets/images/arrowBack.svg';
import ArrowBackBlack from '../../../assets/images/arrow_back_ios.svg';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLOR } from '../../../Lib/theme';
import Icon from "react-native-vector-icons/Ionicons";

interface CustomHeaderProps {
  backContext: String;
  headerTitle?: String;
  onPress: () => void;
  bgColor?: boolean;
  onRefresh?: () => void;
}

const CustomHeader: FC<CustomHeaderProps> = ({ backContext, headerTitle, onPress, bgColor, onRefresh }) => {
  let newBgColor = bgColor ? COLOR.GREEN : COLOR.WHITE;
  let newColorText = bgColor ? COLOR.WHITE : '#5C6360';
  return (
      <View style={styles.container}>
        <TouchableOpacity
            onPress={onPress}
            style={[styles.backButton, { backgroundColor: newBgColor }]}
        >
          {!bgColor ? (
              <ArrowBack style={styles.arrowBack} />
          ) : (
              <ArrowBackBlack style={styles.arrowBack} />
          )}
          <Text style={[styles.backContext, { color: newColorText }]}>{backContext}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View>
          {onRefresh && <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
          >
            <Icon name="refresh" style={styles.refreshButtonIcon}/>
          </TouchableOpacity>}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowBack: {
    marginRight: wp('1%'),
    fontSize: RFValue(10),
  },
  backContext: {
    fontSize: RFValue(12),
    letterSpacing: -0.29,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'center',
  },
  headerTitle: {
    color: '#3C7548',
    fontSize: RFValue(14),
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  refreshButton: {
    width: 35,
    height: 35,
    backgroundColor: '#3C7548', // Green background
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  refreshButtonIcon: {
    color: '#FFFFFF', // White color for the icon
    fontSize: 20,
  },
});

export default CustomHeader;