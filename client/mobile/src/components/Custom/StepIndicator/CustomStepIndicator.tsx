import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { RFValue } from 'react-native-responsive-fontsize';

const indicatorStyles = {
  labelFontFamily: 'Poppins-Medium',
  stepIndicatorSize: RFValue(30),
  currentStepIndicatorSize: RFValue(30),
  separatorStrokeWidth: RFValue(1),
  currentStepStrokeWidth: 0,
  separatorFinishedColor: '#dcdcdc', //Ligne ef vita ty
  separatorUnFinishedColor: '#dcdcdc', //Ligne mbola ts vita ty
  stepIndicatorFinishedColor: '#3C7548',
  stepIndicatorUnFinishedColor: '#DBDBDB',
  stepIndicatorCurrentColor: '#3C7548', //bgcolor ny current
  stepIndicatorLabelFontSize: RFValue(15),
  currentStepIndicatorLabelFontSize: RFValue(15),
  stepIndicatorLabelCurrentColor: '#ffffff', //Soratra current
  stepIndicatorLabelFinishedColor: '#ffffff', // Soratra ef vita
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: RFValue(12),
  currentStepLabelColor: '#4aae4f',
};

interface CustomStepIndicatorProps {
  labels: string[];
  stepCount?: number;
  currentPosition: number;
}

const CustomStepIndicator: FC<CustomStepIndicatorProps> = (props) => {
  const { labels, stepCount, currentPosition } = props;
  const renderLabel = ({
    position,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? { ...styles.stepLabel, color: '#4aae4f' }
            : { ...styles.stepLabel, color: '#999999' }
        }
      >
        {label}
      </Text>
    );
  };

  return (
    <View>
      <StepIndicator
        customStyles={indicatorStyles}
        currentPosition={currentPosition}
        renderLabel={renderLabel}
        stepCount={stepCount}
        labels={labels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  stepLabel: {
    fontSize: RFValue(12),
    textAlign: 'center',
    color: '#999999',
    fontFamily: 'Poppins-Regular',
    width: RFValue(85),
  },
});

export default CustomStepIndicator;
