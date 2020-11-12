import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Text } from 'react-native';
import { Flex, ScrollableTabView, Image, ScaleSize } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import {
    Header,
    WalkingRankingItem,
    UserInfoBottomAnimated,
    ShimmerRankingItem,
} from '../components';
import { isIphoneX } from '../utils/DeviceUtils';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import { NavigatorAction } from '../screens/Walking';
import { WALKING_EVENT_NAME } from '../utils/Const';
import { BLACK_COLOR, GREEN_COLOR } from '../utils/Colors';
import Strings from '../utils/Strings';
import { deepMemo } from 'use-hook-kits';
import { isAndroid } from '../utils/DeviceUtils';
const { width, height } = Dimensions.get('window');

const WalkingRanking = ({ params }) => {
    const listOfMonth = params?.dataRankingMonth?.items || [];
    const listOfToday = params?.dataRankingToday?.items || [];
    const userInfoMonth = params?.dataRankingMonth?.meta || {};
    const userInfoToday = params?.dataRankingToday?.meta || {};
    const { currentTab } = params || 0;
    const MONTH = 'MONTH';
    const TODAY = 'TODAY';

    const refUserInfoBottomOfMonth = useRef();
    const refUserInfoBottomOfToday = useRef();

    useEffect(() => {
        //track00
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            stage: 'scr_leaderboard_show',
        });
    }, []);

    const onViewableItemsRefMonth = useRef(listData => {
        if (Array.isArray(listData?.viewableItems) && listData?.viewableItems.length > 0) {
            let userInfoVisible = true;
            listData?.viewableItems?.map?.(viewable => {
                if (viewable?.item?.userId === userInfoMonth?.userId) {
                    userInfoVisible = false;
                }
            });
            if (userInfoVisible) {
                refUserInfoBottomOfMonth.current?.show?.();
            } else {
                refUserInfoBottomOfMonth.current?.hide?.();
            }
        }
    }).current;

    const onViewableItemsRefToday = useRef(listData => {
        if (Array.isArray(listData?.viewableItems) && listData?.viewableItems.length > 0) {
            let userInfoVisible = true;
            listData?.viewableItems?.map?.(viewable => {
                if (viewable?.item?.userId === userInfoToday?.userId) {
                    userInfoVisible = false;
                }
            });
            if (userInfoVisible) {
                refUserInfoBottomOfToday.current?.show?.();
            } else {
                refUserInfoBottomOfToday.current?.hide?.();
            }
        }
    }).current;

    const onPressShare = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_main_leaderboard_share',
        });
        WalkingHelper.shareScreenShot();
    };

    const onPressItem = (data, isCurrentUser) => {
        if (!isCurrentUser) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_leaderboard_profile_others',
            });
        }
    };

    const renderItem = ({ item, index }) => {
        return (
            <WalkingRankingItem
                data={item}
                rank={index + 1}
                onPressItem={onPressItem}
                screenName="WalkingRanking"
            />
        );
    };

    const renderEmpty = ({ item, index }) => {
        return <View />;
    };

    const renderFooter = () => {
        return <View style={{ height: isIphoneX() ? 84 : 64 }} />;
    };

    const renderRankingBoard = (type, listData) => {
        const isRankOfMonth = type === MONTH;
        const userInfo = isRankOfMonth ? userInfoMonth : userInfoToday;
        return (
            <View tabLabel={isRankOfMonth ? Strings.thisMonth : Strings.today}>
                {listData?.length > 0 ? (
                    <FlatList
                        data={listData}
                        keyExtractor={(item, index) => 'item_' + index}
                        onViewableItemsChanged={
                            isRankOfMonth ? onViewableItemsRefMonth : onViewableItemsRefToday
                        }
                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmpty}
                        ListFooterComponent={renderFooter}
                    />
                ) : (
                    <View style={styles.infoContainer}>
                        <Image
                            style={{ width: 120, height: 120 }}
                            source={images.ic_walking_gray}
                        />
                        <Text style={styles.textCenter}>
                            {isRankOfMonth ? Strings.noMonthData : Strings.noTodayData}
                        </Text>
                    </View>
                )}

                {userInfo && (
                    <UserInfoBottomAnimated
                        ref={isRankOfMonth ? refUserInfoBottomOfMonth : refUserInfoBottomOfToday}
                        data={userInfo}
                    />
                )}
            </View>
        );
    };

    return (
        <Flex backgroundColor={'#ffffff'} paddingBottom={isIphoneX() ? -40 : 0}>
            <Header
                title={Strings.goldenBoardTitle}
                onPressLeft={() => NavigatorAction?.pop()}
                icRight={images.ic_share}
                onPressRight={onPressShare}
            />
            <View style={{ height: height, paddingBottom: 70 }}>
                <ScrollableTabView
                    style={styles.scrollableTab}
                    initialPage={currentTab}
                    tabScrollable={false}
                    tabBarUnderlineStyle={styles.tabBarUnderline}
                    tabBarBackgroundColor="#ffffff"
                    tabBarActiveTextColor={BLACK_COLOR}
                    tabBarInactiveTextColor="#00000090"
                    tabBarTextStyle={styles.headerTabbar}
                >
                    {renderRankingBoard(TODAY, listOfToday)}
                    {renderRankingBoard(MONTH, listOfMonth)}
                </ScrollableTabView>
            </View>
        </Flex>
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
    imgWalking: { width: 120, height: 120 },
    wrapPermission: { alignItems: 'center', padding: 15 },
    headerTabbar: {
        width: width / 2,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: ScaleSize(15),
        fontWeight: 'bold',
    },
    scrollableTab: {
        flex: 1,
        height: isAndroid ? 65 * 6 : null,
    },
    tabBarUnderline: {
        backgroundColor: GREEN_COLOR,
        height: 2,
    },
});

export default deepMemo(WalkingRanking);
