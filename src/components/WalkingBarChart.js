import React, { useRef, useContext, useState } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import { Text } from '@momo-platform/component-kits';
import { CornerStone } from '@momo-platform/momo-cornerstone';
import { GRAY_COLOR_4, BLACK_COLOR, GRAY_COLOR, GRAY_COLOR_6 } from '../utils/Colors';
import MaxApi from '@momo-platform/max-api';
import moment from 'moment';
import 'moment/locale/vi'; // without this line it didn't work
import { WalkingContext, TabChartBar } from '../components';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { TAB_CHART_SELECTED } from '../utils/EventTypes';
import { WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';

moment.locale('vi');

const WalkingChartBar = ({}) => {
    const { walkingGranted } = useContext(WalkingContext);
    const scrollViewRef = useRef(null);
    const onChangeTab = index => {
        let key = '';
        switch (index) {
            case 0:
                key = 'day';
                break;
            case 1:
                key = 'week';
                break;
            case 2:
                key = 'month';
                break;

            default:
                break;
        }
        // WalkingHelper.trackWithEvent(WALKING_EVENT_NAME, { action: `click_chart_tab_${key}` });
        MaxApi.trackEvent(WALKING_EVENT_NAME, {
            action: `click_chart_tab_${key}`,
        });
        scrollViewRef.current.scrollTo({ x: index * DEVICE_WIDTH });
        DeviceEventEmitter.emit(TAB_CHART_SELECTED);
    };

    return (
        <View style={styles.container}>
            <TabbarAnimation
                tabs={[Strings.day, Strings.week, Strings.month]}
                tabWidth={65}
                onChangeTab={onChangeTab}
                disabled={!walkingGranted}
            />
            <ScrollView
                ref={scrollViewRef}
                scrollEnabled={false}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {['day', 'week', 'month'].map((item, index) => (
                    <TabChartBar key={index} type={item} />
                ))}
            </ScrollView>
            <View
                style={{
                    marginVertical: 10,
                }}
            >
                <CornerStone index={1} tag={'Walking'} />
            </View>
        </View>
    );
};

const TabbarAnimation = ({ tabs = [], tabWidth = 60, onChangeTab, disabled }) => {
    const [page, setPage] = useState(0);
    const positionAnimation = useRef(new Animated.Value(0)).current;
    const onPressItem = index => () => {
        if (index === page) {
            return;
        }
        setPage(index);
        Animated.timing(positionAnimation, {
            toValue: index * tabWidth + (index === 0 ? 0 : index * 10),
            duration: 150,
        }).start();
        onChangeTab?.(index);
    };
    const renderTab = (item, index) => {
        const isActive = page === index;
        const marginLeft = index === 0 ? 0 : 10;
        return (
            <TouchableOpacity
                disabled={disabled}
                key={index}
                onPress={onPressItem(index)}
                activeOpacity={0.7}
                style={[
                    styles.tabItem,
                    {
                        width: tabWidth,
                        marginLeft,
                    },
                ]}
            >
                <Text style={isActive ? styles.txtActive : styles.txtInactive}>{item}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <View style={styles.wrapTabs}>
            <Animated.View
                style={[
                    styles.pagination,
                    {
                        width: tabWidth,
                        left: positionAnimation,
                    },
                ]}
            />
            {tabs.map(renderTab)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: 24,
    },
    txtActive: {
        color: BLACK_COLOR,
        fontWeight: 'bold',
    },
    txtInactive: {
        color: GRAY_COLOR,
    },
    tabItem: {
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapTabs: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        backgroundColor: GRAY_COLOR_4,
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 24,
    },
    pagination: {
        height: 30,
        borderRadius: 15,
        backgroundColor: GRAY_COLOR_6,
        position: 'absolute',
    },
});

export default React.memo(WalkingChartBar);
