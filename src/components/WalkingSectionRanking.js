import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, DeviceEventEmitter, Dimensions } from 'react-native';
import { Image, Text, ScrollableTabView, ScaleSize } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import {
    WalkingContext,
    WalkingButton,
    ShimmerRankingItem,
    WalkingRankingItem,
} from '../components';
import { CONTACT_GRANTED_PERMISSION_EVENT } from '../utils/EventTypes';
import WalkingRanking from '../screens/WalkingRanking';
import { NavigatorAction } from '../screens/Walking';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import { BLACK_COLOR, GREEN_COLOR } from '../utils/Colors';
import Strings from '../utils/Strings';
import { WALKING_EVENT_NAME } from '../utils/Const';
import { isAndroid } from '../utils/DeviceUtils';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { deepMemo } from 'use-hook-kits';

const WalkingSectionRanking = () => {
    const [dataRankingMonth, setDataRankingMonth] = useState(null);
    const [dataRankingToday, setDataRankingToday] = useState(null);
    const { contactGranted } = useContext(WalkingContext);
    const currentTab = useRef(0);
    const MAX_USER_SHOW = 10;
    const MONTH = 'MONTH';
    const TODAY = 'TODAY';

    useEffect(() => {
        getData();
    }, []);

    const onPressItem = (item, isCurrentUser) => {
        if (!isCurrentUser) {
            // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
            //     action: 'click_main_profile_others',
            // });
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_main_profile_others',
            });
        }
    };

    const renderListItems = listData => {
        const filteredList = listData.slice(0, MAX_USER_SHOW) || [];
        var renderedList = []; //reset array
        filteredList?.map?.((item, index) => {
            renderedList.push(
                <WalkingRankingItem
                    key={'ranking_item_' + index}
                    data={item}
                    rank={index + 1}
                    onPressItem={onPressItem}
                    screenName="WalkingSectionRaking"
                />
            );
        });
        return renderedList;
    };

    const getData = () => {
        WalkingHelper.getWalkingRankingFriendMonth((status, response) => {
            if (status) {
                setDataRankingMonth(response || {});
            }
        });
        WalkingHelper.getWalkingRankingFriendToday((status, response) => {
            if (status) {
                setDataRankingToday(response || {});
            }
        });
    };

    const onPressAllRanking = () => {
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, { action: 'click_main_leaderboard' });
        MaxApi.trackEvent(WALKING_EVENT_NAME, { action: 'click_main_leaderboard' });
        NavigatorAction?.push({
            screen: WalkingRanking,
            options: {
                headerShown: false,
            },
            params: {
                currentTab: currentTab.current,
                dataRankingMonth: dataRankingMonth,
                dataRankingToday: dataRankingToday,
            },
        });
    };

    const renderLoading = () => {
        return (
            <View>
                <ShimmerRankingItem />
                <ShimmerRankingItem />
                <ShimmerRankingItem hideDivider={true} />
            </View>
        );
    };

    const requestContactPermission = () => {
        MaxApi.requestPermission('contacts', status => {
            if (status === 'granted') {
                DeviceEventEmitter.emit(CONTACT_GRANTED_PERMISSION_EVENT);
            }
        });
    };

    const renderRankingBoard = type => {
        const isRankingOfMonth = type === MONTH;
        const listData =
            (isRankingOfMonth ? dataRankingMonth?.items : dataRankingToday?.items) || [];
        const hadLoaded = (isRankingOfMonth ? dataRankingMonth : dataRankingToday) !== null;
        return (
            <View tabLabel={isRankingOfMonth ? Strings.thisMonth : Strings.today}>
                {!hadLoaded ? (
                    renderLoading()
                ) : (
                    <View>
                        {renderListItems(listData)}
                        {listData?.length > MAX_USER_SHOW && (
                            <WalkingButton
                                type="text"
                                title={Strings.seeAll}
                                textStyle={{ color: '#1890ff' }}
                                onPress={onPressAllRanking}
                            />
                        )}
                        {listData?.length === 0 && (
                            <View style={styles.infoContainer}>
                                <Image
                                    style={{ width: 120, height: 120 }}
                                    source={images.ic_walking_gray}
                                />
                                <Text style={styles.textCenter}>
                                    {isRankingOfMonth ? Strings.noMonthData : Strings.noTodayData}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>{Strings.goldenBoardTitle}</Text>
            {contactGranted ? (
                //add ScrollableTabView here
                <ScrollableTabView
                    style={{
                        marginTop: 7,
                        height: isAndroid
                            ? (Math.min(
                                  MAX_USER_SHOW,
                                  Math.max(
                                      dataRankingToday?.items?.length || 0,
                                      dataRankingMonth?.items?.length || 0
                                  )
                              ) +
                                  2.5) *
                              80
                            : null,
                    }}
                    initialPage={1}
                    tabScrollable={false}
                    tabBarUnderlineStyle={styles.tabBarUnderline}
                    tabBarBackgroundColor="#ffffff"
                    tabBarActiveTextColor={BLACK_COLOR}
                    tabBarInactiveTextColor="#00000090"
                    tabBarTextStyle={styles.headerTabbar}
                    onChangeTab={pos => {
                        currentTab.current = pos.i;
                    }}
                >
                    {renderRankingBoard(TODAY)}
                    {renderRankingBoard(MONTH)}
                </ScrollableTabView>
            ) : (
                <View style={styles.wrapPermission}>
                    <Image source={images.ic_contact} style={styles.imgWalking} />
                    <Text style={[styles.txtPermissionDesc, { fontWeight: 'normal' }]}>
                        {Strings.contactPermission}
                    </Text>
                    <WalkingButton
                        onPress={requestContactPermission}
                        title={Strings.sync}
                        type="full"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
        backgroundColor: '#ffffff',
    },
    textHeader: {
        color: '#18191a',
        fontWeight: 'bold',
        fontSize: ScaleSize(20),
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#ffffff',
    },
    txtPermissionDesc: {
        fontSize: ScaleSize(16),
        color: BLACK_COLOR,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 24,
        marginVertical: 16,
    },
    imgWalking: { width: 120, height: 120 },
    wrapPermission: { alignItems: 'center', padding: 15 },
    headerTabbar: {
        width: DEVICE_WIDTH / 2,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: ScaleSize(15),
        fontWeight: 'bold',
    },
    tabBarUnderline: {
        backgroundColor: GREEN_COLOR,
        height: 2,
    },
});

export default deepMemo(WalkingSectionRanking);
