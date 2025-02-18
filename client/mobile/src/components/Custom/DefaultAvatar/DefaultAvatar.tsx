import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
interface DefaultAvatarProps {
  initials: string;
  icon?: any;
}

const colors = ['#4599db', '#4599db'];

const generateRandomIndex = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const DefaultAvatar: FC<DefaultAvatarProps> = (props) => {
  const { initials, icon } = props;

  const Dot = (props: any) => {
    const { style } = props;
    return (
      <View
        {...{
          style: [
            style,
            {
              width: RFValue(12),
              height: RFValue(12),
              borderRadius: 50,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ],
        }}
      >
        {icon ? (
          icon
        ) : (
          <View
            {...{ style: { width: 8, height: 8, borderRadius: 50, backgroundColor: '#c8c8c8' } }}
          ></View>
        )}
      </View>
    );
  };

  return (
    <View
      {...{ style: [{ backgroundColor: colors[generateRandomIndex(0, 1)] }, styles.container] }}
    >
      <Text {...{ style: styles.initials }}>{initials.toUpperCase()}</Text>
      <Dot {...{ style: styles.dot }} />
    </View>
  );
};

export default DefaultAvatar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: RFValue(33),
    height: RFValue(33),
  },
  initials: {
    color: '#fff',
  },
  dot: {
    backgroundColor: '#c8c8c8',
    position: 'absolute',
    left: RFValue(21),
    top: RFValue(21),
    borderRadius: 50,
    margin: 1,
  },
});
