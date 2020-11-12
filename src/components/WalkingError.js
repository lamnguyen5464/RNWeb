import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, Text } from '@momo-platform/component-kits';
import images from '../assets/images';
import { TEXT_BLACK_COLOR } from '../utils/Colors';
import Strings from '../utils/Strings';

const WalkingError = () => {
    return (
        <View style={styles.container}>
            <Image source={images.ic_error} style={styles.img} resizeMode="contain" />
            <Text style={styles.txtDescription}>{Strings.momoError}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: { width: 120, height: 120 },
    txtDescription: {
        paddingHorizontal: 68,
        textAlign: 'center',
        lineHeight: 21,
        color: TEXT_BLACK_COLOR,
    },
});

export default React.memo(WalkingError);
