/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    AppState,
    ScrollView,
    DeviceEventEmitter,
    Linking,
} from 'react-native';
import { Image, HTMLView, Flex, Text } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import { debounce } from 'lodash';
import { Header, WalkingInfoPopup } from '../components';
import images from '../assets/images';
import { isIphoneX } from '../utils/DeviceUtils';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { GREEN_COLOR } from '../utils/Colors';
import { parseJsonString } from '../utils/StringUtils';
import { WALKING_EVENT_NAME, POPUP_TYPE_CONFIRM_JOIN_GROUP } from '../utils/Const';
import { WALKING_GRANTED_PERMISSION_EVENT, WALKING_JOINED_EVENT } from '../utils/EventTypes';
import WalkingHelper from '../api/WalkingHelper';
import { NavigatorAction } from './Walking';
import WalkingEventDetail from './WalkingEventDetail';
import Strings from '../utils/Strings';
import { deepMemo } from 'use-hook-kits';

const WalkingGroupDetail = props => {
    let appState = AppState.currentState;
    const data = parseJsonString(props.params.defaultParam);
    const { eventId, group } = data || {};
    let { id, name, description, banner, slogan, avatar, totalUserJoinGroup } = group || {};

    let callingJoin = false;
    let shareUrl = '';

    const [walkingGranted, setWalkingGranted] = useState(false);
    const [userJoined, setUserJoined] = useState(false);

    useEffect(() => {
        getUserJoinedData(eventId);

        WalkingHelper.getSteps(true).then(status => {
            setWalkingGranted(status);
        });
    }, []);

    const getUserJoinedData = eventId => {
        if (eventId) {
            WalkingHelper.getEventDetail(eventId, ({ result, momoMsg }) => {
                let eventResult;
                if (result && momoMsg?.event) {
                    eventResult = momoMsg?.event;
                    shareUrl = eventResult.shareUrl;
                }
                setUserJoined(eventResult.userJoined);
            });
        }
    };

    const confirmJoinGroup = () => {
        const popupData = {
            title: Strings.confirmGroupTitle,
            desc: Strings.confirmGroupDesc,
            type: POPUP_TYPE_CONFIRM_JOIN_GROUP,
            groupName: name,
            buttons: [
                {
                    title: Strings.confirmCancel,
                    onPress: () => {},
                    highlight: false,
                },
                {
                    title: Strings.join,
                    onPress: () => {
                        MaxApi.trackEvent(WALKING_EVENT_NAME, {
                            action: 'click_main_event_group_join',
                            info1: `click_main_event_group_join_step3_${eventId}`,
                        });
                        requestJoinEvent();
                    },
                    highlight: true,
                },
            ],
            noClose: true,
        };
        NavigatorAction?.show({
            screen: WalkingInfoPopup,
            params: {
                onClose: onClosePopupRequirePermission,
                data: popupData,
            },
        });
    };

    const onClosePopupRequirePermission = () => {
        AppState.removeEventListener('change', handleAppStateChange);
    };

    const handleWalkingGranted = () => {
        WalkingHelper.saveTimeUserGranted();
        onClosePopupRequirePermission();
        confirmJoinGroup();
        DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
    };

    const handleAppStateChange = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            WalkingHelper.getSteps(true).then(status => {
                if (status) {
                    handleWalkingGranted();
                }
            });
        }
        appState = nextAppState;
    };

    const onPressShare = momoMsgShareUrl => {
        if (momoMsgShareUrl) {
            shareUrl = momoMsgShareUrl;
        }
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_event_share',
            info1: `click_event_share_${data?.eventId}`,
        });
        WalkingHelper.shareUrl(shareUrl, () => {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_event_share_joined',
                info1: `click_event_share_joined_${data?.eventId}`,
            });
        });
    };

    const requestJoinEvent = () => {
        if (callingJoin) {
            return;
        }
        callingJoin = true;
        if (eventId) {
            WalkingHelper.postJoinEvent({ eventId, groupId: id }, ({ result, momoMsg }) => {
                callingJoin = false;
                let popupData;
                if (result && momoMsg) {
                    popupData = {
                        title: momoMsg.title || Strings.joinEventSuccess,
                        desc: momoMsg.desc || Strings.joinEventDesc,
                        buttons: [
                            {
                                title: Strings.share,
                                onPress: () => onPressShare(momoMsg.shareUrl),
                                highlight: true,
                            },
                        ],
                    };
                    if (momoMsg.bannerUrl) {
                        popupData.bannerUrl = momoMsg.bannerUrl;
                    }
                    DeviceEventEmitter.emit(WALKING_JOINED_EVENT);
                    setTimeout(() => {
                        NavigatorAction?.replace({
                            screen: WalkingEventDetail,
                            params: {
                                defaultParam: JSON.stringify({ eventId }),
                                onClose: () => {
                                    if (props.params.onClose) {
                                        props.params.onClose();
                                    }
                                },
                                homeCallback: props.params.homeCallback,
                                depth: props.params.depth,
                                popupData,
                            },
                            options: {
                                headerShown: false,
                            },
                        });
                    }, 350);
                } else {
                    popupData = {
                        title: momoMsg?.momoMsg?.title,
                        desc: momoMsg?.momoMsg?.desc,
                        buttons: [
                            {
                                title: Strings.close,
                                onPress: () => {},
                                highlight: true,
                            },
                        ],
                    };
                    if (momoMsg?.momoMsg?.bannerUrl) {
                        popupData.bannerUrl = momoMsg?.momoMsg?.bannerUrl;
                    }
                    NavigatorAction?.show({
                        screen: WalkingInfoPopup,
                        params: {
                            data: popupData,
                        },
                    });
                }
            });
        }
    };

    const onPressJoin = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_main_event_group_join',
            info1: `click_main_event_group_join_step2b_${eventId}`,
        });
        if (!walkingGranted) {
            AppState.addEventListener('change', handleAppStateChange);
            NavigatorAction?.show({
                screen: WalkingInfoPopup,
                params: {
                    onClose: onClosePopupRequirePermission,
                    data: {
                        bannerSource: images.ic_walking,
                        bannerStyle: { marginTop: 10, width: 100, height: 100 },
                        title: Strings.beforeStart,
                        titleStyle: { textAlign: 'center' },
                        desc: Strings.pleaseSync,
                        descStyle: { textAlign: 'center' },
                        buttons: [
                            {
                                title: Strings.sync,
                                onPress: () => {
                                    MaxApi.requestPermission('fitness', status => {
                                        if (status === 'unavailable') {
                                            MaxApi.showAlert(Strings.walkingPermissionError);
                                            return;
                                        }
                                        if (status === 'denied') {
                                            Linking.openURL('x-apple-health://sources')
                                                .then(() => {
                                                    AppState.addEventListener(
                                                        'change',
                                                        handleAppStateChange
                                                    );
                                                })
                                                .catch(() => {
                                                    MaxApi.showAlert(
                                                        Strings.walkingPermissionError
                                                    );
                                                });
                                            return;
                                        }

                                        handleWalkingGranted();
                                    });
                                },
                                highlight: true,
                                disableClose: true,
                            },
                        ],
                    },
                    closeOnEvent: true,
                },
            });
        } else {
            confirmJoinGroup();
        }
    };

    const renderFooter = () => {
        return <View style={{ marginBottom: 100 }} />;
    };

    name = name.trim();
    slogan = slogan ? slogan.trim() : '';
    if (slogan.length > 191) {
        slogan = slogan.substring(0, 188);
        slogan += '...';
    }

    return (
        <Flex style={{ flex: 1, backgroundColor: '#ffffff', paddingBottom: isIphoneX() ? -40 : 0 }}>
            <Header
                onPressLeft={() => {
                    if (props.params.onPressLeft) {
                        props.params.onPressLeft();
                    } else {
                        NavigatorAction?.pop();
                        if (props.params.onClose) {
                            props.params.onClose();
                        }
                    }
                }}
                title={Strings.teamDetail}
            />
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.container}>
                    {banner && banner?.indexOf('http') !== -1 ? (
                        <Image style={styles.banner} source={images.getImage(banner)} />
                    ) : (
                        <View style={styles.banner} />
                    )}
                    <ImageBackground
                        style={styles.avatarContainer}
                        source={images.default_group_avatar}
                    >
                        {avatar && avatar.indexOf('http') !== -1 && (
                            <Image style={styles.avatar} source={images.getImage(avatar)} />
                        )}
                    </ImageBackground>
                    <View style={styles.txtContainer}>
                        <Text.H4 numberOfLines={2} style={styles.txtGroupName}>
                            {name}
                        </Text.H4>
                        <Text.SubTitle numberOfLines={2} style={styles.txtSlogan}>
                            {slogan}
                        </Text.SubTitle>
                        {userJoined && (
                            <Text.Caption style={styles.txtUserJoinGroup}>{`${totalUserJoinGroup} ${
                                Strings.members
                            }`}</Text.Caption>
                        )}
                    </View>
                </View>
                <View style={styles.targetDivider} />
                <HTMLView
                    style={styles.desContainer}
                    styleSheet={htmlStyles}
                    value={`<div>${description}</div>`}
                />
                {renderFooter()}
            </ScrollView>
            {!userJoined && (
                <View style={styles.wrapButton}>
                    <TouchableOpacity
                        onPress={debounce(onPressJoin, 300, { leading: true, trailing: false })}
                        activeOpacity={0.8}
                        style={styles.btnAccept}
                    >
                        <Text.H4 style={styles.txtAccept}>{Strings.join}</Text.H4>
                    </TouchableOpacity>
                </View>
            )}
        </Flex>
    );
};

const styles = StyleSheet.create({
    container: {
        height: DEVICE_WIDTH / 2 + 140,
    },
    txtContainer: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        maxWidth: DEVICE_WIDTH - 24,
        marginTop: 32 + 12,
    },
    desContainer: {
        padding: 12,
        paddingTop: 24,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'left',
    },
    txtDes: {
        color: '#303233',
    },
    txtGroupName: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    txtSlogan: {
        color: '#727272',
        textAlign: 'center',
        marginBottom: 8,
    },
    txtUserJoinGroup: {
        textAlign: 'center',
        color: '#303233',
    },
    banner: {
        width: DEVICE_WIDTH,
        alignSelf: 'center',
        height: DEVICE_WIDTH / 2,
        backgroundColor: '#e8e8e8',
    },
    avatarContainer: {
        width: 64,
        height: 64,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: DEVICE_WIDTH / 2 - 32,
        marginBottom: 8,
    },
    avatar: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#ffffff',
    },
    icon: {
        width: 24,
        height: 24,
    },
    wrapButton: {
        paddingBottom: isIphoneX() ? 30 : 10,
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
    txtAccept: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    targetDivider: {
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
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

export default deepMemo(WalkingGroupDetail);
