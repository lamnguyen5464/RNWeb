import React, { PureComponent } from 'react';
import {
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Animated,
    Animation,
    StatusBar,
} from 'react-native';
import DeviceUtils from '../utils/DeviceUtils';
import MaxApi from '@momo-platform/max-api';
import { GRAY_COLOR_3 } from '../utils/Colors';
import { isAndroid } from '../utils/Dimensions';
import images from '../assets/images';
import { ScaleSize } from '@momo-platform/component-kits';

const NAV_BAR_HEIGHT = 50;

interface INavigationBar {
    scrollY?: Animation;
    darkContent: Boolean;
    transform: any;
    onPressBack?: Function;
}
export default class NavigationBar extends PureComponent<INavigationBar> {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            isIphoneX: DeviceUtils.isIphoneX(),
            darkContent: this.props.darkContent || false,
            transform: this.props.transform,
        };
    }

    setVisible = visible => {
        this.setState({ visible });
    };

    onPressBack = () => {
        const { onPressBack } = this.props;
        if (onPressBack) {
            onPressBack();
            return;
        }

        MaxApi.dismiss();
    };

    renderLeftButton(darkContent = true) {
        const { ic_back, buttonIcon } = this.props;
        const icBack = ic_back
            ? ic_back
            : Platform.select({
                  ios: images.ic_back_ios,
                  android: images.ic_back_android,
              });

        return (
            <TouchableOpacity
                style={[
                    styles.buttonContainer,
                    { position: 'absolute', top: 0, bottom: 0, left: 0 },
                ]}
                onPress={this.onPressBack}
            >
                <Image style={[styles.buttonIcon, buttonIcon, styles.leftIcon]} source={icBack} />
            </TouchableOpacity>
        );
    }

    renderRightButton(darkContent = true) {
        const { onPressRightButton, darkIconInfo, iconRight } = this.props;
        if (!onPressRightButton) {
            return null;
        }

        let icInfo = darkContent
            ? darkIconInfo
                ? darkIconInfo
                : images.ic_info_outline
            : images.ic_info;

        const icon = iconRight || icInfo;

        return (
            <TouchableOpacity
                style={[
                    styles.buttonContainer,
                    {
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                    },
                ]}
                onPress={onPressRightButton}
            >
                <Image style={styles.buttonIcon} source={icon} />
            </TouchableOpacity>
        );
    }

    render() {
        const { scrollY, statusBarColorIos, backgroundColor } = this.props;
        if (!this.state.visible) {
            return (
                <View
                    style={{
                        height: Platform.OS === 'ios' ? (this.state.isIphoneX ? 44 : 20) : 0,
                        backgroundColor: statusBarColorIos
                            ? statusBarColorIos
                            : backgroundColor
                            ? backgroundColor
                            : 'transparent',
                    }}
                />
            );
        }

        const navigationOpacity = scrollY?.interpolate({
            inputRange: [0, NAV_BAR_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        const navigationOpacity2 = scrollY?.interpolate({
            inputRange: [0, NAV_BAR_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <View
                style={[
                    this.props.style,
                    isAndroid
                        ? {
                              top: Math.round(StatusBar.currentHeight),
                              paddingBottom: Math.round(StatusBar.currentHeight),
                          }
                        : {},
                ]}
            >
                {this.state.transform ? (
                    <Animated.View
                        style={{
                            opacity: navigationOpacity2,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <Animated.View
                            style={{
                                height:
                                    Platform.OS === 'ios' ? (this.state.isIphoneX ? 44 : 20) : 0,
                                backgroundColor: this.props.statusBarColorIos
                                    ? this.props.statusBarColorIos
                                    : 'white',
                            }}
                        />

                        <Animated.View style={[styles.navContainer, { backgroundColor: 'white' }]}>
                            <Text
                                style={[
                                    styles.textHeader,
                                    { color: GRAY_COLOR_3 },
                                    this.props.styleText ? this.props.styleText : {},
                                ]}
                            >
                                {this.props.title ? this.props.title : ' '}
                            </Text>
                            {this.renderLeftButton(true)}
                            {this.renderRightButton(true)}
                        </Animated.View>
                    </Animated.View>
                ) : null}

                <Animated.View style={{ opacity: navigationOpacity }}>
                    <Animated.View
                        style={{
                            height: Platform.OS === 'ios' ? (this.state.isIphoneX ? 44 : 20) : 0,
                            backgroundColor: this.props.statusBarColorIos
                                ? this.props.statusBarColorIos
                                : this.props.backgroundColor
                                ? this.props.backgroundColor
                                : 'transparent',
                        }}
                    />

                    <Animated.View
                        style={[
                            styles.navContainer,
                            {
                                backgroundColor: this.props.backgroundColor
                                    ? this.props.backgroundColor
                                    : 'transparent',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.textHeader,
                                {
                                    color: this.state.darkContent ? GRAY_COLOR_3 : '#fff',
                                },
                                this.props.styleText ? this.props.styleText : {},
                            ]}
                        >
                            {this.props.title ? this.props.title : ' '}
                        </Text>
                        {this.renderLeftButton(this.state.darkContent)}
                        {this.renderRightButton(this.state.darkContent)}
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        height: NAV_BAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 40,
        height: NAV_BAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    buttonIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    textHeader: {
        flex: 1,
        fontSize: ScaleSize(16),
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    leftIcon: Platform.select({
        ios: {
            width: 24,
            height: 24,
            tintColor: 'black',
            marginLeft: 10,
        },
        android: {
            width: 24,
            height: 24,
            tintColor: 'black',
            marginLeft: 24,
        },
    }),
});
