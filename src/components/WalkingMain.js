import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, DeviceEventEmitter, Modal } from 'react-native';
import {
    WalkingLoading,
    Header,
    WalkingUserInfo,
    WalkingBarChart,
    WalkingSectionBadges,
    WalkingSectionEvents,
    WalkingSectionRanking,
    WalkingFooter,
    WalkingError,
} from '../components';
import WalkingHelper from '../api/WalkingHelper';
import {
    WALKING_ERROR_EVENT,
    USER_TARGET_BY_STATISTICAL_DATE_WALKING,
    WALKING_INFO_MSG_V3,
    CASHBACK_WALKING_FIRSTTIME_GRANTED_PERMISSION,
    STATISTICAL_USER_WALKING,
    NOTI_RECEIVE_WALKING_BADGES,
} from '../utils/EventTypes';
import { NavigatorAction } from '../screens/Walking';
import WalkingInfo from '../screens/WalkingInfo';
import MomoAsyncHelper from '../utils/MomoAsyncHelper';
import Strings from '../utils/Strings';

const LOADING_STATUS = 0;
const ACTIVE_STATUS = 1;
const ERROR_STATUS = 2;
const DONE = 3;

type WalkingMainProps = {
    params?: Object,
};

const WalkingMain = ({ params = {} }: WalkingMainProps) => {
    const [pageStatus, setPageStatus] = useState(LOADING_STATUS);
    const [visible, setVisible] = useState(true);
    let unmount = false;
    let errListener, badgesListener;
    let errorCount = 0;
    let TIME_OUT;

    const updatePageStatus = status => {
        if (pageStatus === ERROR_STATUS || unmount) {
            return;
        }
        setPageStatus(status);
    };

    useEffect(() => {
        WalkingHelper.postWalkingSteps(res => {
            updatePageStatus(ACTIVE_STATUS);
        });
        errListener = DeviceEventEmitter.addListener(WALKING_ERROR_EVENT, type => {
            if (pageStatus === ERROR_STATUS) {
                return;
            }
            if (type === USER_TARGET_BY_STATISTICAL_DATE_WALKING) {
                updatePageStatus(ERROR_STATUS);
                return;
            }
            if (type === WALKING_INFO_MSG_V3 || type === STATISTICAL_USER_WALKING) {
                errorCount += 1;
            }
            if (errorCount === 2) {
                updatePageStatus(ERROR_STATUS);
                errorCount = 0;
                return;
            }
        });
        WalkingHelper.checkShowPopupFromNoti();
        badgesListener = DeviceEventEmitter.addListener(NOTI_RECEIVE_WALKING_BADGES, () => {
            WalkingHelper.checkShowPopupFromNoti();
        });
        return () => {
            unmount = true;
            errListener?.remove?.();
            badgesListener?.remove?.();
            TIME_OUT && clearTimeout(TIME_OUT);
        };
    }, []);

    useEffect(() => {
        if (pageStatus === DONE || pageStatus === ERROR_STATUS) {
            setVisible(false);
        }
    }, [pageStatus]);

    const arrComponentName = [
        'WalkingUserInfo',
        'WalkingChartBar',
        'WalkingSectionBadges',
        'WalkingSectionEvents',
        'WalkingSectionRanking',
    ];

    const onPressInfo = () => {
        NavigatorAction?.push({
            screen: WalkingInfo,
            params: {
                defaultParam: params,
            },
            options: {
                headerShown: false,
            },
        });
    };

    const onGetWalkingInfoDone = async res => {
        const firstTimeGranted = await MomoAsyncHelper.getItemAsync(
            CASHBACK_WALKING_FIRSTTIME_GRANTED_PERMISSION
        );

        if (firstTimeGranted && Date.now() - firstTimeGranted < 150000) {
            TIME_OUT && clearTimeout(TIME_OUT);
            TIME_OUT = setTimeout(() => {
                updatePageStatus(DONE);
            }, 1500);
            return;
        }

        if (pageStatus !== ERROR_STATUS) {
            updatePageStatus(DONE);
        }
    };

    const getKey = (item, index) => `${item}${index}`;

    const renderItem = ({ item }) => {
        switch (item) {
            case 'WalkingUserInfo':
                return <WalkingUserInfo onDone={onGetWalkingInfoDone} />;
            case 'WalkingChartBar':
                return <WalkingBarChart />;
            case 'WalkingSectionBadges':
                return <WalkingSectionBadges />;
            case 'WalkingSectionEvents':
                return <WalkingSectionEvents hideEventsTarget={false} />;
            case 'WalkingSectionRanking':
                return <WalkingSectionRanking />;
            default:
                break;
        }
    };

    const renderFooter = () => {
        return <WalkingFooter />;
    };

    const renderContent = () => {
        switch (pageStatus) {
            case ERROR_STATUS:
                return <WalkingError />;
            case LOADING_STATUS:
                return <View />;
            default:
                return (
                    <FlatList
                        data={arrComponentName}
                        renderItem={renderItem}
                        keyExtractor={getKey}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListFooterComponent={renderFooter}
                        ListFooterComponentStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={5}
                    />
                );
        }
    };

    return (
        <View style={[styles.container, { opacity: visible ? 0 : 1 }]}>
            <Header
                backgroundColor={'#fff'}
                title={Strings.getLocalize(params?.title)}
                onPressRight={onPressInfo}
            />
            {renderContent()}
            <Modal visible={visible} animated animationType="fade">
                <WalkingLoading title={Strings.getLocalize(params?.title)} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: '#f3f3f3', flex: 1 },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default React.memo(WalkingMain);
