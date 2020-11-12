import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { Image, HTMLView, Text, ScaleSize } from '@momo-platform/component-kits';
import { isIphoneX } from '../utils/DeviceUtils';
import { GREEN_COLOR } from '../utils/Colors';
import images from '../assets/images';
import WalkingButton from '../components/WalkingButton';
import Strings from '../utils/Strings';
import { BaseComponent } from '../components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ICON_SIZE = SCREEN_WIDTH * 0.4;
const ICON_PADDING = SCREEN_WIDTH * 0.3;

export default class WalkingRewardPopup extends BaseComponent {
    constructor(props) {
        super(props);
    }

    close = () => {
        this.props?.requestClose();
    };

    onPressClose = () => {
        this?.close();
    };

    onPressConfirm = () => {
        let { onPressConfirm, data } = this.props;
        if (data?.refId !== 'ShareScreenshot') {
            this.close();
        }
        onPressConfirm && onPressConfirm(data);
    };

    onPressCta = (onPress, disableClose) => {
        onPress?.();
        !disableClose && this.close();
    };

    render() {
        let { data } = this.props;
        let { type, htmlBody, caption, body, btnTitle, refId, extra } = data || {};

        return (
            <ScrollView bounces={false}>
                <TouchableOpacity activeOpacity={1} style={styles.root}>
                    {htmlBody && (
                        <ImageBackground
                            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
                            source={images.bg_get_badges}
                        >
                            <Image
                                style={{
                                    width: ICON_SIZE,
                                    height: ICON_SIZE,
                                    margin: ICON_PADDING,
                                }}
                                source={images.getImage(htmlBody)}
                            />
                        </ImageBackground>
                    )}
                    {caption && <Text.H2 style={styles.textTitle}>{caption}</Text.H2>}
                    {body && (
                        <HTMLView
                            style={styles.htmlContainer}
                            styleSheet={htmlStyles}
                            html={body || ''}
                        />
                    )}
                    <View style={styles.buttonsContainer}>
                        {refId && (
                            <WalkingButton
                                onPress={this.onPressConfirm}
                                title={btnTitle}
                                style={styles.btnTitle}
                            />
                        )}

                        <WalkingButton
                            onPress={this.onPressClose}
                            title={Strings.close}
                            type="border"
                            style={styles.btnClose}
                            textStyle={{ color: '#fff' }}
                        />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        paddingTop: isIphoneX() ? 60 : 35,
        height: '100%',
    },
    textTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 6,
        textAlign: 'center',
    },
    icClose: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 6,
    },
    txt_btn_close: {
        fontSize: ScaleSize(15),
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 10,
    },
    btn_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_confirm: {
        backgroundColor: GREEN_COLOR,
        borderRadius: 8,
        minWidth: 170,
        marginVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_close: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        width: 170,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        paddingHorizontal: 10,
        paddingVertical: 13,
    },
    htmlContainer: {
        marginHorizontal: 16,
        marginBottom: 8,
    },
    btnClose: { borderColor: '#fff', minWidth: 170, marginTop: 16 },
    btnTitle: { marginTop: 8, minWidth: 170 },
});

const htmlStyles = {
    b: {
        color: '#ffffff',
        fontSize: ScaleSize(14),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    strong: {
        color: '#ffffff',
        fontSize: ScaleSize(14),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    p: {
        color: '#ffffff',
        fontSize: ScaleSize(14),
        textAlign: 'center',
    },
    div: {
        color: '#ffffff',
        fontSize: ScaleSize(14),
        textAlign: 'center',
    },
};
