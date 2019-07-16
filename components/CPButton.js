import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import { blue, white } from '../helpers/colors'

const CPButton = ({ OnPress, title }) => (
    <View style={styles.containerButton}>
        <TouchableOpacity
            style={styles.button}
            onPress={OnPress}
        >
            <Text style={{ textAlign: "center", fontSize: 16, color: white }}>{title}</Text>
        </TouchableOpacity>
    </View>
);

export default CPButton;

const styles = StyleSheet.create({
    containerButton: {
        paddingVertical: 10,
        marginTop: 10,
    },
    button: {
        backgroundColor: blue,
        height: 45,
        borderRadius: 6,
        justifyContent: 'center',
        shadowOffset: { width: 5, height: 5, },
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOpacity: 1.0,
    },
})