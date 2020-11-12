import React from 'react';
import {
    View,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import {
    BLACK_COLOR,
    ATHENS_GRAY_COLOR,
    GREEN_COLOR,
    TEXT_COLOR_2,
    TEXT_BLACK_COLOR,
    DODGER_BLUE_COLOR,
} from '../utils/Colors';
import WalkingButton from '../components/WalkingButton';
import WalkingBadges from '../screens/WalkingBadges';
import images from '../assets/images';
import { NavigatorAction } from '../screens/Walking';
import WalkingHelper from '../api/WalkingHelper';
import NumberUtils from '../utils/NumberUtils';
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../utils/Dimensions';
import BaseComponent from './BaseComponent';
import { AppConfig } from '../App';
import { WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';
import { formatPhone } from '../utils';

const POPUP_WIDTH = DEVICE_WIDTH - 24 * 2;
const ITEM_WIDTH = (POPUP_WIDTH - 16 * 2) / 3 - 8;
const BADGES_ITEM_WIDTH = (POPUP_WIDTH - 16 * 2) / 5 - 4 * 2;

export default class WalkingUserInfoPopup extends BaseComponent {
    constructor(props) {
        super(props);

        this.state = {
            statisticalWalking: [],
            listBadges: [],
        };

        this.currentUserId = formatPhone(AppConfig.USER_PROFILE.userId, 11);
    }

    async componentDidMount() {
        super.componentDidMount();
        try {
            let userId = this.props.userId;
            if (!userId) {
                userId = this.currentUserId;
            }
            const isCurrentUser = userId === this.currentUserId;
            let stage = this.getStageName(isCurrentUser);
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                stage,
            });

            const statisticalWalking = await this.getStatisticalWalking(userId);
            const listBadges = await this.getBadges(userId);
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({
                statisticalWalking,
                listBadges,
            });
        } catch (error) {
            console.log('err', error);
        }
    }

    close = callback => {
        this.props.requestClose();
        if (callback) {
            callback();
        }
    };

    getStageName = isCurrentUser => {
        let stage = 'pu_user_profile_show';
        const { screenName } = this.props || {};
        if (!isCurrentUser) {
            stage = 'pu_main_user_profile_show';
            if (screenName === 'WalkingRanking') {
                stage = 'pu_leaderboard_user_profile_show';
            }
            if (screenName === 'WalkingEventDetail') {
                stage = 'pu_event_user_profile_show';
            }
        }
        return stage;
    };

    getStatisticalWalking = userId => {
        return new Promise(resolve => {
            WalkingHelper.getStatisticalWalking(userId, ({ result, momoMsg }) => {
                if (!result) {
                    resolve([]);
                    return;
                }

                if (result && momoMsg?.statisticalWalking?.length > 0) {
                    resolve(momoMsg.statisticalWalking);
                }
            });
        });
    };

    getBadges = userId => {
        return new Promise(resolve => {
            WalkingHelper.getAllBadges(userId, ({ result, momoMsg }) => {
                if (!result) {
                    resolve([]);
                    return;
                }
                if (result && momoMsg?.listBadges?.length > 0) {
                    const arr = [];
                    for (let item of momoMsg.listBadges) {
                        for (let badge of item.badges) {
                            if (badge.unlocked) {
                                arr.push(badge);
                            }
                        }
                    }
                    resolve(arr);
                }
            });
        });
    };

    onPressClose = data => {
        this.props.onPressClose && this.props.onPressClose(data);
        this.close();
    };

    onPress = data => {
        this.props.onPress && this.props.onPress(data);
        this.close();
    };

    onShare = () => {
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
        //     action: !this.props.userId
        //         ? 'click_user_profile_popup_share'
        //         : 'click_main_user_profile_popup_share',
        // });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: !this.props.userId
                ? 'click_user_profile_popup_share'
                : 'click_main_user_profile_popup_share',
        });
        WalkingHelper.shareScreenShot();
    };

    onPressViewAll = () => {
        NavigatorAction?.push({
            screen: WalkingBadges,
            options: {
                headerShown: false,
            },
        });
    };

    getStatisticalName = type => {
        switch (type) {
            case 0:
                return Strings.dayRecord;
            case 1:
                return Strings.weekRecord;
            case 2:
                return Strings.monthRecord;
            default:
                return '';
        }
    };

    renderStatisticalWalking = (item, index) => {
        return (
            <View key={index} style={styles.wrapItemStatistical}>
                <Text style={styles.txtStatisticalName}>
                    {this.getStatisticalName(item.statisticalType)}
                </Text>
                <Text style={item.walkStep > 0 ? styles.txtStep : styles.txtStepGray}>
                    {NumberUtils.formatNumberToMoney(item.walkStep, '0', '')}
                </Text>
                <Text style={styles.txtTime}>{item.walkStep > 0 ? item.time : '--/--/--'}</Text>
            </View>
        );
    };

    onPressBadge = item => () => {
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
        //     action: !this.props.userId ? 'click_profile_badge' : 'click_main_profile_badge',
        //     info1: `click_profile_badge_${item.name}`,
        // });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: !this.props.userId ? 'click_profile_badge' : 'click_main_profile_badge',
            info1: `click_profile_badge_${item.name}`,
        });
        WalkingHelper.showBadgePopup(item);
    };

    renderBadge = (item, index) => {
        return (
            <TouchableOpacity key={index} activeOpacity={0.7} onPress={this.onPressBadge(item)}>
                <Image source={images.getImage(item.icon)} style={styles.imgBadge} />
            </TouchableOpacity>
        );
    };

    renderShareButton = () => {
        if (this.props.userId && this.props.userId !== this.currentUserId) {
            return null;
        }
        let hasData = false;
        this.state.statisticalWalking?.map?.(item => {
            if (item?.walkStep > 0) {
                hasData = true;
            }
        });
        if (hasData) {
            return (
                <WalkingButton
                    onPress={this.onShare}
                    style={styles.btnShare}
                    title={Strings.shareNow}
                />
            );
        }
        return null;
    };

    render() {
        const { avatar, name } = this.props || {};
        const { statisticalWalking = [], listBadges = [] } = this.state;
        const currentUserId = this.currentUserId;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.onPressClose}
                    style={styles.btnClose}
                >
                    <Image source={images.ic_close} style={styles.iconClose} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        MaxApi.startFeatureCode('profile_info', {
                            userId: this.props.userId || this.currentUserId,
                            source: 'walking',
                        });
                    }}
                    style={styles.wrapAvatar}
                >
                    <ImageBackground style={styles.avatar} source={images.avatar}>
                        <Image
                            source={avatar ? images.getImage(avatar) : images.avatar}
                            style={styles.avatar}
                        />
                        <View style={[styles.borderAvatar, styles.avatar]} />
                    </ImageBackground>
                </TouchableOpacity>
                <Text.H4 style={styles.txtName}>{name}</Text.H4>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: DEVICE_HEIGHT * 0.4 }}
                >
                    {statisticalWalking.length > 0 ? (
                        <>
                            <View style={styles.wrapStatistical}>
                                {statisticalWalking.map(this.renderStatisticalWalking)}
                            </View>
                            {listBadges.length > 0 && (
                                <>
                                    <View style={styles.wrapContent}>
                                        <View>
                                            <Text.Title style={styles.txtCollection}>
                                                {Strings.collection}
                                            </Text.Title>
                                            <Text style={styles.txtDescription}>
                                                {`${Strings.collected} ${listBadges.length} ${
                                                    Strings.badge
                                                }`}
                                            </Text>
                                        </View>
                                        {this.props.userId === currentUserId && (
                                            <TouchableOpacity
                                                hitSlop={{
                                                    top: 10,
                                                    left: 10,
                                                    right: 10,
                                                    bottom: 10,
                                                }}
                                                activeOpacity={0.7}
                                                onPress={this.onPressViewAll}
                                            >
                                                <Text style={styles.txtViewAll}>
                                                    {Strings.seeAll}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={styles.wrapBadges}>
                                        {listBadges.slice(0, 30).map(this.renderBadge)}
                                    </View>
                                </>
                            )}
                        </>
                    ) : (
                        <ActivityIndicator style={styles.loading} />
                    )}
                </ScrollView>
                {this.renderShareButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: POPUP_WIDTH,
        borderRadius: 8,
        padding: 16,
    },
    btnClose: {
        position: 'absolute',
        right: -12,
        top: -12,
        borderWidth: 3,
        borderColor: '#fff',
        width: 26,
        height: 26,
        borderRadius: 26 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconClose: { width: 24, height: 24 },
    wrapAvatar: {
        position: 'absolute',
        top: -72 / 2,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 72 / 2,
    },
    borderAvatar: {
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
    },
    txtName: {
        fontWeight: 'bold',
        color: BLACK_COLOR,
        alignSelf: 'center',
        marginTop: 29,
    },
    wrapStatistical: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    btnShare: { marginTop: 16 },
    wrapItemStatistical: {
        backgroundColor: ATHENS_GRAY_COLOR,
        paddingVertical: 4,
        width: ITEM_WIDTH,
        alignItems: 'center',
        borderRadius: 8,
    },
    txtStatisticalName: { fontSize: ScaleSize(11), color: TEXT_BLACK_COLOR },
    txtStep: { color: GREEN_COLOR, fontWeight: '600', lineHeight: 22 },
    txtStepGray: { color: TEXT_COLOR_2, fontWeight: '600', lineHeight: 22 },
    txtTime: { color: TEXT_COLOR_2, fontSize: ScaleSize(11) },
    loading: { marginTop: 16, height: 50 },
    wrapBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 0,
    },
    imgBadge: { width: BADGES_ITEM_WIDTH, height: BADGES_ITEM_WIDTH, margin: 4 },
    wrapContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 6,
    },
    txtCollection: {
        color: BLACK_COLOR,
        fontWeight: 'bold',
    },
    txtDescription: { color: TEXT_COLOR_2, fontSize: ScaleSize(11) },
    txtViewAll: { color: DODGER_BLUE_COLOR, fontSize: ScaleSize(11) },
});
