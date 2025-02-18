import React from 'react';
import {Text, View} from "react-native";

function Home() {
    return (
        <View>
            <Text
            style={{
                fontSize: 50,
                textAlign: 'center',
                margin: 10,
                color: 'black',
            }}
            >
                Home Page
            </Text>
        </View>
    );
}

export default Home;