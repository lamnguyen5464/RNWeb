/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    AppState,
    ScrollView,
    DeviceEventEmitter,
    Linking,
} from 'react-native';
import {
    Image,
    Carousel,
    Pagination,
    Icon,
    Text,
    Colors,
    ScaleSize,
} from '@momo-platform/component-kits';
import { ifIphoneX } from '../utils/DeviceUtils';
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../utils/Dimensions';
import {
    GREEN_COLOR,
    TEXT_COLOR,
    TEXT_COLOR_2,
    GREEN_COLOR_2,
    BLACK_COLOR,
    TEXT_BLACK_COLOR,
} from '../utils/Colors';
import images from '../assets/images';
import MomoAsyncHelper from '../utils/MomoAsyncHelper';
import WalkingHelper from '../api/WalkingHelper';
import { WALKING_GRANTED_PERMISSION_EVENT } from '../utils/EventTypes';
import { WALKING_ONBOARDING_SHOWN } from '../utils/StoreKey';
import MaxApi from '@momo-platform/max-api';
import { WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';
import { deepMemo } from 'use-hook-kits';

const WalkingOnboarding = deepMemo(({ data = [], onBoardingFinish = () => {} }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const carouselRef = useRef(null);
    const appState = useRef(AppState.currentState);
    const scrollViewRef = useRef(null);
    const currentItem = useRef(1);
    const timeOut = useRef(null);

    useEffect(() => {
        return () => {
            timeOut.current && clearTimeout(timeOut.current);
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);

    const onClose = () => {
        saveShowedIntro();
        onBoardingFinish?.();
    };

    const onPrevious = () => {
        carouselRef.current?.snapToPrev();
    };

    const onNext = () => {
        if (currentPage === data?.length - 1 && currentPage !== 0) {
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_onboarding_grant_steps',
            });
            saveShowedIntro();
            MaxApi.requestPermission('fitness', async status => {
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

                DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);

                onClose();
            });
            return;
        }
        carouselRef.current?.snapToNext();
    };

    const saveShowedIntro = () => {
        const time = new Date().getTime();
        MomoAsyncHelper.setItem(WALKING_ONBOARDING_SHOWN, time);
    };

    useEffect(() => {
        if (currentPage === data.length - 1) {
            scrollItem();
        }
    }, [currentPage]);

    const onSnapToItem = index => {
        setCurrentPage(index);
    };

    const scrollItem = (time = 1000) => {
        timeOut.current && clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: DEVICE_WIDTH * currentItem.current,
                animated: true,
            });
            currentItem.current += 1;

            if (currentItem.current === 2) {
                currentItem.current = 0;
                scrollItem(2000);
                return;
            }
            scrollItem();
        }, time);
    };

    const handleAppStateChange = nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            WalkingHelper.getSteps(true).then(steps => {
                if (steps) {
                    DeviceEventEmitter.emit(WALKING_GRANTED_PERMISSION_EVENT);
                }
                onClose();
            });
        }
        appState.current = nextAppState;
    };

    const renderSteps = (step, index) => (
        <View key={index} style={styles.wrapSteps}>
            <View style={styles.stepNumber}>
                <Text style={styles.txtNumber}>{step.number}</Text>
            </View>
            <Text.Title style={styles.content}>{step.text}</Text.Title>
        </View>
    );

    const renderSwiperItem = ({ item }) => {
        if (item.isFullScreen) {
            return (
                <Image
                    resizeMode="contain"
                    source={images.getImage(item.img)}
                    style={styles.fullScreen}
                />
            );
        }
        const obj = item[Platform.OS] || item;
        const img = obj.img || [];
        return (
            <ScrollView
                bounces={false}
                style={styles.wrapItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {typeof img === 'string' ? (
                    <Image
                        resizeMode="cover"
                        source={images.getImage(img)}
                        style={styles.imgBackground}
                    />
                ) : (
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        {img.map((uri, index) => (
                            <Image
                                key={index}
                                resizeMode="cover"
                                source={images.getImage(uri)}
                                style={styles.imgBackground}
                            />
                        ))}
                    </ScrollView>
                )}
                <View style={styles.wrapItemContent}>
                    <Text.H3
                        style={[
                            styles.txtHeader,
                            {
                                color: item.isPermission ? BLACK_COLOR : GREEN_COLOR_2,
                            },
                        ]}
                    >
                        {item.header}
                    </Text.H3>
                    {!!item.content && <Text style={styles.txtContent}>{item.content}</Text>}
                    {obj?.steps?.length > 0 && obj?.steps?.map?.(renderSteps)}
                </View>
            </ScrollView>
        );
    };

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === data.length - 1;
    return (
        <View style={styles.container}>
            {isLastPage && (
                <TouchableOpacity onPress={onClose} style={styles.btnClose}>
                    <Icon name={'24_navigation_close_circle_full'} style={styles.iconClose} />
                </TouchableOpacity>
            )}
            <View style={styles.wrapBottom}>
                {data[currentPage]?.isPermission && (
                    <Text style={styles.txtDescription}>{Strings.startInstruction}</Text>
                )}
                <View style={styles.wrapButton}>
                    <TouchableOpacity
                        onPress={onPrevious}
                        disabled={isFirstPage}
                        style={{ opacity: isFirstPage ? 0 : 1, flex: 1 }}
                    >
                        <Text.H4 style={styles.txtButton}>{Strings.back}</Text.H4>
                    </TouchableOpacity>
                    <Pagination
                        dotsLength={data.length}
                        activeDotIndex={currentPage}
                        containerStyle={styles.containerStyle}
                        dotContainerStyle={styles.dotContainerStyle}
                        dotStyle={styles.dotStyle}
                        inactiveDotScale={1}
                        inactiveDotStyle={styles.inactiveDotStyle}
                    />
                    <TouchableOpacity
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        style={styles.btnNext}
                        onPress={onNext}
                    >
                        <Text.H4 style={[styles.txtButton, { color: GREEN_COLOR }]}>
                            {isLastPage ? Strings.access : Strings.continue}
                        </Text.H4>
                    </TouchableOpacity>
                </View>
            </View>
            <Carousel
                ref={carouselRef}
                loop={false}
                data={data}
                renderItem={renderSwiperItem}
                sliderWidth={DEVICE_WIDTH}
                itemWidth={DEVICE_WIDTH}
                useScrollView
                hasParallaxImages
                enableMomentum
                removeClippedSubviews={false}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                autoplay={false}
                onSnapToItem={onSnapToItem}
            />
        </View>
    );
});

