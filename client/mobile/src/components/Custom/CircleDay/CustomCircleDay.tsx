import React, { FC, useState } from 'react';
import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLOR } from '../../../Lib/theme';
import { WorkingDay } from '../../Customization/Utils/Utils';
import {useTranslation} from "react-i18next";

interface CustomCircleDaProps {
  circleDayValue: string;
  isDayInWorkingDays: boolean;
  listOfWorkingDays: WorkingDay[];
  element: WorkingDay;
  indexOfElement: number;
  setListOfWorkingDays: React.Dispatch<React.SetStateAction<WorkingDay[]>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomCircleDay: FC<CustomCircleDaProps> = ({
  circleDayValue,
  isDayInWorkingDays,
  listOfWorkingDays,
  element,
  indexOfElement,
  setListOfWorkingDays,
  setIsVisible,
}) => {
  const [isEnable, setIsEnable] = useState(isDayInWorkingDays);
  const { t } = useTranslation();
  useEffect(() => {
    setIsEnable(element.isInWorkingDay);
  }, [isEnable, listOfWorkingDays]);

  const updateWorkingDaysList = (
    indexOfElement: number,
    list: WorkingDay[],
    elementOfList: WorkingDay,
  ) => {
    const checkNumberOfWorkingDays = list.filter((elem) => elem.isInWorkingDay === true);

    if (checkNumberOfWorkingDays.length === 1 && elementOfList.isInWorkingDay === true) {
      setIsVisible(true);
    } else {
      const updatedList: WorkingDay[] = list.map((item, index, list) => {
        if (index === indexOfElement) {
          setIsEnable(!elementOfList.isInWorkingDay);
          return {
            dayValue: elementOfList.dayValue,
            isInWorkingDay: !elementOfList.isInWorkingDay,
          };
        }
        return item;
      });
      setListOfWorkingDays(updatedList);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        updateWorkingDaysList(indexOfElement, listOfWorkingDays, element);
      }}
    >
      <Avatar
        size={RFValue(30)}
        rounded
        title={t(circleDayValue).substring(0, 1).toUpperCase()}
        activeOpacity={5.5}
        titleStyle={isEnable ? { color: COLOR.GREEN } : { color: COLOR.WHITE }}
        containerStyle={
          isEnable
            ? {
                ...styles.container,
                borderColor: COLOR.GREEN,
                borderWidth: 1,
                backgroundColor: COLOR.WHITE,
              }
            : styles.container
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.SOFT_GREY,
    marginRight: RFValue(15),
  },
});

export default CustomCircleDay;
