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
import { COLOR, FONTS } from '../../../../Lib/theme';
import { useEffect } from 'react';
import moment from 'moment';
import { BEGIN_WH } from '../../../../commons/constant';
import { useTranslation } from 'react-i18next';

interface ArrayOfBreakTime {
  start: Date;
  end: Date;
}

interface CustomTimeInputProps {
  onPressTimeInput: () => void;
  isModalTimeShow: boolean;
  dateValue: Date;
  setIsModalTimeShow: React.Dispatch<React.SetStateAction<boolean>>;
  percentWidth?: string | undefined;
  listOfTime: ArrayOfBreakTime[];
  element: ArrayOfBreakTime;
  index: number;
  instruction: string;
  setListOfTime: React.Dispatch<React.SetStateAction<ArrayOfBreakTime[]>>;
  limit: Date;
  type: string;
}

const CustomTimeListInput: FC<CustomTimeInputProps> = ({
  onPressTimeInput,
  isModalTimeShow,
  dateValue,
  setIsModalTimeShow,
  percentWidth,
  listOfTime,
  element,
  index,
  instruction,
  setListOfTime,
  limit,
  type,
}) => {
  const [timeValue, setTimeValue] = useState<Date>(dateValue);
  const { t } = useTranslation();

  useEffect(() => {
    if (instruction === 'start') {
      setTimeValue(element.start);
    } else {
      setTimeValue(element.end);
    }
  }, [timeValue, listOfTime]);

  useEffect(() => {
    setTimeValue(dateValue);
  }, [dateValue]);

  const onHandleChangeTime = (selectedDate: Date | undefined) => {
    setIsModalTimeShow(!isModalTimeShow);
    if (selectedDate) {
      const limitHours = moment(moment(limit).format('HH:mm'), 'h:mma');
      const selectedHours = moment(moment(selectedDate).format('HH:mm'), 'h:mma');
      const extactDate =
        type === BEGIN_WH
          ? selectedHours.isBefore(limitHours)
            ? selectedDate
            : limit
          : selectedHours.isAfter(limitHours)
          ? selectedDate
          : limit;
      setTimeValue(extactDate);
      updateBreakingTimeList(element, index, listOfTime, instruction, extactDate);
    }
  };

  const formatMinute = (date: Date) => {
    const minute = date.getMinutes();
    if (minute.toString().length === 1) {
      return '0' + minute;
    } else return minute;
  };

  const updateBreakingTimeList = (
    element: ArrayOfBreakTime,
    indexToUpdate: number,
    list: ArrayOfBreakTime[],
    instruction: string,
    selectable: Date,
  ) => {
    const updateList: ArrayOfBreakTime[] = list.map((item, index) => {
      if (index === indexToUpdate) {
        if (instruction === 'start') {
          return {
            start: selectable,
            end: element.end,
          };
        } else {
          return {
            start: element.start,
            end: selectable,
          };
        }
      }
      return item;
    });
    setListOfTime(updateList);
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
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          // onChange={onHandleChangeTime}
          style={styles.datePickerStyle}
          onCancel={handleCancel}
          onConfirm={onHandleChangeTime}
          locale="fr_FR"
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

export default CustomTimeListInput;
