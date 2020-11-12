import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { ifIphoneX } from '../utils/DeviceUtils';
import { DEVICE_HEIGHT } from '../utils/Dimensions';
import images from '../assets/images/';
import { GREEN_COLOR, GREEN_COLOR_2 } from '../utils/Colors';
import { Flex, Text, Image } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import WalkingHelper from '../api/WalkingHelper';
import WalkingButton from './WalkingButton';
import { WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';

const WalkingContactPermission = ({ onDone }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AppState.addEventListener('change', handleChange);

        return () => {
            AppState.removeEventListener('change', handleChange);
        };
    }, []);

    const handleChange = async newState => {
        if (newState === 'active') {
            const status = await WalkingHelper.getContactPermission();
            setLoading(false);
            if (status === 'granted') {
                onDone();
            }
        }
    };

    const askContactsPermission = () => {
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
        //     action: 'click_onboarding_grant_contact',
        // });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_onboarding_grant_contact',
        });
        setLoading(true);
        MaxApi.requestPermission('contacts', status => {
            setLoading(false);
            if (status === 'granted') {
                onDone();
            }
        });
    };

    return (
        <Flex style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={onDone} activeOpacity={0.7} style={styles.btnClose}>
                <Image source={images.ic_close} style={styles.iconClose} />
            </TouchableOpacity>
            <Image source={images.ic_contact} style={styles.iconContact} />
            <Text.H3 style={styles.txtTitle}>{Strings.challengeWithFriends}</Text.H3>
            <Text style={styles.txtDesc}>{Strings.contactPermissionFirst}</Text>
            <View style={styles.wrapButton}>
                <WalkingButton
                    onPress={askContactsPermission}
                    title={Strings.allow}
                    loading={loading}
                />
            </View>
        </Flex>
    );
};

const styles = StyleSheet.create({
    btnClose: { position: 'absolute', right: 20, top: ifIphoneX(55, 30), zIndex: 1 },
    iconClose: { width: 24, height: 24 },
    iconContact: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginTop: DEVICE_HEIGHT * 0.15,
    },
    txtTitle: {
        alignSelf: 'center',
        fontWeight: '600',
        marginTop: 100,
        color: GREEN_COLOR_2,
    },
    txtDesc: {
        paddingHorizontal: 30,
        marginTop: 8,
        alignSelf: 'center',
        textAlign: 'center',
        lineHeight: 21,
    },
    wrapButton: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: ifIphoneX(34, 12),
        left: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingTop: 6,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 2,
    },
    btnAccept: {
        backgroundColor: GREEN_COLOR,
        height: 42,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(WalkingContactPermission);
