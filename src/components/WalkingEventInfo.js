import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Image, HTMLView, Text, ScaleSize } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import { decode } from 'base-64';
import { getAvatarUrlById } from '../utils';
import images from '../assets/images';
import { getStringNumber } from '../utils/StringUtils';
import { EVENT_STATUS, WALKING_EVENT_NAME } from '../utils/Const';
import { NavigatorAction } from '../screens/Walking';
import WalkingHtmlDetail from '../screens/WalkingHtmlDetail';
import DateUtils from '../utils/DateUtils';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { AppConfig } from '../App';
import { WalkingGroupRankingItem, WalkingButton, CountdownBox } from '.';
import Strings from '../utils/Strings';
import { deepMemo } from 'use-hook-kits';

const HEADER_BANNER_HEIGHT = DEVICE_WIDTH / 2;
const MIN_DAY = 7;
const progressWidth = (DEVICE_WIDTH * 85) / 100;

const WalkingEventInfo = ({
    data,
    showCoundown,
    showContentDetail,
    showEventInfo,
    showOnlyDate,
    rankingGroup,
    showCtaDetail,
    showJoinedUsers,
    joinedUsers,
    showTarget,
    showTargetDivider,
    countdownText,
    highligtCountdownText,
    onPressBanner,
    setContentPos = null,
    scrollToContent = null,
}) => {
    if (!showOnlyDate) {
        showOnlyDate = false;
    }

    const [topGroups, setTopGroups] = useState(null);
    const [seeMore, setSeeMore] = useState(false);

    let progressAnim = useRef(new Animated.Value(-progressWidth)).current;

    useEffect(() => {
        expandProgress(progress);
    }, []);

    const expandProgress = value => {
        Animated.timing(progressAnim, {
            toValue: -progressWidth + (progressWidth * value) / 100,
            duration: 1350,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (rankingGroup && rankingGroup.length > 0) {
            setTopGroups(rankingGroup);
        }
    }, [rankingGroup]);

    const getFormatDate = (timeStamp, type) => {
        let result = '--/--';
        let date = DateUtils.momentTimeZone(new Date(timeStamp));
        if (isNaN(date.valueOf())) {
            return result;
        }
        if (type === 'ddmmyyyy') {
            result = date.format('DD/MM/YYYY');
        } else {
            result = date.format('DD/MM');
        }
        return result;
    };

    const b64DecodeUnicode = str => {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(
            decode(str)
                .split('')
                .map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
    };

    const onPressDetail = () => {
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_event_info',
            info1: `click_event_info_${data?.eventId}`,
        });

        NavigatorAction?.push({
            screen: WalkingHtmlDetail,
            params: {
                contentJoined: b64DecodeUnicode(data?.contentJoined),
            },
            options: {
                headerShown: false,
            },
        });
    };

    const renderCountdown = () => {
        if (!showCoundown || !data?.timeLeft || !data?.timeLeft < 0) {
            return null;
        }

        return (
            <View style={styles.countdownContainer}>
                <Text.Title style={styles.textCountdown}>
                    <Text style={styles.textCountdownHighlight}>{highligtCountdownText || ''}</Text>
                    {countdownText}
                </Text.Title>
                <CountdownBox time={data?.timeLeft} />
            </View>
        );
    };

    const renderLabelTimeleft = () => {
        if (!data?.userJoined && data?.status === EVENT_STATUS.ON) {
            return null;
        }

        let timeleftColor;
        let labelTimeleft;
        switch (data?.status) {
            case EVENT_STATUS.ON:
                timeleftColor = '#fa8613';
                labelTimeleft = DateUtils.getTimeLeft(data?.timeLeft, MIN_DAY);
                break;
            case EVENT_STATUS.NOT_START:
                timeleftColor = '#fa8613';
                labelTimeleft = Strings.comingSoon;
                break;
            case EVENT_STATUS.OFF:
                timeleftColor = '#BEC4CF';
                labelTimeleft = Strings.eventEnded;
                break;
            default:
                break;
        }

        if (!labelTimeleft || labelTimeleft === '') {
            return null;
        }

        return (
            <View
                style={[
                    styles.bannerFilterContainer,
                    data?.status !== EVENT_STATUS.OFF ? { backgroundColor: 'transparent' } : {},
                ]}
            >
                <View style={[styles.textBannerTimeLeft, { backgroundColor: timeleftColor }]}>
                    <Text.Title style={styles.TextBoldWhite}>{labelTimeleft}</Text.Title>
                </View>
            </View>
        );
    };

    const renderRankingGroupItem = ({ item, index }) => {
        return (
            <WalkingGroupRankingItem
                data={{ eventId: data.eventId, group: item }}
                containerStyle={{ backgrounColor: '#ffffff', paddingHorizontal: 12 }}
                rank={index + 1}
                hideDivider={true}
            />
        );
    };

    const renderJoinedUsers = () => {
        if (!showJoinedUsers || !joinedUsers?.total) {
            return null;
        }

        const renderedPlayerAvatar = [];
        let userJoinDesc = '';
        let numberUserLeft = joinedUsers?.total;
        if (joinedUsers?.summary?.length > 0) {
            numberUserLeft = numberUserLeft - joinedUsers?.summary?.length;
        }

        joinedUsers?.summary?.forEach(user => {
            if (user?.userId && user.userId !== AppConfig.USER_PROFILE.userId) {
                const avatarUrl = getAvatarUrlById(user.userId);
                renderedPlayerAvatar.push(
                    <ImageBackground
                        key={'avatar_' + user?.userId}
                        style={styles.playerAvatarContainer}
                        source={images.avatar}
                    >
                        <Image
                            style={styles.playerAvatar}
                            source={avatarUrl ? images.getImage(avatarUrl) : images.avatar}
                        />
                    </ImageBackground>
                );
                userJoinDesc = `${userJoinDesc}${
                    userJoinDesc?.length > 0 ? ', ' : ''
                }${user?.name || user?.userId}`;
            }
        });

        if (userJoinDesc.length > 0) {
            if (numberUserLeft) {
                userJoinDesc = `${userJoinDesc} và ${numberUserLeft} người khác`;
            } else {
                userJoinDesc = `${userJoinDesc} đã tham gia`;
            }
        } else {
            if (numberUserLeft) {
                userJoinDesc = `${numberUserLeft} người đã tham gia`;
            } else {
                userJoinDesc = Strings.firstPersonToJoin;
            }
        }

        return (
            <View style={styles.rowPlayerContainer}>
                {renderedPlayerAvatar?.length > 0 && (
                    <View style={styles.rowJoinedPlayerContainer}>{renderedPlayerAvatar}</View>
                )}
                <Text style={styles.textPlayerDesc}>{userJoinDesc}</Text>
            </View>
        );
    };

    let totalTarget = data?.totalTargetStep || data?.targetUser || 1;
    let progress = (100 * data?.totalStep || 0) / totalTarget;
    if (progress > 100) {
        progress = 100;
    }

    let htmlContent = data?.content ? b64DecodeUnicode(data?.content) : '';
    if (!seeMore && data?.groups && htmlContent.length > 150 && data?.status !== EVENT_STATUS.OFF) {
        htmlContent = htmlContent.substring(0, 150);
        htmlContent += '...';
    }

    if (!data) {
        return null;
    }

    return (
        <View style={styles.root}>
            <TouchableOpacity activeOpacity={0.8} disabled={!onPressBanner} onPress={onPressBanner}>
                <Image style={styles.headerImage} source={images.getImage(data?.banner)} />
                {renderLabelTimeleft()}
            </TouchableOpacity>

            {renderCountdown()}
            <Text.H4 style={styles.textHeader}>{data?.title}</Text.H4>
            {showEventInfo && (
                <View style={styles.contentContainer}>
                    <View style={styles.rowContainer}>
                        <Image style={styles.leftIcon} source={images.ic_calendar} />
                        <Text.Title style={styles.textContent}>
                            {getFormatDate(data?.startDate)} -{' '}
                            {getFormatDate(data?.endDate, 'ddmmyyyy')}
                        </Text.Title>
                    </View>
                    {data?.reward && !showOnlyDate && (
                        <View style={styles.rowContainer}>
                            <Image style={styles.leftIcon} source={images.ic_reward} />
                            <HTMLView
                                style={styles.htmlContainer}
                                styleSheet={htmlStyles}
                                value={`<div>${data?.reward}</div>` || ''}
                            />
                        </View>
                    )}
                    {data?.target && !showOnlyDate && (
                        <View style={styles.rowContainer}>
                            <Image style={styles.leftIcon} source={images.ic_target} />
                            <HTMLView
                                style={styles.htmlContainer}
                                styleSheet={htmlStyles}
                                value={`<div>${data?.target}</div>` || ''}
                            />
                        </View>
                    )}
                </View>
            )}
            {rankingGroup && showOnlyDate && (
                <View style={{ paddingBottom: 12, top: -12 }}>
                    <View style={styles.rowContainer}>
                        <Text.H4 style={styles.textHeader}>{Strings.groupRanking}</Text.H4>
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={topGroups}
                        renderItem={renderRankingGroupItem}
                        keyExtractor={(item, index) => 'WalkingGroupRanking#' + item.id + index}
                        listKey={'WalkingEventInfo#' + data.eventId}
                        ListEmptyComponent={() => <ActivityIndicator />}
                    />
                </View>
            )}
            {showEventInfo && showCtaDetail && data?.userJoined && (
                <TouchableOpacity style={styles.ctaDetailContainer} onPress={onPressDetail}>
                    <Image style={styles.leftIcon} source={images.ic_info_blue} />
                    <Text.Title style={styles.textCtaDetail}>{Strings.eventInfo}</Text.Title>
                </TouchableOpacity>
            )}
            {renderJoinedUsers()}
            {showContentDetail && !!data?.content && (
                <View
                    style={styles.bodyContentContainer}
                    onLayout={setContentPos ? setContentPos.bind(this) : null}
                >
                    <HTMLView
                        style={styles.htmlContainer}
                        styleSheet={htmlStyles}
                        value={`<div>${htmlContent}</div>`}
                    />
                    {data?.groups &&
                        htmlContent.length > 150 &&
                        data?.status !== EVENT_STATUS.OFF &&
                        (seeMore ? (
                            <WalkingButton
                                style={{ marginTop: 10 }}
                                type="text"
                                title={Strings.closeUp}
                                textStyle={{ color: '#1890ff' }}
                                onPress={() => {
                                    if (scrollToContent) {
                                        scrollToContent();
                                    }
                                    setSeeMore(false);
                                }}
                            />
                        ) : (
                            <WalkingButton
                                style={{ marginTop: 10 }}
                                type="text"
                                title={Strings.seeMore}
                                textStyle={{ color: '#1890ff' }}
                                onPress={() => {
                                    MaxApi.trackEvent(WALKING_EVENT_NAME, {
                                        action: 'click_event_detail_read_more',
                                    });
                                    setSeeMore(true);
                                }}
                            />
                        ))}
                </View>
            )}
            {showTargetDivider && <View style={styles.targetDivider} />}
            {showTarget && totalTarget > 1 && (
                <View style={styles.targetContainer}>
                    <Text.Title style={styles.textTarget}>
                        {`${Strings.reached} `}
                        <Text style={styles.bold}>{getStringNumber(data?.totalStep || 0)}</Text>/
                        {getStringNumber(totalTarget)} {Strings.step}
                    </Text.Title>
                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={[
                                styles.progressContent,
                                {
                                    transform: [{ translateX: progressAnim }],
                                },
                            ]}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    rowJoinedPlayerContainer: {
        marginLeft: 8,
        flexDirection: 'row',
        marginRight: 6,
    },
    root: {
        backgroundColor: 'white',
    },
    contentContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
        paddingRight: 24,
    },
    textHeader: {
        color: '#18191a',
        fontWeight: 'bold',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    textContent: {
        color: '#303233',
        flex: 1,
    },
    headerImage: {
        width: DEVICE_WIDTH,
        height: HEADER_BANNER_HEIGHT,
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
        flex: 1,
    },
    rowPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        marginLeft: 16,
    },
    playerAvatarContainer: {
        width: 18,
        height: 18,
        marginLeft: -8,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    playerAvatar: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 0,
        borderColor: '#ffffff',
    },
    textPlayerDesc: {
        flex: 1,
        color: '#797c80',
        fontSize: ScaleSize(11),
        paddingLeft: 4,
        paddingRight: 12,
    },
    countdownContainer: {
        paddingVertical: 12,
        borderBottomWidth: 8,
        borderColor: '#f3f3f3',
    },
    textCountdown: {
        color: '#303233',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    textCountdownHighlight: {
        color: '#b0006d',
        fontWeight: 'bold',
    },
    bodyContentContainer: {
        paddingVertical: 12,
        padding: 16,
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
    },
    textCtaDetail: {
        color: '#1890ff',
    },
    ctaDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
    },
    targetDivider: {
        borderTopWidth: 8,
        borderColor: '#f3f3f3',
        marginBottom: 16,
    },
    targetContainer: {
        marginBottom: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#c7c7cd',
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 10,
    },
    textTarget: {
        color: '#303233',
    },
    bold: {
        fontWeight: 'bold',
    },
    progressContainer: {
        width: progressWidth,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
        backgroundColor: '#C6CCD7',
        overflow: 'hidden',
    },
    progressContent: {
        width: progressWidth,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7BC83F',
    },
    bannerFilterContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    textBannerTimeLeft: {
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginTop: 16,
        marginRight: 16,
    },
    TextBoldWhite: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

const htmlStyles = {
    b: {
        color: '#303233',
        fontSize: 14,
        fontWeight: 'bold',
    },
    strong: {
        color: '#303233',
        fontSize: 14,
        fontWeight: 'bold',
    },
    p: {
        color: '#303233',
        fontSize: 14,
    },
    div: {
        color: '#303233',
        fontSize: 14,
    },
};

export default deepMemo(WalkingEventInfo);
