import React from 'react';

import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { white, primary, lightdark } from '../helpers/colors';

const Loading = ({ title, background }) => (
    <View style={[styles.containerLoading, { backgroundColor: background }]}>
        <Text style={styles.textLoading}>{title}</Text>
        <ActivityIndicator
            size="large"
            color={primary}
        />
    </View>
);

export default Loading;

const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    textLoading: {
        color: white,
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 6
    }
})
