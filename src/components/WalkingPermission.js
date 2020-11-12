import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    AppState,
    Linking,
} from 'react-native';
import { Image, Carousel, Pagination, Text, ScaleSize } from '@momo-platform/component-kits';
import WalkingButton from '../components/WalkingButton';
import MaxApi from '@momo-platform/max-api';
import WalkingHelper from '../api/WalkingHelper';
import { ifIphoneX, isIOS } from '../utils/DeviceUtils';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import images from '../assets/images';
import {
    GREEN_COLOR,
    TEXT_BLACK_COLOR,
    GRAY_COLOR_3,
    BLACK_COLOR,
    TEXT_COLOR_2,
} from '../utils/Colors';
import Strings from '../utils/Strings';
import { NavigatorAction } from '../screens/Walking';

const dataInit = {
    images: [],
    steps: [],
    header: null,
};

const WalkingPermission = ({ params, onPermissionGranted }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState(dataInit);
    const flatListRef = useRef(null);
    let appState = AppState.currentState;

    useEffect(() => {
        const res = getPermissionInfo(params);
        setData(res);
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);

    const onSnapToItem = useCallback(
        index => {
            setCurrentPage(index);
            flatListRef.current?.scrollToIndex?.({ index });
        },
        [flatListRef.current]
    );

    const onRequestClose = () => {
        NavigatorAction?.pop();
    };

    const handleAppStateChange = nextAppState => {
        if (appState?.match(/inactive|background/) && nextAppState === 'active') {
            WalkingHelper.getSteps(true).then(steps => {
                if (steps) {
                    onPermissionGranted();
                }
                onRequestClose();
            });
        }
        appState = nextAppState;
    };

    const onRequestPermission = () => {
        MaxApi.requestPermission('fitness', status => {
            if (status === 'unavailable') {
                MaxApi.showAlert(Strings.walkingPermissionError);
                return;
            }
            if (status === 'denied') {
                Linking.openURL('x-apple-health://sources')
                    .then(() => {
                        AppState.addEventListener('change', handleAppStateChange);
                    })
                    .catch(() => {
                        MaxApi.showAlert(Strings.walkingPermissionError);
                    });
                return;
            }

            onPermissionGranted();
            onRequestClose();
        });
    };

    const renderSwiperItem = ({ item }) => {
        return (
            <View style={{ width: DEVICE_WIDTH, height: DEVICE_WIDTH }}>
                <Image
                    source={images.getImage(item)}
                    style={{ width: DEVICE_WIDTH, height: DEVICE_WIDTH }}
                    resizeMode="contain"
                />
            </View>
        );
    };

    const renderSteps = ({ item, index }) => {
        const isActive = index === currentPage;
        return (
            <View style={styles.wrapSteps}>
                <View style={[styles.stepNumber, !isActive && { backgroundColor: GRAY_COLOR_3 }]}>
                    <Text style={[styles.txtNumber, !isActive && { color: BLACK_COLOR }]}>
                        {item.number}
                    </Text>
                </View>
                <Text.Title style={[styles.content, isActive && { fontWeight: 'bold' }]}>
                    {item.text}
                </Text.Title>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={onRequestClose} style={styles.btnClose}>
                <Image source={images.ic_close} style={styles.iconClose} />
            </TouchableOpacity>
            <View style={styles.wrapImages}>
                {data.images.length > 0 && (
                    <Carousel
                        loop={true}
                        data={data.images}
                        renderItem={renderSwiperItem}
                        sliderWidth={DEVICE_WIDTH}
                        itemWidth={DEVICE_WIDTH}
                        hasParallaxImages
                        enableMomentum
                        removeClippedSubviews={false}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        autoplay={true}
                        onSnapToItem={onSnapToItem}
                    />
                )}
            </View>
            <View style={styles.wrapPagination}>
                <Pagination
                    dotsLength={data.images.length}
                    activeDotIndex={currentPage}
                    containerStyle={styles.containerStyle}
                    dotContainerStyle={styles.dotContainerStyle}
                    dotStyle={styles.dotStyle}
                    inactiveDotScale={1}
                    inactiveDotStyle={styles.inactiveDotStyle}
                />
            </View>
            <Text.H3 style={styles.txtHeader}>{data.header}</Text.H3>
            <FlatList
                ref={flatListRef}
                data={data.steps}
                renderItem={renderSteps}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={styles.scrollView}
                keyExtractor={(item, index) => `${item}${index}`}
                onScrollToIndexFailed={() => {}}
            />
            <View style={styles.wrapBottom}>
                <Text style={styles.txtDescription}>{Strings.startInstruction}</Text>
                <View style={styles.wrapButton}>
                    <WalkingButton title={Strings.start} onPress={onRequestPermission} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const getPermissionInfo = params => {
    const keyFilter = isIOS ? 'ios_health' : 'android';
    const data = {
        images: [],
        steps: [],
        header: null,
    };
    Object.keys(params).forEach(function(key) {
        if (key.indexOf(keyFilter) >= 0) {
            data.images.push(params[key]);
            data.steps.push(...params[key]?.steps);
            data.header = params[key]?.header;
        }
    });

    data.images.sort((a, b) => parseInt(a.steps[0].number) - parseInt(b.steps[0].number));
    data.images = data.images.map(elem => elem.img);
    data.steps.sort((a, b) => parseInt(a.number) - parseInt(b.number));

    return data;
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    wrapButton: {
        paddingHorizontal: 12,
        paddingTop: 6,
        backgroundColor: '#fff',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    btnClose: { position: 'absolute', right: 20, top: ifIphoneX(55, 40), zIndex: 1 },
    iconClose: { width: 24, height: 24 },
    containerStyle: {
        height: 14,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    dotStyle: {
        backgroundColor: '#78ca32',
        width: 12,
        height: 6,
        borderRadius: 3,
    },
    inactiveDotStyle: {
        backgroundColor: '#bec4cf',
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    dotContainerStyle: { marginHorizontal: 2 },
    content: {
        color: TEXT_BLACK_COLOR,
        marginLeft: 8,
        flex: 1,
    },
    stepNumber: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: GREEN_COLOR,
    },
    txtNumber: {
        fontSize: ScaleSize(11),
        color: '#fff',
        fontWeight: 'bold',
    },
    wrapSteps: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'flex-start',
        paddingVertical: 11,
    },
    wrapPagination: {
        position: 'absolute',
        top: DEVICE_WIDTH + ifIphoneX(20, 0),
        alignItems: 'center',
        left: 0,
        right: 0,
    },
    txtHeader: {
        paddingHorizontal: 16,
        fontWeight: 'bold',
        color: BLACK_COLOR,
    },
    txtDescription: {
        fontSize: ScaleSize(11),
        color: TEXT_COLOR_2,
        textAlign: 'center',
        marginBottom: 8,
    },
    wrapBottom: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: ifIphoneX(35, 12),
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingTop: 8,
    },
    scrollView: { flex: 1, marginTop: 16 },
    wrapImages: { height: DEVICE_WIDTH, marginBottom: 16 },
});

export default WalkingPermission;
