/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Flex, Text } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import { Header, BadgeItem, WalkingError } from '../components';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import { WALKING_SERVICE_UNIVERSAL_LINK, WALKING_EVENT_NAME } from '../utils/Const';
import { AppConfig } from '../App';
import { deepMemo } from 'use-hook-kits';
import { PhoneUtil } from '@momo-platform/utils';
import Strings from '../utils/Strings';

const SCREEN_WIDTH = Dimensions.get('window').width;
const LOADING_STATUS = 0;
const ACTIVE_STATUS = 1;
const ERROR_STATUS = 2;

const WalkingBadges = props => {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(LOADING_STATUS);

    const _onGoBack = () => {
        props.navigator.pop();
    };

    useEffect(() => {
        const profile = AppConfig.USER_PROFILE;
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
        //     stage: 'scr_badge_show',
        // });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            stage: 'scr_badge_show',
        });
        WalkingHelper.getAllBadges(
            PhoneUtil.convertPhoneNumerWithMode({ phone: profile.userId }),
            ({ result, momoMsg }) => {
                if (result && momoMsg?.listBadges) {
                    const listBadgesEvent = [];
                    let badgeEventIndex;
                    for (let index in momoMsg.listBadges) {
                        const item = momoMsg.listBadges[index];
                        if (item?.groupName === 'Sự kiện' && !item.showTotal) {
                            badgeEventIndex = index;
                            for (let badge of item?.badges) {
                                if (badge.unlocked) {
                                    listBadgesEvent.push(badge);
                                }
                            }
                        }
                    }
                    const res = momoMsg?.listBadges;
                    if (typeof badgeEventIndex !== 'undefined') {
                        res[badgeEventIndex] = {
                            ...momoMsg?.listBadges[badgeEventIndex],
                            badges: listBadgesEvent,
                        };
                        if (!listBadgesEvent.length) {
                            res.splice(badgeEventIndex, 1);
                        }
                    }
                    setData(res || []);
                } else {
                    setStatus(ERROR_STATUS);
                }
            }
        );
    }, []);

    useEffect(() => {
        if (data) {
            setStatus(ACTIVE_STATUS);
        }
    }, [data]);

    const onPressShare = () => {
        WalkingHelper.shareScreenShot(WALKING_SERVICE_UNIVERSAL_LINK);
    };

    const onPressItem = item => {
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
        //     action: 'click_scr_collection_badge',
        //     info1: `click_scr_collection_badge_${item?.name}`,
        // });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_scr_collection_badge',
            info1: `click_scr_collection_badge_${item?.name}`,
        });
    };

    const renderBadges = ({ item, index }) => {
        return <BadgeItem data={item} itemSize={SCREEN_WIDTH / 3} onPress={onPressItem} />;
    };

    const renderItem = ({ item, index }) => {
        let countUnlocked = 0;
        item?.badges?.map?.(badge => {
            if (badge?.unlocked) {
                countUnlocked++;
            }
        });

        return (
            <View style={styles.itemContainer}>
                <View style={styles.row}>
                    <Text.H4 style={styles.textHeader}>{item?.groupName}</Text.H4>
                    <Text.Title style={styles.textHeaderSmall}>
                        {countUnlocked}
                        {item?.showTotal ? `/${item?.badges?.length}` : ''}{' '}
                        {Strings.badge?.charAt(0)?.toUpperCase() + Strings.badge?.slice(1)}
                    </Text.Title>
                </View>
                <FlatList
                    data={item?.badges || []}
                    renderItem={renderBadges}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    keyExtractor={(item, i) => `group_${index}_badges_${i}`}
                />
                {data?.length > index + 1 && <View style={styles.divider} />}
            </View>
        );
    };

    const renderContent = () => {
        switch (status) {
            case ACTIVE_STATUS:
                return (
                    <FlatList
                        data={data || []}
                        keyExtractor={(item, index) => `badges_${index}`}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                    />
                );
            case ERROR_STATUS:
                return (
                    <View
                        style={{ marginTop: '50%', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <WalkingError />
                    </View>
                );
            default:
                return (
                    <View
                        style={{ marginTop: '50%', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <ActivityIndicator />
                    </View>
                );
        }
    };

    return (
        <Flex style={{ flex: 1 }}>
            <Header
                backgroundColor={'#fff'}
                title={Strings.badge?.charAt(0)?.toUpperCase() + Strings.badge?.slice(1)}
                onPressLeft={_onGoBack}
                icRight={status === ACTIVE_STATUS ? images.ic_share : null}
                onPressRight={status === ACTIVE_STATUS ? onPressShare : null}
            />
            {renderContent()}
        </Flex>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    textHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: '#18191a',
    },
    textHeaderSmall: {
        fontWeight: 'bold',
        color: '#18191a',
    },
    divider: {
        width: SCREEN_WIDTH,
        height: 8,
        backgroundColor: '#f3f3f3',
    },
});

export default deepMemo(WalkingBadges);
