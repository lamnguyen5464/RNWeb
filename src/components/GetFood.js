import React from 'react';
import { View, ImageBackground, StyleSheet, Image } from 'react-native';
import { Text, ScaleSize } from '@momo-platform/component-kits';
import MaxApi from '@momo-platform/max-api';
import { DEVICE_HEIGHT } from '../utils/Dimensions';
import { IPopup } from '../utils/PropsType';
import images from '../assets/images';
import WalkingHelper from '../api/WalkingHelper';
import BaseComponent from '../components/BaseComponent';
import WalkingButton from '../components/WalkingButton';
import { WALKING_EVENT_NAME } from '../utils/Const';
import Strings from '../utils/Strings';

export default class WalkingGetFoodPopup extends BaseComponent<IPopup> {
    constructor(props) {
        super(props);
    }

    onPressClose = () => {
        this.closePopup(_ => {});
    };

    onPressConfirm = () => {
        this.closePopup(_ => {
            let { refId, targetValue, isGoldenPig } = this.props.popupData || {};
            MaxApi.trackEvent(WALKING_EVENT_NAME, {
                action: 'click_popup_receive',
                info1: `click_popup_receive_${targetValue}_${isGoldenPig ? 'feedpig' : 'cashback'}`,
                info2: refId,
            });
            WalkingHelper.onClickServiced({ refId });
        });
    };

    closePopup(callback = null) {
        let { requestClose } = this.props;
        requestClose(() => {
            callback && callback();
        });
    }

    render() {
        let { body, subTitle, title, btnTitle, refId, img } = this.props.popupData || {};
        const source = images.getImage(img);

        return (
            <View style={styles.container}>
                <ImageBackground source={images.bg_get_food} style={styles.bg} resizeMode="stretch">
                    <Text style={[styles.txt_level, styles.title]}>{title}</Text>
                    <Image source={source} style={styles.img} resizeMode={'contain'} />
                    <Text style={[styles.txt_level, styles.subTitle]}>{subTitle}</Text>
                    <Text.H4 style={styles.txt_content}>{`${body || Strings.youGetFood}`}</Text.H4>
                </ImageBackground>

                <View style={styles.btn_container}>
                    {!!(btnTitle && refId) && (
                        <WalkingButton
                            onPress={this.onPressConfirm}
                            title={btnTitle}
                            style={styles.txtTitle}
                        />
                    )}
                    <WalkingButton
                        onPress={this.onPressClose}
                        title={Strings.close}
                        type="border"
                        style={styles.txtClose}
                        textStyle={{ color: '#fff' }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btn_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bg: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    txt_content: {
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 24,
        marginTop: 12,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    txt_level: {
        fontSize: ScaleSize(28),
        color: '#FBC34B',
        backgroundColor: 'transparent',
        fontWeight: '900',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#0000001A',
    },
    title: {
        paddingTop: DEVICE_HEIGHT * 0.1,
        marginHorizontal: 24,
    },
    subTitle: {
        fontWeight: 'bold',
        fontSize: ScaleSize(22),
        marginTop: 20,
    },
    img: {
        width: 150,
        height: 150,
        marginTop: 20,
    },
    txtTitle: {
        marginTop: 8,
        minWidth: 170,
    },
    txtClose: {
        borderColor: '#fff',
        minWidth: 170,
        marginTop: 16,
    },
});
