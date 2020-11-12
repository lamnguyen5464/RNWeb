import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Animated } from 'react-native';
import WalkingRankingItem from './WalkingRankingItem';
import { isIphoneX } from '../utils/DeviceUtils';
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../utils/Dimensions';

const ITEM_WIDTH = DEVICE_WIDTH - 24;

const UserInfoBottomAnimatedForwardRef = forwardRef((props, ref) => {
    const visibleAnimation = useRef(new Animated.Value(0)).current;
    const show = () => {
        Animated.timing(visibleAnimation, { toValue: 1, duration: 100 }).start();
    };

    const hide = () => {
        Animated.timing(visibleAnimation, { toValue: 0, duration: 100 }).start();
    };

    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    const bottom = visibleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-DEVICE_HEIGHT, 0],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={{
                width: ITEM_WIDTH,
                position: 'absolute',
                bottom: bottom,
                marginHorizontal: 12,
            }}
        >
            <WalkingRankingItem
                {...props}
                containerStyle={styles.itemContainer}
                hideDivider={true}
                rounded={true}
            />
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: isIphoneX() ? 25 : 10,
        width: ITEM_WIDTH,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 8,
        borderWidth: 0,
        elevation: 4,
        backgroundColor: 'white',
    },
});

export default UserInfoBottomAnimatedForwardRef;
