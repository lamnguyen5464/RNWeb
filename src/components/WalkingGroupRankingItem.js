import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import images from '../assets/images';
import { NavigatorAction } from '../screens/Walking';
import NumberUtils from '../utils/NumberUtils';
import { WalkingGroupDetail } from '../screens';
import { DEVICE_WIDTH } from '../utils/Dimensions';

const progressWidth = (DEVICE_WIDTH * 65) / 100;

const WalkingGroupRankingItem = ({
    data,
    rank,
    containerStyle,
    hideDivider,
    rounded,
    onPressItem = null,
}) => {
    let { eventId, group } = data;
    let { name, userJoinedGroup, avatar, totalWalkStep, progress } = group || {};

    let iconShoe = images.ic_shoe_small_gray;

    const progressAnim = useRef(new Animated.Value(-progressWidth)).current;

    useEffect(() => {
        expandProgress(progress);

        // expandProgress(progress);
    }, []);

    const expandProgress = value => {
        Animated.timing(progressAnim, {
            toValue: -progressWidth + (progressWidth * value) / 100,
            useNativeDriver: true,
            duration: 2000,
        }).start();
    };

    const renderRank = () => {
        let currentRank = parseInt(rank || data?.rank || -1);

        let icon;
        if (currentRank === 1) {
            icon = images.ic_ranking_1st;
        } else if (currentRank === 2) {
            icon = images.ic_ranking_2nd;
        } else if (currentRank === 3) {
            icon = images.ic_ranking_3rd;
        }

        if (icon) {
            return <Image style={styles.iconRank} source={icon} />;
        }

        return (
            <View>
                <View style={styles.textRankContainer}>
                    <Text style={styles.textRank}>{currentRank > 0 ? currentRank : '--'}</Text>
                </View>
            </View>
        );
    };

    const onPressRanking = () => {
        if (onPressItem) {
            onPressItem();
        }

        NavigatorAction?.push({
            screen: WalkingGroupDetail,
            params: {
                defaultParam: JSON.stringify({ eventId, group }),
            },
            options: {
                headerShown: false,
            },
        });
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressRanking}
            style={containerStyle || { marginHorizontal: 12 }}
        >
            <View
                style={[
                    styles.container,
                    rounded
                        ? {
                              borderRadius: 8,
                              borderWidth: 0,
                          }
                        : null,
                ]}
            >
                {renderRank()}
                <ImageBackground
                    style={styles.avatarContainer}
                    source={images.default_group_avatar}
                >
                    {avatar && avatar.indexOf('http') !== -1 && (
                        <Image style={styles.avatarContainer} source={images.getImage(avatar)} />
                    )}
                </ImageBackground>
                <View style={{ flex: 1, flexDirection: 'column', height: 50, paddingBottom: 10 }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text.SubTitle
                            numberOfLines={1}
                            style={[
                                styles.textGroupName,
                                {
                                    justifyContent: 'flex-start',
                                },
                            ]}
                        >
                            {name.trim()}
                        </Text.SubTitle>
                        <View
                            style={{
                                justifyContent: 'flex-end',
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.textStep}>
                                {NumberUtils.formatNumberToMoney(Math.max(totalWalkStep, 0))}
                            </Text>
                            <Image
                                style={[styles.icGroupStep, { justifyContent: 'flex-end' }]}
                                source={iconShoe}
                            />
                        </View>
                    </View>
                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={{
                                width: progressWidth,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: userJoinedGroup ? '#a50064' : '#7BC83F',
                                transform: [{ translateX: progressAnim }],
                            }}
                        />
                    </View>
                </View>
                {!hideDivider && <View style={styles.divider} />}
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(WalkingGroupRankingItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 64,
        paddingRight: 12,
    },
    textRankContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: '#F2F4F7',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 7,
    },
    textRank: {
        color: '#8F8E94',
        fontSize: ScaleSize(11),
        fontWeight: 'bold',
    },
    textStep: {
        color: '#18191a',
        fontSize: ScaleSize(11),
        fontWeight: 'bold',
        marginLeft: 5,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    icStep: {
        width: 24,
        height: 24,
        marginRight: 12,
        marginLeft: 6,
    },

    icGroupStep: {
        width: 24,
        height: 24,
        marginLeft: 6,
    },

    textName: {
        fontSize: ScaleSize(14),
        color: '#303233',
        flex: 1,
    },

    textGroupName: {
        color: '#303233',
        flex: 1,
        fontWeight: 'bold',
    },

    divider: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 0.5,
        backgroundColor: '#bbbbbb',
        flexDirection: 'row',
        marginRight: 12,
        marginLeft: 34,
    },
    iconRank: {
        width: 24,
        height: 24,
        margin: 7,
    },
    textGreenBold: {
        color: '#52c41a',
        fontWeight: 'bold',
    },
    progressContainer: {
        height: 4,
        width: progressWidth,
        borderRadius: 2,
        marginTop: 4,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
});
