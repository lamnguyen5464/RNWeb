import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import { NavigatorAction } from '../screens/Walking';
import NumberUtils from '../utils/NumberUtils';
import { getAvatarUrlById, formatPhone } from '../utils';
import images from '../assets/images';
import WalkingUserInfoPopup from '../components/WalkingUserInfoPopup';
import { AppConfig } from '../App';

const WalkingRankingItem = ({
    data,
    highlightSelf,
    rank,
    containerStyle,
    hideDivider,
    rounded,
    onPressItem,
    screenName = 'WalkingSectionRaking',
}) => {
    let { userId, name, steps, teamName } = data || {};
    const avatarUrl = getAvatarUrlById(userId);
    const isCurrentUser = userId === AppConfig.USER_PROFILE.userId;
    if (isCurrentUser) {
        name = AppConfig.USER_PROFILE.name;
    }

    const isInWalkingEventDetail =
        screenName === 'WalkingEventDetail' && teamName !== undefined && teamName !== '';

    let iconShoe = isCurrentUser ? images.ic_shoe_small_green : images.ic_shoe_small_gray;

    const background = highlightSelf && isCurrentUser ? { backgroundColor: '#fef2e7' } : {};

    const renderRank = (highlight = false) => {
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
                <View
                    style={[
                        styles.textRankContainer,
                        highlight ? { backgroundColor: '#52c41a' } : {},
                    ]}
                >
                    <Text style={[styles.textRank, highlight ? { color: '#ffffff' } : {}]}>
                        {currentRank > 0 ? currentRank : '--'}
                    </Text>
                </View>
            </View>
        );
    };

    const onPressRaking = () => {
        onPressItem?.(data, isCurrentUser);
        NavigatorAction?.show({
            screen: WalkingUserInfoPopup,
            params: {
                userId: formatPhone(userId, 11),
                avatar: avatarUrl,
                name,
                screenName,
            },
        });
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressRaking}
            style={containerStyle || { marginHorizontal: 12 }}
        >
            <View
                style={[
                    styles.container,
                    background,
                    { height: isInWalkingEventDetail ? 75 : 65 },
                    rounded
                        ? {
                              borderRadius: 8,
                              borderWidth: 0,
                          }
                        : {},
                ]}
            >
                {renderRank(isCurrentUser)}
                <ImageBackground
                    style={[styles.avatarContainer, { marginRight: 12 }]}
                    source={images.avatar}
                >
                    <Image
                        style={styles.avatarContainer}
                        source={avatarUrl ? images.getImage(avatarUrl) : images.avatar}
                    />
                </ImageBackground>
                <View style={styles.containerLabel}>
                    <Text.Title
                        numberOfLines={1}
                        style={[styles.textName, isCurrentUser ? styles.textGreenBold : {}]}
                    >
                        {name || userId || ''}
                    </Text.Title>
                    {isInWalkingEventDetail && (
                        <View style={styles.labelTeamName}>
                            <Text numberOfLines={1}>{teamName}</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.textStep, isCurrentUser ? styles.textGreenBold : {}]}>
                    {NumberUtils.formatNumberToMoney(Math.max(steps, 0))}
                </Text>
                <Image style={styles.icStep} source={iconShoe} />
                {!hideDivider && <View style={styles.divider} />}
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(WalkingRankingItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 64,
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
    containerLabel: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    labelTeamName: {
        backgroundColor: '#eeeeee',
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 500,
        maxWidth: 100,
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
        borderRadius: 20,
        borderWidth: 0,
    },
    icStep: {
        width: 24,
        height: 24,
        marginRight: 12,
        marginLeft: 6,
    },
    textName: {
        color: '#303233',
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
});
