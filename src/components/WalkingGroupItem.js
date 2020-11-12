import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import images from '../assets/images';
import { DEVICE_WIDTH } from '../utils/Dimensions';
import { NavigatorAction } from '../screens/Walking';
import { WalkingGroupDetail } from '../screens';

const WalkingGroupItem = ({
    data,
    containerStyle,
    onPressItem,
    onPressItemDetail,
    onPressDetailCallback = null,
    homeCallback = null,
    screenName,
    depth,
    isSelected,
}) => {
    const { group } = data || {};
    let { name, slogan, avatar } = group || {};

    const renderJoinButton = (highlight = false) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        if (onPressItem) {
                            onPressItem();
                        }
                    }}
                    activeOpacity={0.7}
                    style={styles.joinOrgContainer}
                >
                    <View style={styles.joinOrgContainer}>
                        <Image
                            style={{
                                width: 25,
                                height: 25,
                            }}
                            source={highlight ? images.ic_radio_selected : images.ic_radio_default}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const onPress = () => {
        if (onPressItemDetail) {
            onPressItemDetail();
        }
        NavigatorAction?.push({
            screen: WalkingGroupDetail,
            params: {
                defaultParam: JSON.stringify(data),
                onClose: () => {
                    if (onPressDetailCallback) {
                        onPressDetailCallback();
                    }
                },
                homeCallback: homeCallback,
                depth: depth + 1,
            },
            options: {
                headerShown: false,
            },
        });
    };

    return (
        <View style={styles.container}>
            {renderJoinButton(isSelected)}
            <TouchableOpacity onPress={onPress}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: '#e8e8e8',
                        borderWidth: 2,
                        borderRadius: 8,
                        height: '80%',
                        width: (DEVICE_WIDTH * 80) / 100,
                    }}
                >
                    <ImageBackground
                        style={[styles.avatarContainer, { marginRight: 12, marginLeft: 12 }]}
                        source={images.default_group_avatar}
                    >
                        {avatar && avatar.indexOf('http') !== -1 && (
                            <Image
                                style={styles.avatarContainer}
                                source={images.getImage(avatar)}
                            />
                        )}
                    </ImageBackground>
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            height: 38,
                        }}
                    >
                        <Text.Title numberOfLines={1} style={styles.textName}>
                            {name.trim()}
                        </Text.Title>
                        <Text numberOfLines={1} style={styles.textSlogan}>
                            {slogan ? slogan.trim() : ''}
                        </Text>
                    </View>
                    <Image style={styles.arrow_right_img} source={images.ic_chevron_right} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(WalkingGroupItem);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 85,
    },
    joinOrgContainer: {
        width: 30,
        height: 30,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 7,
    },
    textSlogan: {
        color: '#18191a',
        fontSize: ScaleSize(11),
        maxWidth: 170,
    },
    avatarContainer: {
        width: 40,
        height: 40,
    },
    textName: {
        fontWeight: 'bold',
        color: '#303233',
        flex: 1,
        maxWidth: 150,
    },
    arrow_right_img: {
        width: 18,
        height: 18,
        position: 'absolute',
        right: 10,
    },
});
