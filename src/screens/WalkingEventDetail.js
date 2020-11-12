/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    AppState,
    DeviceEventEmitter,
    ActivityIndicator,
    ScrollView,
    Linking,
} from 'react-native';
import { Image, Switch, Flex, Text, Colors } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import { debounce } from 'lodash';
import {
    Header,
    WalkingButton,
    WalkingEventInfo,
    WalkingRankingItem,
    WalkingInfoPopup,
    UserInfoBottomAnimated,
    WalkingGroupRankingItem,
    WalkingGroupItem,
} from '../components';
import { EVENT_STATUS, POPUP_TYPE_CONFIRM_JOIN_GROUP, WALKING_EVENT_NAME } from '../utils/Const';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { isIphoneX } from '../utils/DeviceUtils';
import { GREEN_COLOR } from '../utils/Colors';
import images from '../assets/images';
import { parseJsonString } from '../utils/StringUtils';
import WalkingHelper from '../api/WalkingHelper';
import MomoAsyncHelper from '../utils/MomoAsyncHelper';
import { NavigatorAction } from './Walking';
import Strings from '../utils/Strings';
import WalkingGroup from './WalkingGroup';
import {
    CONTACT_GRANTED_PERMISSION_EVENT,
    WALKING_GRANTED_PERMISSION_EVENT,
    WALKING_JOINED_EVENT,
} from '../utils/EventTypes';
import { deepMemo } from 'use-hook-kits';

const TOGGLE_KEY = 'EVENT_DETAIL_IS_FRIEND_';

