import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomButton } from '../Button';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface CustomPrevAndNextButtonProps {
  prevTitle: string;
  nextTitle: string;
  onPressPrevButton: () => void;
  onPressNextButton: () => void;
}

const CustomPrevAndNextButton: FC<CustomPrevAndNextButtonProps> = ({
  prevTitle,
  nextTitle,
  onPressPrevButton,
  onPressNextButton,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <View style={styles.buttonStyle}>
        <CustomButton onPress={onPressPrevButton} title={prevTitle} type="outline" />
      </View>
      <View style={styles.buttonStyle}>
        <CustomButton onPress={onPressNextButton} title={nextTitle} type="solid" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: wp('43%'),
  },
});

export default CustomPrevAndNextButton;
