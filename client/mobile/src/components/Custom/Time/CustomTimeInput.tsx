import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useState } from 'react';
import { COLOR, FONTS } from '../../../Lib/theme';
import { useEffect } from 'react';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BEGIN_WH } from '../../../commons/constant';
import { useTranslation } from 'react-i18next';

interface CustomTimeInputProps {
  onPressTimeInput: () => void;
  isModalTimeShow: boolean;
  dateValue: Date;
  setDateValue: React.Dispatch<React.SetStateAction<Date>>;
  setIsModalTimeShow?: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeTime: () => void;
  percentWidth?: string | undefined;
  start: Boolean | string;
  limit?: Date;
}

const CustomTimeInput: FC<CustomTimeInputProps> = ({
  onPressTimeInput,
  isModalTimeShow,
  dateValue,
  setDateValue,
  setIsModalTimeShow,
  onChangeTime,
  percentWidth,
  start,
  limit,
}) => {
  const [timeValue, setTimeValue] = useState<Date>(dateValue);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setTimeValue(dateValue);
  }, [dateValue]);

  const onHandleChangeTime = async (selectedDate: Date | undefined) => {
    const workingTimesData = await AsyncStorage.getItem('workingTimesData');

    onChangeTime();
    if (selectedDate) {
      const selectedHours = moment(moment(selectedDate).format('HH:mm'), 'h:mma');

      if (typeof start !== 'string' && workingTimesData !== null) {
        const data = JSON.parse(workingTimesData);
        const minDate: Date = data.startWorkingTime;
        const maxDate: Date = data.endWorkingTime;
        const minHours = moment(moment(minDate).format('HH:mm'), 'h:mma');
        const maxHours = moment(moment(maxDate).format('HH:mm'), 'h:mma');

        if (
          (!start && maxHours.isBefore(selectedHours)) ||
          (start && minHours.isAfter(selectedHours))
        ) {
          setTimeValue(selectedDate);
          setDateValue(selectedDate);
        } else {
          setTimeValue(start ? moment(minHours).toDate() : new Date(maxDate));
          setDateValue(start ? moment(minHours).toDate() : new Date(maxDate));
        }
      } else if (limit) {
        const limitHours = moment(moment(limit).format('HH:mm'), 'h:mma');
        setTimeValue(
          start === BEGIN_WH
            ? selectedHours.isBefore(limitHours)
              ? selectedDate
              : limit
            : selectedHours.isAfter(limitHours)
            ? selectedDate
            : limit,
        );
        setDateValue(
          start === BEGIN_WH
            ? selectedHours.isBefore(limitHours)
              ? selectedDate
              : limit
            : selectedHours.isAfter(limitHours)
            ? selectedDate
            : limit,
        );
      }
    }
  };

  const formatMinute = (date: Date) => {
    const minute = date.getMinutes();
    if (minute.toString().length === 1) {
      return '0' + minute;
    } else return minute;
  };

  const handleCancel = () => {
    setIsModalTimeShow && setIsModalTimeShow(false);
  };

  return (
    <View style={{ ...styles.container, minWidth: wp(percentWidth ? percentWidth : '20%') }}>
      <TouchableOpacity
        onPress={onPressTimeInput}
        style={{
          ...styles.datePickerStyle,
          flex: 1,
          marginRight: wp('1.21%'),
        }}
      >
        <Text style={{ ...styles.timeValue, minWidth: wp(percentWidth ? percentWidth : '20%') }}>
          {timeValue.getHours().toString() + ' : ' + formatMinute(timeValue)}
        </Text>
        <Feather
          name="chevron-down"
          style={{
            fontSize: RFValue(18),
            color: '#5C6360',
            marginRight: wp('3%'),
          }}
        />
      </TouchableOpacity>
      {isModalTimeShow && (
        <DateTimePickerModal
          testID="dateTimePicker"
          isVisible={isModalTimeShow}
          date={timeValue}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          //onChange={onHandleChangeTime}
          style={styles.datePickerStyle}
          onCancel={handleCancel}
          onConfirm={onHandleChangeTime}
          locale="fr_FR"
          pickerContainerStyleIOS={{
            justifyContent: 'center',
            alignContent: 'center',
          }}
          confirmTextIOS={t('button.confirm.ios')}
          cancelTextIOS={t('button.cancel.ios')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  datePickerStyle: {
    flexDirection: 'row',
    borderRadius: RFValue(4),
    alignContent: 'center',
    backgroundColor: '#DBDBDB45',
    minHeight: hp('6%'),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeValue: {
    fontFamily: FONTS.REGULAR,
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
    marginLeft: wp('3%'),
    color: COLOR.GREY,
    letterSpacing: RFValue(-0.22),
  },
});

export default CustomTimeInput;
