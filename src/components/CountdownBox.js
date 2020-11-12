import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ScaleSize } from '@momo-platform/component-kits';
import { parseTime } from '../utils/DateUtils';
import Strings from '../utils/Strings';

const CountdownBox = ({ time, onEndCountdown }) => {
    const [timeStamp, setTimeStamp] = useState(time || 0);

    useEffect(() => {
        return () => countdown && clearTimeout(countdown);
    }, []);

    useEffect(() => {
        countdown && clearTimeout(countdown);
        countdown = setTimeout(() => {
            if (timeStamp >= 1000) {
                setTimeStamp(timeStamp - 1000);
            } else {
                onEndCountdown?.();
            }
        }, 1000);

        return () => countdown && clearTimeout(countdown);
    }, [timeStamp, time]);

    if (timeStamp < 0) {
        return null;
    }

    let timeLeft = parseTime(timeStamp);
    let countdown;

    return (
        <View style={styles.rowCountdownContainer}>
            <View style={styles.rowCountdownItem}>
                <View style={styles.textCountdownContainer}>
                    <Text.H3 style={styles.textValueCountdown}>{timeLeft.day}</Text.H3>
                </View>
                <Text style={styles.textLabelCountdown}>
                    {timeLeft.day <= 1 ? Strings.day : Strings.days}
                </Text>
            </View>
            <View style={styles.rowCountdownItem}>
                <View style={styles.textCountdownContainer}>
                    <Text.H3 style={styles.textValueCountdown}>{timeLeft.hour}</Text.H3>
                </View>
                <Text style={styles.textLabelCountdown}>
                    {timeLeft.hour <= 1 ? Strings.hour : Strings.hours}
                </Text>
            </View>
            <View style={styles.rowCountdownItem}>
                <View style={styles.textCountdownContainer}>
                    <Text.H3 style={styles.textValueCountdown}>{timeLeft.minute}</Text.H3>
                </View>
                <Text style={styles.textLabelCountdown}>
                    {timeLeft.minute <= 1 ? Strings.minute : Strings.minutes}
                </Text>
            </View>
            <View style={styles.rowCountdownItem}>
                <View style={styles.textCountdownContainer}>
                    <Text.H3 style={styles.textValueCountdown}>{timeLeft.second}</Text.H3>
                </View>
                <Text style={styles.textLabelCountdown}>
                    {timeLeft.second <= 1 ? Strings.second : Strings.seconds}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    rowCountdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        marginTop: 8,
    },
    rowCountdownItem: {
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    textCountdownContainer: {
        backgroundColor: '#f1f9ea',
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        minWidth: 40,
    },
    textValueCountdown: {
        color: '#18191a',
        fontWeight: 'bold',
    },
    textLabelCountdown: {
        fontSize: ScaleSize(11),
        color: '#9da2a6',
        marginTop: 4,
        textAlign: 'center',
    },
});

export default CountdownBox;
