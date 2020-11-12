/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import images from '../assets/images';
import moment from 'moment';
import { getStringNumber } from '../utils/StringUtils';
import WalkingHelper from '../api/WalkingHelper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = SCREEN_WIDTH / 3.5;
const ICON_SIZE = ITEM_SIZE / 2;

const BadgeItem = ({ data, onPress, itemSize }) => {
    if (!data) {
        return null;
    }

    const { name = '', icon, iconDisable, unlocked, unlockedDate, stepDone, stepTarget } =
        data || {};

    let content = unlocked
        ? unlockedDate && !isNaN(moment(unlockedDate)) && moment(unlockedDate).format('DD/MM/YYYY')
        : `${getStringNumber(stepDone, true)}/${getStringNumber(stepTarget, true)}`;

    const onPressBadges = () => {
        onPress?.(data);
        WalkingHelper.showBadgePopup(data);
    };

    return (
        <TouchableOpacity
            style={{
                width: itemSize || ITEM_SIZE,
                alignItems: 'center',
                paddingHorizontal: 8,
            }}
            onPress={onPressBadges}
        >
            <Image
                style={{
                    width: itemSize ? itemSize / 2 : ICON_SIZE,
                    height: itemSize ? itemSize / 2 : ICON_SIZE,
                    margin: 8,
                }}
                source={images.getImage(unlocked ? icon : iconDisable)}
            />
            <Text numberOfLines={2} style={styles.textName}>
                {name}
            </Text>
            <Text numberOfLines={3} style={styles.textContent}>
                {content}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textName: {
        fontSize: ScaleSize(11),
        fontWeight: 'bold',
        color: '#18191a',
        textAlign: 'center',
    },
    textContent: {
        fontSize: ScaleSize(11),
        color: '#797c80',
        marginTop: 4,
        marginBottom: 8,
        textAlign: 'center',
    },
});

export default BadgeItem;
