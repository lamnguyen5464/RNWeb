import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import { NavigatorAction } from '../screens/Walking';
import WalkingBadges from '../screens/WalkingBadges';
import { BadgeItem, ShimmerPlaceHolder, ShimmerBadgeItem } from '../components';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import { AppConfig } from '../App';
import { WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';
import { PhoneUtil } from '@momo-platform/utils';

// const ITEM_SIZE = DEVICE_WIDTH / 3.5;
// const ITEM_ICON_SIZE = ITEM_SIZE / 2;

const WalkingSectionBadges = () => {
    const [data, setData] = useState({});
    const [callingApi, setCallingApi] = useState(true);
    const listBadges = data?.listBadges || [];

    const { userId } = AppConfig.USER_PROFILE;

    useEffect(() => {
        WalkingHelper.getRecentBadges(
            PhoneUtil.convertPhoneNumerWithMode({ phone: userId }),
            ({ result, momoMsg }) => {
                if (result && momoMsg) {
                    setData(momoMsg);
                }
                setCallingApi(false);
            }
        );
    }, []);

    const onPressAll = () => {
        NavigatorAction?.push({
            screen: WalkingBadges,
            options: {
                headerShown: false,
            },
        });
    };

    const onPressItem = item => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_main_badge',
            info1: `click_main_badge_${item?.name}`,
        });
    };

    const renderItem = ({ item, index }) => {
        return <BadgeItem data={item} onPress={onPressItem} />;
    };

    const renderLoading = () => {
        return (
            <View style={styles.container}>
                <ShimmerPlaceHolder style={styles.shimmerTextHeader} autoRun={true} />
                <View style={styles.row}>
                    <ShimmerBadgeItem />
                    <ShimmerBadgeItem />
                    <ShimmerBadgeItem />
                    <ShimmerBadgeItem />
                </View>
            </View>
        );
    };

    const renderFooter = () => {
        if (!listBadges || listBadges?.length < 10) {
            return null;
        }
        return (
            <TouchableOpacity onPress={onPressAll} style={styles.footerContainer}>
                <Image style={styles.footerIcon} source={images.ic_view_more} />
                <Text style={styles.footerText}>{Strings.seeMore}</Text>
            </TouchableOpacity>
        );
    };

    if (callingApi) {
        return renderLoading();
    } else if (!listBadges?.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text.H3 style={styles.textHeader}>{Strings.recentBadges}</Text.H3>
                <TouchableOpacity onPress={onPressAll}>
                    <Text style={styles.textCta}>{Strings.seeAll}</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                horizontal={true}
                data={listBadges}
                renderItem={renderItem}
                ListFooterComponent={renderFooter}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => 'recentlyBadges_' + index}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
        backgroundColor: '#ffffff',
    },
    textHeader: {
        flex: 1,
        color: '#18191a',
        fontWeight: 'bold',
        paddingVertical: 8,
        backgroundColor: '#ffffff',
    },
    textCta: {
        fontSize: ScaleSize(15),
        color: '#188aeb',
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#ffffff',
    },
    footerContainer: {
        height: 100,
        marginLeft: 8,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerIcon: {
        width: 24,
        height: 24,
        margin: 4,
    },
    footerText: {
        fontSize: ScaleSize(11),
        color: '#1890ff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 12,
    },
    row: {
        flexDirection: 'row',
    },
    shimmerTextHeader: {
        width: DEVICE_WIDTH / 1.6,
        height: 24,
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 12,
        borderRadius: 4,
        borderWidth: 0,
    },
});

export default React.memo(WalkingSectionBadges);
