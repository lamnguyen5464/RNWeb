import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, AppState, Linking, DeviceEventEmitter } from 'react-native';
import MaxApi from '@momo-platform/max-api';
import { ScaleSize } from '@momo-platform/component-kits';
import { EVENT_STATUS, WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';
import { DEVICE_WIDTH, EVENT_BANNER_HEIGHT } from '../utils/Dimensions';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import { NavigatorAction } from '../screens/Walking';
import WalkingEventDetail from '../screens/WalkingEventDetail';
import {
    ShimmerPlaceHolder,
    WalkingContext,
    WalkingInfoPopup,
    WalkingButton,
    WalkingEventInfo,
} from '../components';
import { WALKING_GRANTED_PERMISSION_EVENT } from '../utils/EventTypes';
import { WalkingGroup } from '../screens';
import { deepMemo } from 'use-hook-kits';

const WalkingSectionEvents = props => {
    let appState = AppState.currentState;
    let selectingEvent;
    const [showLoading, setShowLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [userJoinedEvents, setUserJoinedEvents] = useState([]);
    const { walkingGranted } = useContext(WalkingContext);

    let callingJoinEvent = false;

    useEffect(() => {
        getData();
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);

    useEffect(() => {
        if (events?.length > 0) {
            let ids = [];
            events.map(item => ids.push(`${item?.eventId}`));
            WalkingHelper.getUserJoinedEvents(ids, (status, response) => {
                if (status && response?.items?.length > 0) {
                    setUserJoinedEvents(response?.items);
                }
            });
        }
    }, [events]);

    const getData = () => {
        WalkingHelper.getListEvents(({ result, momoMsg }) => {
            if (result && momoMsg?.events) {
                setEvents(momoMsg.events);
            }
            if (showLoading) {
                setShowLoading(false);
            }
        });
    };

    const onPressEventDetail = event => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_event_detail',
            info1: `click_event_detail_${event?.eventId}`,
        });

        NavigatorAction?.push({
            screen: WalkingEventDetail,
            params: {
                defaultParam: JSON.stringify({ eventId: event?.eventId }),
                isDonation: event?.isDonation,
                donationUrl: event?.donationUrl,
                ctaDonation: event?.ctaDonation,
                donationDes: event?.donationDes,
                onClose: () => getData(),
                homeCallback: () => getData(),
                depth: 1,
            },
            options: {
                headerShown: false,
            },
        });
    };

    const onPressShare = event => {
        if (event?.shareUrl) {
            WalkingHelper.shareUrl(event?.shareUrl);
        }
    };

    const onPressRequestWalkingPermission = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_event_grant_step_count',
        });

        MaxApi.requestPermission('fitness', status => {
            const isGroupEvent = selectingEvent?.groups ? true : false;
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
            WalkingHelper.saveTimeUserGranted();
            if (isGroupEvent) {
                NavigatorAction?.push({
                    screen: WalkingGroup,
                    params: {
                        defaultParam: JSON.stringify(selectingEvent),
                        onClose: () => {
                            getData();
                        },
                        homeCallback: () => getData(),
                        depth: 1,
                    },
                    options: {
                        headerShown: false,
                    },
                });
            } else {
                requestJoinEvent(selectingEvent);
            }
            onClosePopupRequirePermission();
            DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
        });
    };

    const handleAppStateChange = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            WalkingHelper.getSteps(true).then(steps => {
                const isGroupEvent = selectingEvent?.groups ? true : false;
                if (steps && selectingEvent?.eventId) {
                    WalkingHelper.saveTimeUserGranted();
                    if (isGroupEvent) {
                        NavigatorAction?.push({
                            screen: WalkingGroup,
                            params: {
                                defaultParam: JSON.stringify(selectingEvent),
                                onClose: () => {
                                    getData();
                                },
                                homeCallback: () => getData(),
                                depth: 1,
                            },
                            options: {
                                headerShown: false,
                            },
                        });
                    } else {
                        requestJoinEvent(selectingEvent);
                    }
                    onClosePopupRequirePermission();
                    DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
                }
            });
        }
        appState = nextAppState;
    };

    const onClosePopupRequirePermission = () => {
        selectingEvent = false;
        AppState.removeEventListener('change', handleAppStateChange);
    };

    const requestJoinEvent = event => {
        if (!event?.eventId || callingJoinEvent) {
            return;
        }

        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_main_event_join',
            info1: `click_main_event_join_${event?.eventId}`,
        });

        callingJoinEvent = true;
        selectingEvent = event;
        let eventId = event?.eventId;
        WalkingHelper.postJoinEvent({ eventId }, ({ result, momoMsg }) => {
            callingJoinEvent = false;
            let popupData;
            if (result && momoMsg) {
                getData();
                popupData = {
                    title: momoMsg.title || Strings.joinSuccess,
                    desc: momoMsg.desc || Strings.joinEventDesc,
                    buttons: [
                        {
                            title: Strings.share,
                            onPress: () => onPressShare(event),
                        },
                        {
                            title: Strings.detail,
                            onPress: () => {
                                setTimeout(() => {
                                    onPressEventDetail(event);
                                }, 350);
                            },
                            highlight: true,
                        },
                    ],
                };
                if (momoMsg.bannerUrl) {
                    popupData.bannerUrl = momoMsg.bannerUrl;
                }
                if (momoMsg.shareUrl) {
                    popupData.shareUrl = momoMsg.shareUrl;
                }
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
                if (momoMsg?.bannerUrl) {
                    popupData.bannerUrl = momoMsg?.momoMsg?.bannerUrl;
                }
            }

            NavigatorAction?.show({
                screen: WalkingInfoPopup,
                params: {
                    data: popupData,
                },
            });
        });
    };

    const onPressEventJoin = event => {
        if (walkingGranted) {
            const isGroupEvent = event?.groups ? true : false;
            if (isGroupEvent) {
                MaxApi.trackEvent(WALKING_EVENT_NAME, {
                    action: 'click_main_event_group_join',
                    info1: `click_main_event_group_join_step1_${event?.eventId}`,
                });
                // Is group event
                NavigatorAction?.push({
                    screen: WalkingGroup,
                    params: {
                        defaultParam: JSON.stringify(event),
                        onClose: () => {
                            getData();
                        },
                        homeCallback: () => getData(),
                        depth: 1,
                    },
                    options: {
                        headerShown: false,
                    },
                });
            } else {
                requestJoinEvent(event);
            }
        } else {
            AppState.addEventListener('change', handleAppStateChange);
            selectingEvent = event;

            const popupData = {
                bannerSource: images.ic_walking,
                bannerStyle: { marginTop: 10, width: 100, height: 100 },
                title: Strings.beforeBegin,
                titleStyle: { textAlign: 'center' },
                desc: Strings.walkingMomoPermission,
                descStyle: { textAlign: 'center' },
                buttons: [
                    {
                        title: Strings.sync,
                        onPress: () => onPressRequestWalkingPermission(),
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
        }
    };

    const getTopGroups = groups => {
        if (groups) {
            // Sort groups in descending order
            let tempGroups = Array.from(groups);
            tempGroups.sort((group1, group2) => {
                if (group2.totalWalkStep === group1.totalWalkStep) {
                    if (group2.priority === group1.priority) {
                        return group1.name.localeCompare(group2.name);
                    }
                    return group2.priority - group1.priority;
                }
                return group2.totalWalkStep - group1.totalWalkStep;
            });
            let length = tempGroups.length < 3 ? tempGroups.length : 3;
            let topThree = tempGroups.splice(0, length);
            // Add progress data for top 3 groups
            for (let i = 0; i < length; i++) {
                if (topThree[i].totalWalkStep === 0) {
                    topThree[i].progress = 0;
                } else if (i === 0) {
                    topThree[i].progress = 100;
                } else {
                    topThree[i].progress = Math.ceil(
                        (topThree[i].totalWalkStep / topThree[0].totalWalkStep) * 100
                    );
                }
            }
            return topThree;
        }
        return [];
    };

    const renderItem = (data, index) => {
        if (!data) {
            return null;
        }
        let userJoined = userJoinedEvents?.find?.(
            item => Number(item?.eventId) === Number(data?.eventId)
        );

        const isGroupEvent = data.groups ? true : false;
        const topGroups = getTopGroups(data.groups);

        const renderedButton = [];
        if (data?.userJoined || data?.status === EVENT_STATUS.OFF) {
            renderedButton.push(
                <WalkingButton
                    key={'button_detail'}
                    onPress={() => onPressEventDetail(data)}
                    title={Strings.detail}
                    style={{ flex: 1 }}
                />
            );
        } else {
            renderedButton.push(
                <WalkingButton
                    key={'button_detail'}
                    onPress={() => onPressEventDetail(data)}
                    title={Strings.detail}
                    type="border"
                />
            );
            renderedButton.push(
                <WalkingButton
                    key={'button_join'}
                    onPress={() => onPressEventJoin(data)}
                    title={Strings.join}
                    style={{ flex: 1, marginLeft: 8 }}
                />
            );
        }

        return (
            <View key={`event_${index}`} style={styles.root}>
                <WalkingEventInfo
                    data={data}
                    showEventInfo={true}
                    showOnlyDate={data?.userJoined && isGroupEvent}
                    rankingGroup={topGroups}
                    showJoinedUsers={true}
                    showTarget={
                        !props.hideEventsTarget &&
                        data?.userJoined &&
                        !isGroupEvent &&
                        data?.status === EVENT_STATUS.ON
                    }
                    joinedUsers={userJoined}
                    onPressBanner={() => onPressEventDetail(data)}
                    countdownText={Strings.endSoon}
                />
                <View style={styles.rowButtonContainer}>{renderedButton}</View>
            </View>
        );
    };

    const renderLoading = () => {
        return (
            <View style={loadingStyles.container}>
                <ShimmerPlaceHolder autoRun={true} style={loadingStyles.banner} />
                <ShimmerPlaceHolder autoRun={true} style={loadingStyles.header} />
                <View style={loadingStyles.contentContainer}>
                    <ShimmerPlaceHolder autoRun={true} style={loadingStyles.icon} />
                    <ShimmerPlaceHolder autoRun={true} style={loadingStyles.desc} />
                </View>
                <View style={loadingStyles.contentContainer}>
                    <ShimmerPlaceHolder autoRun={true} style={loadingStyles.icon} />
                    <ShimmerPlaceHolder autoRun={true} style={loadingStyles.desc} />
                </View>
                <View style={loadingStyles.contentContainer}>
                    <ShimmerPlaceHolder autoRun={true} style={loadingStyles.icon} />
                    <ShimmerPlaceHolder autoRun={true} style={loadingStyles.desc} />
                </View>
                <ShimmerPlaceHolder autoRun={true} style={loadingStyles.smallDesc} />
                <ShimmerPlaceHolder autoRun={true} style={loadingStyles.cta} />
            </View>
        );
    };

    let renderedItems = [];
    events?.map((item, index) => {
        renderedItems.push(renderItem(item, index));
    });

    if (showLoading) {
        return renderLoading();
    } else if (!events || events?.length === 0) {
        return null;
    }

    return (
        <View>
            {/* <Text style={styles.textHeader}>Sự kiện đang diễn ra</Text> */}
            {renderedItems}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
    },
    contentContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
    },
    textHeader: {
        color: '#18191a',
        fontWeight: 'bold',
        fontSize: ScaleSize(16),
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    textContent: {
        color: '#303233',
        fontSize: ScaleSize(14),
        flex: 1,
    },
    leftIcon: {
        width: 24,
        height: 24,
        marginRight: 4,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    htmlContainer: {
        color: '#303233',
        flex: 1,
    },
    rowButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        paddingHorizontal: 12,
    },
    buttonContainer: {
        paddingVertical: 8,
        paddingHorizontal: 30,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#52c41a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        fontSize: ScaleSize(14),
        color: '#52c41a',
        fontWeight: '600',
    },
    buttonHighlightContainer: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 30,
        marginHorizontal: 4,
        backgroundColor: '#52c41a',
        borderRadius: 8,
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButtonHighlight: {
        fontSize: ScaleSize(14),
        color: '#ffffff',
        fontWeight: '600',
    },
});

const loadingStyles = StyleSheet.create({
    container: {
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
        backgroundColor: '#ffffff',
    },
    banner: {
        height: EVENT_BANNER_HEIGHT,
        width: DEVICE_WIDTH,
    },
    header: {
        height: 20,
        width: DEVICE_WIDTH - 32,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 4,
        borderWidth: 0,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        borderRadius: 4,
        borderWidth: 0,
    },
    icon: {
        height: 20,
        width: 20,
        borderRadius: 4,
        borderWidth: 0,
    },
    desc: {
        height: 20,
        width: '50%',
        marginHorizontal: 4,
        marginVertical: 8,
        borderRadius: 4,
        borderWidth: 0,
    },
    smallDesc: {
        height: 14,
        width: DEVICE_WIDTH - 32,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 4,
        borderWidth: 0,
    },
    cta: {
        height: 32,
        width: DEVICE_WIDTH - 32,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 4,
        borderWidth: 0,
    },
});

export default deepMemo(WalkingSectionEvents);
