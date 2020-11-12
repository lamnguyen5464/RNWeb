/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from '@momo-platform/component-kits';
import images from '../assets/images';
import { IPopup } from '../utils/PropsType';
import { isIphoneX } from '../utils/DeviceUtils';
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../utils/DeviceUtils';
import { BaseComponent } from '../components';

const POPUP_HEIGHT = DEVICE_HEIGHT - (isIphoneX() ? 44 : 0);
const IMAGE_CONTAINER_WIDTH = DEVICE_WIDTH - 40;
const IMAGE_CONTAINER_HEIGHT = POPUP_HEIGHT * 0.74;

export default class WalkingBannerPopup extends BaseComponent<IPopup> {
    constructor(props) {
        super(props);
    }

    close() {
        this.props.requestClose();
    }

    onPressClose(data) {
        this.props.onPressClose && this.props.onPressClose(data);
        this.close();
    }

    onPress(data) {
        this.props.onPress && this.props.onPress(data);
        this.close();
    }

    render() {
        let data = this.props.data || {};
        const imageRatio = (data.width || 1) / (data.height || 1);
        const w1 = IMAGE_CONTAINER_WIDTH;
        const h1 = w1 / imageRatio;
        const h2 = IMAGE_CONTAINER_HEIGHT;
        const w2 = h2 * imageRatio;
        let imageWidth, imageHeight;
        if (w1 < w2) {
            imageWidth = w1;
            imageHeight = h1;
        } else {
            imageWidth = w2;
            imageHeight = h2;
        }

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    paddingTop: POPUP_HEIGHT * 0.1,
                    width: DEVICE_WIDTH,
                    height: POPUP_HEIGHT,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    style={{
                        width: IMAGE_CONTAINER_WIDTH,
                        height: IMAGE_CONTAINER_HEIGHT,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        borderWidth: 0,
                    }}
                    onPress={() => this.onPress(data)}
                >
                    <Image
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            borderRadius: 10,
                            borderWidth: 0,
                        }}
                        source={images.getImage(data.htmlBody || '')}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        width: DEVICE_WIDTH,
                        height: POPUP_HEIGHT * 0.1,
                        marginVertical: POPUP_HEIGHT * 0.03,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity onPress={() => this.onPressClose(data)}>
                        <Image
                            style={{ width: 40, height: 50, resizeMode: 'contain' }}
                            source={images.ic_close_circle}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}
