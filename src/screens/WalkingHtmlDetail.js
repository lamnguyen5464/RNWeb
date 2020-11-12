import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Flex, Image, HTMLView, Text } from '@momo-platform/component-kits';
import Header from '../components/Header';
import { isIphoneX } from '../utils/DeviceUtils';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import images from '../assets/images';
import { NavigatorAction } from '../screens/Walking';
import Strings from '../utils/Strings';
import { deepMemo } from 'use-hook-kits';

const WalkingHtmlDetail = ({ params = {} }) => {
    const { contentJoined } = params;

    return (
        <Flex style={styles.container}>
            <Header
                backgroundColor={'#ffff'}
                title={Strings.eventInfo}
                onPressLeft={() => NavigatorAction?.pop()}
            />
            <ScrollView>
                {contentJoined ? (
                    <HTMLView
                        addLineBreaks={false}
                        style={styles.htmlContainer}
                        styleSheet={htmlStyles}
                        value={`<div>${contentJoined}</div>`}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Image style={styles.emptyImage} source={images.ic_walking_gray} />
                        <Text.Title style={styles.textEmpty}>
                            {Strings.updatingEventInfo}
                        </Text.Title>
                    </View>
                )}
            </ScrollView>
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: isIphoneX() ? -40 : 0,
        marginBottom: isIphoneX ? 20 : 0,
        backgroundColor: 'white',
    },
    emptyContainer: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        width: DEVICE_WIDTH / 2.5,
        height: DEVICE_WIDTH / 2.5,
    },
    textEmpty: {
        marginTop: 20,
        paddingHorizontal: 15,
        textAlign: 'center',
        color: '#303233',
    },
    htmlContainer: {
        flex: 1,
        paddingHorizontal: 12,
    },
});

const htmlStyles = {
    b: {
        color: '#303233',
        fontSize: 14,
        fontWeight: 'bold',
    },
    strong: {
        color: '#303233',
        fontSize: 14,
        fontWeight: 'bold',
    },
    p: {
        color: '#303233',
        fontSize: 14,
    },
    div: {
        color: '#303233',
        fontSize: 14,
    },
    img: {
        maxWidth: DEVICE_WIDTH - 24,
    },
};

export default deepMemo(WalkingHtmlDetail);
