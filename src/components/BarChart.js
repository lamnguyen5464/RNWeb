import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, DeviceEventEmitter } from 'react-native';
import { Text, ScaleSize } from '@momo-platform/component-kits';
import moment from 'moment';
import {
    BLACK_COLOR,
    VIOLET_COLOR,
    HAWKES_BLUE_COLOR,
    TEXT_BLACK_COLOR,
    GRAY_COLOR,
    GRAY_COLOR_6,
    LINE_COLOR,
} from '../utils/Colors';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { displayNumber } from '../utils/StringUtils';
import { isIOS } from '../utils/DeviceUtils';
import { TAB_CHART_SELECTED } from '../utils/EventTypes';

const CHART_NUMBER_WIDTH = 40;
const CHART_NUMBER_HEIGHT = 42;
const PADDING_HORIZONTAL = 16;
const MARGIN_CHART_NUMBER = 16;

const BarChart = ({ data = [], target = 1, type = 'day', selectedIndex }) => {
    const [selected, setSelected] = useState(selectedIndex);
    const flatlistRef = useRef(null);
    const animated = isIOS;
    let listener;

    useEffect(() => {
        listener = DeviceEventEmitter.addListener(TAB_CHART_SELECTED, () => {
            flatlistRef?.current?.scrollToIndex?.({
                index: selectedIndex > 4 ? selectedIndex : 0,
                animated,
                viewPosition: selectedIndex > 4 ? 1 : 0,
            });
        });
        return () => {
            listener?.remove();
        };
    }, []);

    /* useEffect(() => {
        const listener = () => {
            flatlistRef?.current?.scrollToIndex?.({
                index: selectedIndex > 4 ? selectedIndex : 0,
                animated,
                viewPosition: selectedIndex > 4 ? 1 : 0,
            });
        };
        DeviceEventEmitter.addListener(TAB_CHART_SELECTED, listener);
        return () => {
            DeviceEventEmitter.removeListener(TAB_CHART_SELECTED, listener);
        };
    }, [selectedIndex]); */

    const { arrChartNumber, maxNumber } = getChartNumber(data, target);

    const getDate = useCallback(() => {
        if (typeof selected !== 'number') {
            return '';
        }
        const current = formatDate(data[selected]?.date);
        switch (type) {
            case 'day': {
                const string = current.format('dddd - DD/M/YYYY').toString();
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            case 'week': {
                return (
                    'Tuần ' +
                    current.format('DD/M') +
                    ' - ' +
                    current.add(6, 'day').format('DD/M') +
                    '/' +
                    current.format('YYYY')
                );
            }
            case 'month': {
                return 'Tháng ' + current.format('MM/YYYY');
            }

            default:
                return '';
        }
    }, [selected]);

    const getChartPosition = step => {
        const percent = (step * 100) / maxNumber;
        const height =
            (percent * (arrChartNumber.length * CHART_NUMBER_HEIGHT - CHART_NUMBER_HEIGHT)) / 100;
        return height;
    };

    const onPressChart = (item, index) => () => {
        setSelected(index);
    };

    const renderChartNumber = (item, index) => {
        const targetLinePostion = -getChartPosition(target) + CHART_NUMBER_HEIGHT / 2;
        return (
            <View key={index} style={styles.wrapChartNumber}>
                <Text style={styles.txtChartNumber}>{item}</Text>
                <View style={styles.lineHorizontal} />
                {index === arrChartNumber.length - 1 && (
                    <View
                        style={[
                            styles.lineHorizontal,
                            styles.targetLine,
                            {
                                top: targetLinePostion,
                            },
                        ]}
                    />
                )}
            </View>
        );
    };

    const getDateType = () => {
        switch (type) {
            case 'day':
                return 'dd';
            case 'week':
                return 'DD/M';
            case 'month':
                return 'M';
            default:
                break;
        }
    };

    const getKey = (item, key) => `${item} ${key}`;

    const renderChart = ({ item, index }) => {
        const isSelected = selected === index;
        const height = getChartPosition(item.walkStep);

        const backgroundColor = isSelected ? VIOLET_COLOR : HAWKES_BLUE_COLOR;
        return (
            <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={onPressChart(item, index)}
                style={styles.wrapBarChart}
            >
                {isSelected && (
                    <Text.SubTitle style={styles.txtWalkStep}>
                        {displayNumber(item.walkStep)}
                    </Text.SubTitle>
                )}
                <View
                    style={[
                        styles.chart,
                        {
                            height,
                            backgroundColor,
                        },
                    ]}
                />
                <View style={styles.wrapDate}>
                    <Text style={[styles.txtDay, isSelected && styles.txtDaySelected]}>
                        {type === 'month' ? 'T' : ''}
                        {formatDate(item.date).format(getDateType())}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ width: DEVICE_WIDTH }}>
            <View style={styles.row}>
                <View style={styles.wrapNumber}>{arrChartNumber.map(renderChartNumber)}</View>

                <FlatList
                    ref={flatlistRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    renderItem={renderChart}
                    keyExtractor={getKey}
                    onScrollToIndexFailed={() => {}}
                    style={styles.wrapChart}
                />
            </View>
            <View style={styles.line} />
            <Text style={styles.txtDate}>{getDate()}</Text>
        </View>
    );
};

/**
 *
 * @param {*} statisticWalking
 * @param {*} target
 */
const getChartNumber = (statisticWalking = [], target = 1) => {
    const arrNumber = statisticWalking.map(item => item.walkStep);

    const val = Math.max(...arrNumber);
    const max = (val < target ? target : val) / 5;
    const newArr = [];
    let chartNum = 0;
    let displayThousand = false;
    for (let i = 5; i >= 1; i--) {
        chartNum = Math.ceil(Math.floor(max * i) / 10) * 10;
        if (chartNum / 1000 >= 1 && chartNum >= 10000) {
            displayThousand = true;
        }
        const value = displayNumber(chartNum, displayThousand);
        newArr.push(value);
    }
    newArr.push(0);
    return { arrChartNumber: newArr, maxNumber: val < target ? target : val };
};

/**
 *
 * @param {*} date
 * @param {*} currentFormat
 * @param {*} futureFormat
 */
const formatDate = date => {
    if (!date) {
        return moment();
    }

    return moment(date, 'DD/MM/YYYY');
};

const styles = StyleSheet.create({
    lineHorizontal: {
        position: 'absolute',
        top: CHART_NUMBER_HEIGHT / 2,
        left: CHART_NUMBER_WIDTH + MARGIN_CHART_NUMBER,
        right: 0,
        height: 1,
        backgroundColor: LINE_COLOR,
        width: DEVICE_WIDTH - CHART_NUMBER_WIDTH - PADDING_HORIZONTAL * 3,
    },
    txtWalkStep: {
        color: BLACK_COLOR,
        fontWeight: '600',
        textAlign: 'center',
    },
    wrapDate: {
        height: CHART_NUMBER_HEIGHT,
        paddingTop: 6,
        alignItems: 'center',
        marginLeft: -2,
    },
    wrapChart: {
        marginLeft: 18,
        marginRight: 16,
    },
    chart: {
        width: 22,
        backgroundColor: HAWKES_BLUE_COLOR,
        borderRadius: 4,
    },
    wrapBarChart: {
        width: 40,
        marginRight: 12,
        marginBottom: -1,
        minHeight: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    wrapChartNumber: {
        height: CHART_NUMBER_HEIGHT,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    wrapNumber: {
        width: CHART_NUMBER_WIDTH,
        paddingBottom: 20,
        marginLeft: 16,
    },
    line: {
        backgroundColor: GRAY_COLOR_6,
        height: 1,
        flex: 1,
        marginBottom: 16,
    },
    txtDate: {
        color: TEXT_BLACK_COLOR,
        textAlign: 'center',
    },
    txtChartNumber: {
        color: TEXT_BLACK_COLOR,
        fontSize: ScaleSize(11),
    },
    txtDay: {
        color: GRAY_COLOR,
        fontSize: ScaleSize(11),
    },
    targetLine: {
        backgroundColor: VIOLET_COLOR,
    },
    txtDaySelected: {
        color: VIOLET_COLOR,
        fontWeight: '600',
    },
});

export default React.memo(BarChart);
