import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@momo-platform/component-kits';
import { GREEN_COLOR, TEXT_COLOR_2 } from '../utils/Colors';
import { debounce } from 'lodash';

const WalkingButton = ({ onPress = () => {}, style, textStyle, title, type = 'full', loading }) => {
    const onPressDebound = debounce(onPress, { leading: true, trailing: false });
    const isOnlyText = type === 'text';
    const isBorder = type === 'border';
    let textColor = '#fff';
    if (isOnlyText) {
        textColor = TEXT_COLOR_2;
    }
    if (isBorder) {
        textColor = GREEN_COLOR;
    }
    return (
        <TouchableOpacity
            disabled={loading}
            onPress={onPressDebound}
            activeOpacity={0.8}
            style={[
                styles.btnAccept,
                isOnlyText && styles.bgTransparent,
                isBorder && styles.border,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text.Title style={[styles.txtAccept, { color: textColor }, textStyle]}>
                    {title}
                </Text.Title>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btnAccept: {
        backgroundColor: GREEN_COLOR,
        height: 36,
        paddingHorizontal: 26,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtAccept: {
        color: '#fff',
        fontWeight: 'bold',
    },
    bgTransparent: { backgroundColor: 'transparent' },
    txtTitle: { color: TEXT_COLOR_2 },
    border: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: GREEN_COLOR,
    },
    txtBorder: { color: GREEN_COLOR },
});

export default WalkingButton;
