import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import images from '../assets/images';
import { GREEN_COLOR_2 } from '../utils/Colors';
import { IPopup } from '../utils/PropsType';
import { POPUP_TYPE_CONFIRM_JOIN_GROUP } from '../utils/Const';
import WalkingButton from '../components/WalkingButton';
import BaseComponent from './BaseComponent';
import { WALKING_JOINED_EVENT } from '../utils/EventTypes';
import { DEVICE_WIDTH } from '../utils/Dimensions';

const POPUP_WIDTH = DEVICE_WIDTH - 50;

export default class WalkingInfoPopup extends BaseComponent<IPopup> {
    constructor(props) {
        super(props);

        this.closeListener = null;
    }

    componentDidMount() {
        if (!this.closeListener && this.props.closeOnEvent) {
            this.closeListener = DeviceEventEmitter.addListener(WALKING_JOINED_EVENT, () => {
                this.close();
            });
        }
    }

    componentWillUnmount() {
        this.closeListener?.remove?.();
    }

    close = callback => {
        this.props.requestClose();
        if (callback) {
            callback();
        }
    };

    onPressClose = () => {
        this.close();
    };

    onPressConfirm = () => {
        this.close();
        let { onPressConfirm, data } = this.props;
        onPressConfirm && onPressConfirm(data);
    };

    onPressCta = (onPress, disableClose) => {
        if (disableClose) {
            onPress?.();
        } else {
            this.close(onPress);
        }
    };

    renderButton = button => {
        if (!button) {
            return null;
        }
        const { title, highlight, onPress, disableClose } = button;
        return (
            <WalkingButton
                title={title}
                onPress={() => this.onPressCta(onPress, disableClose)}
                type={highlight ? 'full' : 'border'}
                style={styles.btnItem}
            />
        );
    };

    render() {
        let { data } = this.props;
        let {
            title,
            titleStyle,
            desc,
            descStyle,
            type,
            groupName,
            bannerSource,
            bannerUrl,
            bannerStyle,
            buttons,
            resizeMode,
            noClose = false,
        } = data || {};
        let source;
        if (bannerSource) {
            source = bannerSource;
        } else if (bannerUrl) {
            source = images.getImage(bannerUrl);
        }

        return (
            <View style={styles.root}>
                <View style={styles.container}>
                    {source && (
                        <View style={styles.center}>
                            <Image
                                resizeMode={resizeMode || 'cover'}
                                style={[styles.banner, bannerStyle || {}]}
                                source={source}
                            />
                        </View>
                    )}
                    <View style={styles.textContainer}>
                        {!!title && (
                            <Text.H4 style={[styles.textTitle, titleStyle || {}]}>{title}</Text.H4>
                        )}
                        {!!desc && type !== POPUP_TYPE_CONFIRM_JOIN_GROUP && (
                            <Text style={[styles.desc, descStyle || {}]}>{desc}</Text>
                        )}
                        {!!desc && type === POPUP_TYPE_CONFIRM_JOIN_GROUP && groupName && (
                            <Text style={[styles.desc, descStyle]}>
                                {desc.split('@')[0]}
                                <Text style={{ color: GREEN_COLOR_2, fontWeight: 'bold' }}>
                                    {groupName}
                                </Text>
                                {desc.split('@')[1]}
                            </Text>
                        )}
                        <View />
                    </View>
                    <View style={styles.buttonsContainer}>
                        {!!buttons?.[0] && this.renderButton(buttons[0])}
                        {!!buttons?.[1] && this.renderButton(buttons[1])}
                    </View>
                </View>
                {!noClose && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this.onPressClose}
                        style={styles.btnClose}
                    >
                        <Image source={images.ic_close} style={styles.iconClose} />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        paddingTop: 10,
    },
    container: {
        width: POPUP_WIDTH,
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: 12,
    },
    textTitle: {
        color: '#222222',
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginTop: 5,
    },
    desc: {
        color: '#222222',
        fontSize: ScaleSize(15),
        marginTop: 16,
        marginHorizontal: 10,
    },
    btnClose: {
        position: 'absolute',
        right: -1,
        top: -1,
        borderWidth: 3,
        borderColor: '#fff',
        width: 26,
        height: 26,
        borderRadius: 26 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconClose: { width: 24, height: 24 },
    banner: {
        width: POPUP_WIDTH,
        height: POPUP_WIDTH * (170 / 325),
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 0,
    },
    buttonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 20,
        paddingTop: 10,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        paddingHorizontal: 10,
        paddingVertical: 13,
    },
    btnItem: { flex: 1, marginHorizontal: 5 },
});
