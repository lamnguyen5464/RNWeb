import React, { useContext, useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { Image, Text } from '@momo-platform/component-kits';
import moment from 'moment';
import { WalkingPermission, WalkingContext, BarChart, WalkingButton } from '../components';
import { NavigatorAction } from '../screens/Walking';
import WalkingHelper from '../api/WalkingHelper';
import images from '../assets/images';
import Strings from '../utils/Strings';
import { TEXT_BLACK_COLOR } from '../utils/Colors';
import {
    WALKING_ERROR_EVENT,
    STATISTICAL_USER_WALKING,
    WALKING_GRANTED_PERMISSION_EVENT,
} from '../utils/EventTypes';
import { DEVICE_WIDTH } from '../utils/Dimensions';

const TabChartBar = ({ type }) => {
    const { permissionParams, walkingGranted } = useContext(WalkingContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        chart: [],
        targetWalking: 0,
        selected: 0,
    });

    useEffect(() => {
        WalkingHelper.getChartData(type, ({ result, momoMsg }) => {
            setLoading(false);
            if (!result) {
                DeviceEventEmitter.emit(WALKING_ERROR_EVENT, STATISTICAL_USER_WALKING);
                return;
            }

            const indexToday = momoMsg?.chart?.findIndex(item => {
                return getTypeCheckDate(type, item);
            });
            setData({ ...momoMsg, selected: indexToday });
        });
        return () => {};
    }, []);

    const onPressSync = () => {
        NavigatorAction?.show({
            screen: WalkingPermission,
            params: {
                params: permissionParams,
                onPermissionGranted: () => {
                    DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
                },
            },
        });
    };

    if (!walkingGranted) {
        return (
            <View style={styles.permissionWrapper}>
                <Image style={{ width: 120, height: 120 }} source={images.ic_walking_sync} />
                <Text.Title style={styles.textCenter}>{Strings.walkingPermission}</Text.Title>
                <WalkingButton style={{ margin: 15 }} title={Strings.sync} onPress={onPressSync} />
            </View>
        );
    }
    if (loading || data.chart.length === 0) {
        return (
            <View style={{ width: DEVICE_WIDTH }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <BarChart
            data={data.chart}
            target={data.targetWalking}
            type={type}
            selectedIndex={data.selected}
        />
    );
};

const formatDate = date => {
    if (!date) {
        return moment();
    }
    return moment(date, 'DD/MM/YYYY');
};

const getTypeCheckDate = (type, item) => {
    switch (type) {
        case 'day': {
            const today = moment()
                .format('DD/MM/YYYY')
                .toString();
            return today === item.date;
        }
        case 'week': {
            return formatDate(item.date).week() === moment(new Date(), 'MM-DD-YYYY').week();
        }
        case 'month': {
            return formatDate(item.date).month() === moment(new Date(), 'MM-DD-YYYY').month();
        }

        default:
            break;
    }
};

const styles = StyleSheet.create({
    textCenter: {
        fontWeight: 'bold',
        color: TEXT_BLACK_COLOR,
        textAlign: 'center',
        padding: 16,
    },
    permissionWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: DEVICE_WIDTH,
        backgroundColor: '#ffffff',
    },
});

export default React.memo(TabChartBar);
