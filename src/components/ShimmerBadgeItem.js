/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';

import ShimmerPlaceHolder from './ShimmerPlaceHolder';
import { DEVICE_WIDTH } from '../utils/Dimensions';

const ITEM_SIZE = DEVICE_WIDTH / 3.5;

const ShimmerBadgeItem = ({ itemSize = ITEM_SIZE, showDivider = true }) => {
    return (
        <View
            style={{
                width: ITEM_SIZE,
                padding: 8,
                alignItems: 'center',
                marginBottom: 4,
            }}
        >
            <ShimmerPlaceHolder
                style={{
                    width: itemSize / 2,
                    height: itemSize / 2,
                    marginBottom: 4,
                    borderRadius: 4,
                    borderWidth: 0,
                }}
                autoRun={true}
            />
            <ShimmerPlaceHolder
                style={{
                    marginTop: 4,
                    width: itemSize - 16,
                    borderRadius: 4,
                    borderWidth: 0,
                }}
                autoRun={true}
            />
            <ShimmerPlaceHolder
                style={{
                    marginTop: 4,
                    width: itemSize - 16,
                    borderRadius: 4,
                    borderWidth: 0,
                }}
                autoRun={true}
            />
        </View>
    );
};

export default ShimmerBadgeItem;