export default WalkingOnboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerStyle: {
        height: 14,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    dotStyle: {
        backgroundColor: Colors.success,
        width: 12,
        height: 6,
        borderRadius: 3,
    },
    inactiveDotStyle: {
        backgroundColor: Colors.disabled,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    dotContainerStyle: {
        marginHorizontal: 2,
    },
    wrapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 20,
        paddingBottom: ifIphoneX(24, 12),
        backgroundColor: 'white',
    },
    txtButton: {
        color: TEXT_COLOR,
        fontWeight: '600',
    },
    imgBackground: { width: DEVICE_WIDTH, height: DEVICE_WIDTH },
    btnNext: { flex: 1, alignItems: 'flex-end' },
    txtDescription: {
        fontSize: ScaleSize(11),
        color: TEXT_COLOR_2,
        alignSelf: 'center',
        marginBottom: 6,
        paddingTop: 6,
    },
    wrapButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        alignItems: 'center',
    },
    btnClose: {
        position: 'absolute',
        right: 20,
        top: ifIphoneX(55, 30),
        zIndex: 1,
    },
    iconClose: {
        width: 26,
        height: 26,
        tintColor: 'black',
    },
    stepNumber: {
        width: 20,
        height: 20,
        marginVertical: 10,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0,
        borderColor: 'transparent',
        backgroundColor: '#D3D2D3',
    },
    content: {
        color: TEXT_BLACK_COLOR,
        paddingVertical: 10,
        marginLeft: 8,
        flex: 1,
    },
    txtNumber: {
        fontSize: ScaleSize(11),
        fontWeight: 'bold',
        color: BLACK_COLOR,
    },
    wrapSteps: {
        flexDirection: 'row',
        marginTop: 14,
        alignItems: 'center',
    },
    txtContent: {
        paddingHorizontal: 25,
        marginTop: 8,
        alignSelf: 'center',
        textAlign: 'center',
        lineHeight: 21,
    },
    txtHeader: {
        fontWeight: '600',
        alignSelf: 'center',
        marginTop: 24,
    },
    wrapItem: { flex: 1, width: DEVICE_WIDTH },
    wrapItemContent: { paddingHorizontal: 16 },
    fullScreen: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
    },
});
