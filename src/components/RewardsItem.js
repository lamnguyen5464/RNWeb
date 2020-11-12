import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import images from '../assets/images';
import { NavigatorAction } from '../screens/Walking';
import { GREEN_COLOR, GRAY_COLOR, BLACK_COLOR, TEXT_COLOR_2 } from '../utils/Colors';
import { debounce } from 'lodash';
import WalkingHelper from '../api/WalkingHelper';
import { WALKING_EVENT_NAME } from '../utils/Const';
import GetFood from '../components/GetFood';
import MaxApi from '@momo-platform/max-api';
import Strings from '../utils/Strings';

// const FOOD = 0;
// const BADGE = 1;
const GOLDEN_PIG = 2;
// const NOT_ENOUGH_CONDITION = 0
const NOT_RECEIVED = 1;
const RECEIVED = 2;

const RewardsItem = ({ item = {}, isLastItem, walkStepDay, isFirstItem, targetRewards, index }) => {
    const [height, setHeight] = useState(0);
    const [status, setStatus] = useState(item.status);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStatus(item.status);
        return () => {};
    }, [item.status]);

    const onPressTake = useCallback(() => {
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, {
        //     action: 'click_main_receive',
        //     info1: `click_main_receive_${item.targetValue}`,
        // });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: 'click_main_receive',
            info1: `click_main_receive_${item.targetValue}`,
        });
        setLoading(true);
        if (item.targetRewardType === GOLDEN_PIG) {
            WalkingHelper.collectGoldenPigReward(
                { targetId: item.targetId },
                onGetResponse,
                onError
            );
            return;
        }
        WalkingHelper.collectTargetWalkingReward(
            { targetId: item.targetId },
            onGetResponse,
            onError
        );
    }, [item.targetId]);

    const onGetResponse = (result, data) => {
        setLoading(false);
        if (result) {
            setStatus(RECEIVED);
            if (result?.momoMsg?.refId === 'cashback') {
                //forward to Cashback
                const msg = result.momoMsg;
                MaxApi.showAlert(msg?.title, msg?.desc, [msg.cta, Strings.close], button => {
                    if (button === 0) {
                        MaxApi.startFeatureCode(item.refId);
                    }
                });
            } else {
                showPopup();
            }
        }
    };

    const onError = () => {
        setLoading(false);
    };

    const showPopup = useCallback(() => {
        const {
            targetCollectSuccessDesc,
            targetDesc,
            title,
            refId,
            icon,
            btnTitle,
            targetValue,
            targetRewardType,
        } = item;
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            stage: `pu_receive_${targetValue}_show`,
        });

        NavigatorAction?.show({
            screen: GetFood,
            params: {
                popupData: {
                    body: targetCollectSuccessDesc,
                    btnTitle,
                    title,
                    subTitle: targetDesc,
                    refId,
                    img: icon,
                    targetValue,
                    isGoldenPig: targetRewardType === GOLDEN_PIG,
                },
            },
        });
    }, [item.targetId]);

    const paddingTop = isFirstItem ? 0 : 22;

    const isReceived = status === RECEIVED;
    const isNotReceived = status === NOT_RECEIVED;
    const isPassed = isReceived || isNotReceived;

    const lineColor =
        walkStepDay >= targetRewards[index + 1]?.targetValue ? GREEN_COLOR : GRAY_COLOR;
    const backgroundColor = isReceived ? '#fff' : GREEN_COLOR;
    const color = isReceived ? '#797c80' : '#fff';
    return (
        <View
            onLayout={({ nativeEvent }) => {
                setHeight(nativeEvent.layout.height);
            }}
            style={[
                styles.wrapItem,
                {
                    paddingTop,
                },
            ]}
        >
            <View style={styles.row}>
                {!isLastItem && (
                    <View
                        style={[
                            styles.line,
                            {
                                height: height + (isFirstItem ? 22 : 0),
                                backgroundColor: lineColor,
                            },
                        ]}
                    />
                )}
                <Image
                    source={isPassed ? images.ic_checked : images.ic_uncheck}
                    style={styles.imgCheck}
                />
                <View style={styles.marginLeft}>
                    <Text.Title
                        style={[styles.txtTargetValue, isNotReceived && { color: BLACK_COLOR }]}
                    >
                        {`${item.targetValue} ${Strings.steps}`}
                    </Text.Title>
                    <Text style={[styles.txtTargetDesc, isNotReceived && { color: TEXT_COLOR_2 }]}>
                        {item.targetDesc}
                    </Text>
                </View>
            </View>
            {isPassed && (
                <TouchableOpacity
                    onPress={debounce(onPressTake, 300, { leading: true, trailing: false })}
                    disabled={isReceived || loading}
                    activeOpacity={0.7}
                    style={[
                        styles.button,
                        {
                            backgroundColor,
                        },
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            style={[
                                styles.txtButton,
                                {
                                    color,
                                },
                            ]}
                        >
                            {isReceived ? Strings.received : Strings.take}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    txtTargetDesc: {
        color: GRAY_COLOR,
        fontSize: ScaleSize(11),
        marginTop: 2,
    },
    txtTargetValue: {
        color: GRAY_COLOR,
    },
    imgCheck: {
        width: 15,
        height: 15,
        marginTop: 2,
    },
    line: {
        width: 1,
        position: 'absolute',
        left: 15 / 2,
        top: 15 / 2,
    },
    wrapItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flex: 1,
    },
    marginLeft: {
        marginLeft: 12,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        width: 150,
        paddingBottom: 4,
        flex: 1,
    },
    txtButton: {
        fontSize: ScaleSize(11),
        fontWeight: 'bold',
    },
    button: {
        paddingHorizontal: 10,
        borderRadius: 6,
        marginLeft: 12,
        justifyContent: 'center',
        height: 32,
        minWidth: 50,
    },
});

export default React.memo(RewardsItem);
