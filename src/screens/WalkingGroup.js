/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    AppState,
    DeviceEventEmitter,
    Linking,
} from 'react-native';
import { Flex, Text, Image } from '@momo-platform/component-kits';
import { debounce } from 'lodash';
import { Header, WalkingGroupItem, WalkingInfoPopup } from '../components';
import { parseJsonString } from '../utils/StringUtils';
import { isIphoneX } from '../utils/DeviceUtils';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import { GREEN_COLOR } from '../utils/Colors';
import { EVENT_STATUS, WALKING_EVENT_NAME, POPUP_TYPE_CONFIRM_JOIN_GROUP } from '../utils/Const';
import { WALKING_GRANTED_PERMISSION_EVENT, WALKING_JOINED_EVENT } from '../utils/EventTypes';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import MaxApi from '@momo-platform/max-api';
import { NavigatorAction } from './Walking';
import WalkingEventDetail from './WalkingEventDetail';
import Strings from '../utils/Strings';
import { deepMemo } from 'use-hook-kits';

const WalkingGroup = props => {
    let appState = AppState.currentState;
    let callingJoinEvent = false;
    let timeOut = null;
    const data = parseJsonString(props.params.defaultParam);
    const { eventId } = data;
    const [event, setEvent] = useState(null);
    const [list, setList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [walkingGranted, setWalkingGranted] = useState(false);

    useEffect(() => {
        getEventData(eventId);

        WalkingHelper.getSteps(true).then(status => {
            setWalkingGranted(status);
        });
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
            timeOut && clearTimeout(timeOut);
        };
    }, []);

    useEffect(() => {
        event?.groups && setList(event.groups.sort((a, b) => a.name.localeCompare(b.name)));
    }, [event]);

    const getEventData = eventId => {
        if (eventId) {
            WalkingHelper.getEventDetail(eventId, ({ result, momoMsg }) => {
                let eventResult;
                if (result && momoMsg?.event) {
                    eventResult = momoMsg?.event;
                }
                setEvent(eventResult);
            });
        }
    };

    const confirmJoinGroup = () => {
        const popupData = {
            title: Strings.confirmGroupTitle,
            desc: Strings.confirmGroupDesc,
            type: POPUP_TYPE_CONFIRM_JOIN_GROUP,
            groupName: selectedGroup.name,
            buttons: [
                {
                    title: Strings.confirmCancel,
                    onPress: () => {},
                    highlight: false,
                },
                {
                    title: Strings.confirmJoin,
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

    const handleWalkingGranted = () => {
        WalkingHelper.saveTimeUserGranted();
        onClosePopupRequirePermission();
        confirmJoinGroup();
        DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
    };

    const onPressRequestWalkingPermission = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_event_grant_step_count',
        });
        MaxApi.requestPermission('fitness', status => {
            if (status === 'unavailable') {
                MaxApi.showAlert(Strings.walkingPermissionError);
                return;
            }
            if (status === 'denied') {
                Linking.openURL('x-apple-health://sources')
                    .then(() => {
                        AppState.addEventListener('change', handleAppStateChange);
                    })
                    .catch(() => {
                        MaxApi.showAlert(Strings.walkingPermissionError);
                    });
                return;
            }

            handleWalkingGranted();
        });
    };

    const handleAppStateChange = nextAppState => {
        if (appState?.match(/inactive|background/) && nextAppState === 'active') {
            WalkingHelper.getSteps(true).then(steps => {
                if (steps) {
                    handleWalkingGranted();
                }
            });
        }
        appState = nextAppState;
    };

    const onClosePopupRequirePermission = () => {
        AppState.removeEventListener('change', handleAppStateChange);
    };

    const onPressShare = shareUrl => {
        if (!shareUrl) {
            shareUrl = event?.shareUrl;
        }
        if (shareUrl) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_event_share',
                info1: `click_event_share_${event?.eventId}`,
            });
            WalkingHelper.shareUrl(shareUrl, () => {
                MaxApi.trackEvent(WALKING_EVENT_NAME, {
                    action: 'click_event_share_joined',
                    info1: `click_event_share_joined_${event?.eventId}`,
                });
            });
        }
    };

    const requestJoinEvent = () => {
        if (callingJoinEvent) {
            return;
        }
        callingJoinEvent = true;
        WalkingHelper.postJoinEvent(
            { eventId, groupId: selectedGroup.id },
            ({ result, momoMsg }) => {
                callingJoinEvent = false;
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
                    timeOut = setTimeout(() => {
                        NavigatorAction?.replace({
                            screen: WalkingEventDetail,
                            params: {
                                defaultParam: JSON.stringify({ eventId: event.eventId }),
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
                        title: momoMsg?.title,
                        desc: momoMsg?.desc,
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
            }
        );
    };

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ paddingLeft: 10 }}>
                <WalkingGroupItem
                    data={{ eventId: event.eventId, group: item }}
                    onPressItem={() => {
                        setSelectedGroup(item);
                    }}
                    onPressItemDetail={() => {
                        MaxApi.trackEvent(WALKING_EVENT_NAME, {
                            action: 'click_list_team_team_detail',
                            info1: `click_list_team_team_detail_${item.id}`,
                        });
                        setSelectedGroup(null);
                    }}
                    onPressDetailCallback={() => {
                        getEventData(eventId);
                    }}
                    depth={props.params.depth}
                    homeCallback={props.params.homeCallback}
                    isSelected={selectedGroup?.id === item.id}
                    screenName="WalkingGroup"
                />
            </View>
        );
    };

    const renderEmpty = ({ item, index }) => {
        return <View />;
    };

    const renderFooter = () => {
        return <View style={{ height: isIphoneX() ? 84 : 64 }} />;
    };

    const onPressJoin = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_main_event_group_join',
            info1: `click_main_event_group_join_step2a_${eventId}`,
        });
        if (selectedGroup) {
            if (!walkingGranted) {
                AppState.addEventListener('change', handleAppStateChange);
                let popupData = {
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
                                onPressRequestWalkingPermission();
                            },
                            highlight: true,
                            disableClose: true,
                        },
                    ],
                };
                NavigatorAction?.show({
                    screen: WalkingInfoPopup,
                    params: {
                        onClose: onClosePopupRequirePermission,
                        data: popupData,
                        closeOnEvent: true,
                    },
                });
            } else {
                confirmJoinGroup();
            }
        } else {
            MaxApi.showToast({
                description: Strings.chooseTeam,
                duration: 1500,
            });
        }
    };

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
                title={'Danh sách đội'}
            />
            <View style={styles.infoView}>
                <Image
                    style={{ width: 16, height: 16, marginRight: 12 }}
                    source={images.ic_info_blue_outline}
                />
                <Text.SubTitle style={styles.infoText}>{Strings.chooseTeamToJoin}</Text.SubTitle>
            </View>
            <FlatList
                data={list}
                keyExtractor={(_, index) => 'item_' + index}
                renderItem={renderItem}
                extraData={selectedGroup}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
            />
            {event && !event?.userJoined && event?.status !== EVENT_STATUS.OFF && (
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
    textButton: {
        color: '#ffffff',
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
    infoView: {
        padding: 12,
        margin: 12,
        borderRadius: 8,
        width: DEVICE_WIDTH - 24,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f0f5ff',
    },
    infoText: {
        color: '#303233',
    },
});

export default deepMemo(WalkingGroup);