const WalkingEventDetail = props => {
    const [data, setData] = useState();
    const [isFriend, setIsFriend] = useState(false);
    const [rankingMomo, setRankingMomo] = useState([]);
    const [rankingContact, setRankingContact] = useState([]);
    const [rankingGroup, setRankingGroup] = useState([]);
    const [userDataMomo, setUserDataMomo] = useState();
    const [userDataFriend, setUserDataFriend] = useState();
    const [selectedGroup, setSelectedGroup] = useState(null);

    let userDataMomoGlobal, userDataFriendGlobal;

    const refUserInfoBottom = useRef();
    const refScrollView = useRef();

    const { donationUrl, isDonation, ctaDonation, donationDes } = props?.params || {
        donationUrl: '',
        isDonation: 0,
        ctaDonation: '',
        donationDes: '',
    };

    const onViewableItemsRef = useRef(listData => {
        if (Array.isArray(listData?.viewableItems) && listData?.viewableItems.length > 0) {
            let userInfoVisible = true;
            let user = isFriend ? userDataFriendGlobal : userDataMomoGlobal;
            listData?.viewableItems?.map?.(viewable => {
                if (viewable?.item?.userId === user?.userId) {
                    userInfoVisible = false;
                }
            });
            if (userInfoVisible) {
                refUserInfoBottom.current?.show?.();
            } else {
                refUserInfoBottom.current?.hide?.();
            }
        }
    }).current;

    const [contactGranted, setContactGranted] = useState(false);
    const [walkingGranted, setWalkingGranted] = useState(false);
    const [joinedUsers, setJoinedUsers] = useState();
    const [groupSelectionPos, setGroupSelectionPos] = useState(null);
    const [contentPos, setContentPos] = useState(null);

    let appState = AppState.currentState;
    let callingJoin = false;
    let isGroupEvent = data?.groups ? true : false;

    const _setGroupSelectionPos = event => {
        setGroupSelectionPos({
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
        });
    };

    const _setContentPos = event => {
        setContentPos({
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
        });
    };

    useEffect(() => {
        if (props.params.popupData) {
            NavigatorAction?.show({
                screen: WalkingInfoPopup,
                params: {
                    data: props.params.popupData,
                },
            });
        }

        let event;
        if (typeof props.params.defaultParam === 'string') {
            event = parseJsonString(props.params.defaultParam);
        } else {
            event = props.params.defaultParam;
        }

        if (
            event?.eventId &&
            event?.title &&
            (!event?.groups || (event?.groups && event.groups.length > 0))
        ) {
            setData(event);
        } else {
            getData(event.eventId);
        }

        MaxApi.checkPermission('contacts', status => {
            setContactGranted(status === 'granted');
        });

        WalkingHelper.getSteps(true).then(steps => {
            setWalkingGranted(true);
        });

        WalkingHelper.getEventRankingMoMo(event?.eventId, (status, response) => {
            if (status) {
                if (response?.items?.length > 0) {
                    setRankingMomo(response?.items);
                }
                if (response?.meta) {
                    userDataMomoGlobal = response?.meta;
                    setUserDataMomo(response?.meta);
                }
            }
        });

        WalkingHelper.getEventRankingContact(event?.eventId, (status, response) => {
            if (status) {
                if (response?.items?.length > 0) {
                    setRankingContact(response?.items);
                }
                if (response?.meta) {
                    userDataFriendGlobal = response?.meta;
                    setUserDataFriend(response?.meta);
                }
            }
        });

        MomoAsyncHelper.getItemAsync(`${TOGGLE_KEY}${event?.eventId}`, result => {
            if (result) {
                setIsFriend(true);
            }
        });
    }, []);

    useEffect(() => {
        if (data?.eventId && data?.title) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                stage: data.userJoined
                    ? 'scr_event_details_show'
                    : 'scr_event_details_pre_join_show',
            });
            let ids = [];
            ids.push(data?.eventId + '');
            WalkingHelper.getUserJoinedEvents(ids, ({ status, response }) => {
                if (status && response?.items?.[0]) {
                    setJoinedUsers(response?.items?.[0]);
                }
            });

            if (data?.groups && data?.userJoined) {
                rankGroups(data.groups);
            }
        }
    }, [data]);

    const getData = eventId => {
        if (eventId) {
            WalkingHelper.getEventDetail(eventId, ({ result, momoMsg }) => {
                let eventResult;
                if (result && momoMsg?.event) {
                    eventResult = momoMsg?.event;
                }
                setData(eventResult);
            });
        }
    };

    const rankGroups = groups => {
        if (groups) {
            // Sort groups in descending order
            groups.sort((group1, group2) => {
                if (group1.totalWalkStep === group2.totalWalkStep) {
                    if (group2.priority === group1.priority) {
                        return group1.name.localeCompare(group2.name);
                    }
                    return group2.priority - group1.priority;
                }
                return group2.totalWalkStep - group1.totalWalkStep;
            });
            // Add progress data for groups
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].totalWalkStep === 0) {
                    groups[i].progress = 0;
                } else if (i === 0) {
                    groups[i].progress = 100;
                } else {
                    groups[i].progress = Math.ceil(
                        (groups[i].totalWalkStep / groups[0].totalWalkStep) * 100
                    );
                }
            }
            setRankingGroup(Array.from(groups));
        } else {
            setRankingGroup([]);
        }
    };

    const toggleSwitch = _ => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_event_toggle',
            info1: `click_event_toggle_${data?.eventId}`,
            info2: isFriend,
        });
        MomoAsyncHelper.setItem(`${TOGGLE_KEY}${data?.eventId}`, isFriend ? '' : 'true');
        setIsFriend(!isFriend);
    };

    const onPressShare = () => {
        if (data?.shareUrl) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_event_share',
                info1: `click_event_share_${data?.eventId}`,
            });
            WalkingHelper.shareUrl(data?.shareUrl, () => {
                MaxApi.trackEvent(WALKING_EVENT_NAME, {
                    action: 'click_event_share_joined',
                    info1: `click_event_share_joined_${data?.eventId}`,
                });
            });
        }
    };

    const onClosePopupRequirePermission = () => {
        AppState.removeEventListener('change', handleAppStateChange);
    };

    const handleWalkingGranted = () => {
        WalkingHelper.saveTimeUserGranted();
        if (isGroupEvent) {
            confirmJoinGroup();
        } else {
            requestJoinEvent();
        }
        onClosePopupRequirePermission();
        DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
    };

    const handleAppStateChange = nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            WalkingHelper.getSteps(true).then(steps => {
                if (steps) {
                    handleWalkingGranted();
                }
            });
        }
        appState = nextAppState;
    };

    const resetGroupChoice = () => {
        setSelectedGroup(null);
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
                    title: Strings.join,
                    onPress: () => {
                        MaxApi.trackEvent(WALKING_EVENT_NAME, {
                            action: 'click_main_event_group_join',
                            info1: `click_main_event_group_join_step3_${data?.eventId}`,
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

    const onPressJoin = () => {
        if (walkingGranted && ((isGroupEvent && selectedGroup) || !isGroupEvent)) {
            if (isGroupEvent) {
                confirmJoinGroup();
            } else {
                requestJoinEvent();
            }
        } else if (isGroupEvent && !selectedGroup) {
            MaxApi.showToast({
                description: Strings.chooseTeam,
                duration: 1500,
            });
            refScrollView.current?.scrollTo({
                x: groupSelectionPos.x,
                y: groupSelectionPos.y,
                animated: true,
            });
        } else if (!walkingGranted) {
            AppState.addEventListener('change', handleAppStateChange);
            const popupData = {
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
                                            MaxApi.showAlert(Strings.walkingPermissionError);
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

    const requestJoinEvent = () => {
        if (callingJoin) {
            return;
        }
        callingJoin = true;
        if (data?.eventId) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_details_event_join',
                info1: `click_details_event_join_${data.eventId}`,
            });
            const payload = isGroupEvent
                ? {
                      eventId: data?.eventId,
                      groupId: selectedGroup?.id,
                  }
                : { eventId: data?.eventId };
            WalkingHelper.postJoinEvent(payload, ({ result, momoMsg }) => {
                callingJoin = false;
                let popupData;
                if (result && momoMsg) {
                    getData(data?.eventId);
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
                                defaultParam: JSON.stringify({ eventId: data?.eventId }),
                                onClose: props.params.onClose,
                                popupData,
                                homeCallback: props.params.homeCallback,
                                depth: props.params.depth,
                                isDonation: isDonation,
                                donationUrl: donationUrl,
                                ctaDonation: ctaDonation,
                                donationDes: donationDes,
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

    const requestContactPermission = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_grant_contact_confirm',
        });

        MaxApi.requestPermission('contacts', status => {
            if (status === 'granted') {
                DeviceEventEmitter.emit(CONTACT_GRANTED_PERMISSION_EVENT);
                setContactGranted(true);
            }
        });
    };

    const onPressItem = (item, isCurrentUser) => {
        if (!isCurrentUser) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_event_profile_others',
            });
        }
    };

    const onPressDonate = () => {
        MaxApi.openWeb({
            title: Strings.donate,
            url: donationUrl,
        });
    };

    const renderItem = ({ item, index }) => {
        return (
            <WalkingRankingItem
                data={item}
                rank={item?.rank || index + 1}
                containerStyle={{ backgroundColor: '#ffffff', paddingHorizontal: 12 }}
                onPressItem={onPressItem}
                screenName="WalkingEventDetail"
            />
        );
    };

    const renderRankingGroupItem = ({ item, index }) => {
        return (
            <WalkingGroupRankingItem
                data={{ eventId: data.eventId, group: item }}
                containerStyle={{ backgrounColor: '#ffffff', paddingHorizontal: 12 }}
                rank={index + 1}
                hideDivider={index >= rankingGroup.length - 1}
                onPressItem={() => {
                    MaxApi.trackEvent(WALKING_EVENT_NAME, {
                        action: 'click_event_detail_team_detail',
                        info1: `click_event_detail_team_detail_${item.id}`,
                    });
                }}
            />
        );
    };

    const renderGroupItem = ({ item, index }) => {
        return (
            <WalkingGroupItem
                data={{ eventId: data.eventId, group: item }}
                containerStyle={{ backgroundColor: '#ffffff', paddingHorizontal: 12 }}
                onPressItem={() => {
                    setSelectedGroup(item);
                }}
                onPressItemDetail={() => {
                    MaxApi.trackEvent(WALKING_EVENT_NAME, {
                        action: 'click_event_detail_pre_join_team_detail',
                        info1: `click_event_detail_pre_join_team_detail_${item.id}`,
                    });
                    resetGroupChoice();
                }}
                onPressDetailCallback={() => {
                    getData(data?.eventId);
                }}
                homeCallback={props.params.homeCallback}
                depth={props.params.depth}
                isSelected={selectedGroup?.id === item.id}
                screenName="WalkingEventDetail"
            />
        );
    };

    const renderEmpty = () => {
        if (!data?.userJoined) {
            return null;
        }
        let showGrantContactButton = false;

        let iconSource = images.ic_walking_sync;
        let desc = Strings.syncAfterEvent;
        if (data?.status === EVENT_STATUS.NOT_START) {
            desc = Strings.syncAfterEvent;
            iconSource = images.ic_walking_sync;
        } else {
            if (isFriend) {
                if (!contactGranted) {
                    desc = Strings.syncFriend;
                    iconSource = images.ic_contact;
                    showGrantContactButton = true;
                } else {
                    desc = Strings.friendNoData;
                    iconSource = images.ic_walking_gray;
                }
            } else {
                desc = Strings.noDataEvent;
                iconSource = images.ic_walking_gray;
            }
        }

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                    backgroundColor: '#ffffff',
                }}
            >
                <Image style={{ width: 120, height: 120 }} source={iconSource} />
                <Text.Title style={styles.textCenter}>{desc}</Text.Title>
                {showGrantContactButton && (
                    <WalkingButton
                        style={{ margin: 15 }}
                        title={Strings.sync}
                        onPress={() => requestContactPermission()}
                    />
                )}
            </View>
        );
    };

    const renderHeader = () => {
        if (!data) {
            return (
                <View style={styles.emptyContainer}>
                    <Image style={styles.emptyImage} source={images.ic_walking_gray} />
                    <Text.Title style={styles.textEmpty}>{Strings.noEventInfo}</Text.Title>
                </View>
            );
        }

        let groupOptions = data.groups
            ? Array.from(data.groups.sort((a, b) => a.name.localeCompare(b.name)))
            : [];
        if (groupOptions.length > 10) {
            groupOptions = groupOptions.splice(0, 10);
        }

        return (
            <View>
                <WalkingEventInfo
                    data={data}
                    showCoundown={!data?.userJoined && !isGroupEvent}
                    showContentDetail={!data?.userJoined}
                    showCtaDetail={true}
                    setContentPos={_setContentPos}
                    scrollToContent={() => {
                        refScrollView.current.scrollTo({
                            x: contentPos.x,
                            y: contentPos.y,
                            animated: true,
                        });
                    }}
                    showTargetDivider={data?.userJoined}
                    showTarget={data?.userJoined && !isGroupEvent}
                    showEventInfo={true}
                    showJoinedUsers={true}
                    joinedUsers={joinedUsers}
                    highligtCountdownText={`${Strings.joinNow} `}
                    countdownText={
                        data?.status === EVENT_STATUS.ON ? Strings.endSoon : Strings.startSoon
                    }
                />

                {isGroupEvent && !data?.userJoined && data?.status !== EVENT_STATUS.OFF && (
                    <View
                        style={{ backgroundColor: '#ffffff', paddingBottom: 12 }}
                        onLayout={_setGroupSelectionPos.bind(this)}
                    >
                        <View style={styles.targetDivider} />
                        <View style={styles.orgHeader}>
                            <View style={[styles.row, { marginBottom: 6 }]}>
                                <Text.H4 style={styles.textHeader}>
                                    {Strings.chooseYourTeam}
                                </Text.H4>
                            </View>
                            <View style={styles.row}>
                                <Text.Title style={styles.textSubHeader}>
                                    {Strings.chooseTeamToJoin}
                                </Text.Title>
                            </View>
                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={groupOptions}
                            keyExtractor={(item, index) => 'item_' + index}
                            renderItem={renderGroupItem}
                            extraData={selectedGroup}
                            ListEmptyComponent={renderEmpty}
                            style={{ marginBottom: 15 }}
                        />
                        {data?.groups && data.groups.length > 10 && (
                            <WalkingButton
                                type="text"
                                title={Strings.seeAll}
                                textStyle={{ color: '#1890ff' }}
                                onPress={() => {
                                    resetGroupChoice();
                                    NavigatorAction?.push({
                                        screen: WalkingGroup,
                                        params: {
                                            defaultParam: JSON.stringify(data),
                                            onClose: () => getData(data.eventId),
                                            depth: props.params.depth + 1,
                                            homeCallback: props.params.homeCallback,
                                        },
                                        options: {
                                            headerShown: false,
                                        },
                                    });
                                }}
                            />
                        )}
                    </View>
                )}

                {data?.userJoined && isDonation === 1 && donationDes && ctaDonation && (
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View style={styles.donationContainer}>
                            <Text>{donationDes}</Text>
                            <TouchableOpacity onPress={debounce(onPressDonate, 500)}>
                                <Text style={styles.buttonDonate}>{ctaDonation}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.targetDivider} />
                    </View>
                )}

                {isGroupEvent && data?.userJoined && (
                    <View style={{ backgroundColor: '#ffffff' }}>
                        <View style={styles.rankingHeader}>
                            <View style={[styles.row, { bottom: 10 }]}>
                                <Text.H4 style={styles.textHeader}>{Strings.groupRanking}</Text.H4>
                            </View>
                        </View>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={rankingGroup}
                            keyExtractor={(item, index) => 'item_' + index}
                            renderItem={renderRankingGroupItem}
                            ListEmptyComponent={() => <ActivityIndicator />}
                            style={{ marginBottom: 15 }}
                        />
                        <View style={styles.targetDivider} />
                    </View>
                )}

                {data?.userJoined && (
                    <View style={styles.rankingHeader}>
                        <View style={styles.row}>
                            <Text.H4 style={styles.textHeader}>{Strings.individualRanking}</Text.H4>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text.Title style={styles.text}>{Strings.friends}</Text.Title>
                                <Switch
                                    activeStyle={{
                                        backgrounColor: isFriend ? '#78ca32' : '#F8F9FA',
                                    }}
                                    onChange={toggleSwitch}
                                    value={isFriend}
                                />
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderFooter = () => {
        return <View style={{ marginBottom: 100 }} />;
    };

    let listData =
        data?.userJoined && data?.status !== EVENT_STATUS.NOT_START
            ? isFriend
                ? contactGranted
                    ? rankingContact
                    : []
                : rankingMomo
            : [];

    const userInfo = isFriend ? userDataFriend : userDataMomo;

    return (
        <Flex
            style={{
                flex: 1,
                backgrounColor: '#f3f3f3',
                paddingBottom: isIphoneX() ? -40 : 0,
            }}
        >
            <Header
                backgroundColor={'#ffff'}
                onPressLeft={() => {
                    if (props.params.popupData) {
                        NavigatorAction?.popN(props.params.depth);
                        if (props.params.homeCallback) {
                            props.params.homeCallback();
                        }
                    } else {
                        NavigatorAction?.pop();
                        if (props.params.onClose) {
                            props.params.onClose();
                        }
                    }
                }}
                title={Strings.eventDetail}
                icRight={images.ic_share}
                onPressRight={onPressShare}
            />
            <ScrollView ref={refScrollView}>
                {renderHeader()}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsRef}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    data={listData}
                    keyExtractor={(item, index) => 'item_' + index}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                />
            </ScrollView>
            {data && !data?.userJoined && data?.status !== EVENT_STATUS.OFF && (
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
            {userInfo && (!isFriend || (isFriend && contactGranted)) && (
                <UserInfoBottomAnimated
                    ref={refUserInfoBottom}
                    data={userInfo}
                    screenName="WalkingEventDetail"
                />
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
    textHeader: {
        color: '#18191a',
        fontWeight: 'bold',
        flex: 1,
    },
    textSubHeader: {
        color: '#727272',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#303233',
        paddingHorizontal: 18,
    },
    textCenter: {
        color: '#303233',
        textAlign: 'center',
        padding: 16,
    },
    rankingHeader: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: 6,
    },
    orgHeader: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 14,
        marginTop: 10,
        flexDirection: 'column',
    },
    targetDivider: {
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
        marginBottom: 6,
        marginTop: 6,
    },
    donationContainer: {
        backgroundColor: Colors.indigo_10,
        marginHorizontal: 16,
        marginVertical: 6,
        height: 100,
        justifyContent: 'space-between',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    buttonDonate: {
        fontWeight: 'bold',
        color: Colors.blue_04,
    },
});

export default deepMemo(WalkingEventDetail);
