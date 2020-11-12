/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { GRAY_COLOR_3 } from '../utils/Colors';
import images from '../assets/images';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import DeviceUtils from '../utils/DeviceUtils';
import Strings from '../utils/Strings';
import Header from '../components/Header';
import WalkingFooter from '../components/WalkingFooter';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { deepMemo } from 'use-hook-kits';

const IMAGE_TOP_HEIGHT = (DEVICE_WIDTH * 528) / 750 + (DeviceUtils.isIphoneX() ? 44 : 0);

const CashbackWalkingInfo = props => {
    const _onGoBack = () => {
        props.navigator.pop();
    };

    const configInfo = props.params.defaultParam?.info;

    return (
        <View style={styles.container}>
            <Header onPressLeft={_onGoBack} title={Strings.intro} />
            <ScrollView bounces={false}>
                <Image style={styles.img} source={images.img_walking_info_top_1} />
                <View style={{ padding: 20 }}>
                    <Text.H3 style={styles.header}>{configInfo?.header || ''}</Text.H3>
                    <Text.H4 style={styles.subTitle}>{configInfo?.aboutTitle || ''}</Text.H4>
                    <Text.Title style={styles.content}>{configInfo?.aboutContent || ''}</Text.Title>
                    <Text>
                        <Text style={styles.content}>{configInfo?.aboutHelp || ''} </Text>
                        <Text.Title
                            // onPress={this.onPressHelp}
                            style={styles.highlight}
                        >
                            {configInfo?.aboutHelpText || ''}
                        </Text.Title>
                    </Text>
                    <Text style={styles.subTitle}>{configInfo?.useTitle || ''}</Text>
                </View>
                <WalkingFooter />
            </ScrollView>
        </View>
    );
};

export default deepMemo(CashbackWalkingInfo);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    img: {
        width: DEVICE_WIDTH,
        height: IMAGE_TOP_HEIGHT,
        resizeMode: 'contain',
    },
    wrapHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    textNav: {
        flex: 1,
        color: GRAY_COLOR_3,
        fontSize: ScaleSize(18),
        textAlign: 'center',
        paddingRight: 40,
    },
    header: {
        color: GRAY_COLOR_3,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    subTitle: {
        color: GRAY_COLOR_3,
        fontWeight: Platform.OS === 'ios' ? '600' : '500',
        paddingTop: 10,
    },
    content: {
        color: GRAY_COLOR_3,
        paddingVertical: 5,
    },
    highlight: {
        color: '#4a90e2',
        fontWeight: Platform.OS === 'ios' ? '600' : '500',
    },
});
