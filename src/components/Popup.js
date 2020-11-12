import React, { PureComponent } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { HTMLView, Text, ScaleSize } from '@momo-platform/component-kits';
import { PRIMAY_COLOR_2, GRAY_COLOR_3, GRAY_COLOR_6 } from '../utils/Colors';
import images from '../assets/images';

const IMAGE_SIZE = 90;

export default class Popup extends PureComponent {
    static defaultProps = {
        msg: '',
        title: '',
    };

    render() {
        let iconPopup = images.ic_tick_popup;
        const { icon, iconPig, cancelTitle, confirmTitle, title, msg, requestClose } = this.props;
        if (icon) {
            iconPopup = images.getImage(icon);
        }
        if (iconPig) {
            iconPopup = images.ic_piggy_popup;
        }
        return (
            <View>
                <View style={styles.wrapHeader}>
                    <View style={styles.popup} />
                    <Image style={styles.imgIcon} source={iconPopup} />
                </View>

                <View style={styles.popupContainer}>
                    <View style={styles.headerContainer}>
                        <Text.H3 style={styles.headerText}>{title}</Text.H3>
                    </View>

                    <View style={styles.headerContainer}>
                        <HTMLView value={msg} stylesheet={styles.html} />
                    </View>

                    <View style={styles.footerContainer}>
                        {!!cancelTitle && (
                            <TouchableOpacity
                                style={styles.footerButtonContainer}
                                onPress={requestClose}
                            >
                                <Text style={styles.cancelButton}>{cancelTitle}</Text>
                            </TouchableOpacity>
                        )}
                        {!!confirmTitle && (
                            <TouchableOpacity
                                style={styles.footerButtonContainer}
                                onPress={this._onPressConfirm}
                            >
                                <Text style={styles.confirmButton}>{confirmTitle}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    _onPressConfirm = () => {
        const { requestClose, onPressConfirm } = this.props;
        requestClose();
        onPressConfirm?.();
    };
}

const styles = {
    wrapHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: IMAGE_SIZE / 2,
        // width: BasePopup.POPUP_WIDTH,
        height: IMAGE_SIZE / 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    imgIcon: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        resizeMode: 'contain',
    },
    popupContainer: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    headerContainer: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerText: {
        fontWeight: 'bold',
        color: GRAY_COLOR_3,
    },
    contentContainer: {
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    html: {
        b: {
            fontSize: 16,
            color: GRAY_COLOR_3,
            fontWeight: 'bold',
        },
        p: {
            fontSize: 16,
            color: GRAY_COLOR_3,
        },
    },
    footerContainer: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    footerButtonContainer: {
        paddingLeft: 20,
        paddingTop: 15,
    },
    confirmButton: {
        fontSize: ScaleSize(18),
        color: PRIMAY_COLOR_2,
        fontWeight: '400',
    },
    cancelButton: {
        fontSize: ScaleSize(18),
        color: GRAY_COLOR_6,
        fontWeight: '400',
    },
};
