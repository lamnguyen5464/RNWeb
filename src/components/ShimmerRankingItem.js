import React from 'react';
import { View, StyleSheet } from 'react-native';

import ShimmerPlaceHolder from '../components/ShimmerPlaceHolder';

const ShimmerRankingItem = ({ showDivider = true }) => {
    return (
        <View style={loadingStyles.itemContainer}>
            <ShimmerPlaceHolder style={loadingStyles.icon} autoRun={true} />
            <ShimmerPlaceHolder style={loadingStyles.avatar} autoRun={true} />
            <ShimmerPlaceHolder style={loadingStyles.name} autoRun={true} />
            <ShimmerPlaceHolder style={loadingStyles.step} autoRun={true} />
            <ShimmerPlaceHolder style={loadingStyles.iconSmall} autoRun={true} />
            {showDivider && <View style={loadingStyles.divider} />}
        </View>
    );
};

const loadingStyles = StyleSheet.create({
    itemContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 12,
        paddingVertical: 12,
    },
    header: {
        width: '70%',
        height: 24,
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 12,
        borderRadius: 4,
        borderWidth: 0,
    },
    divider: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 0.5,
        backgroundColor: '#bbbbbb',
        flexDirection: 'row',
        marginRight: 12,
        marginLeft: 34,
        borderRadius: 4,
        borderWidth: 0,
    },
    icon: {
        margin: 7,
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 0,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 0,
    },
    name: {
        flex: 1,
        marginRight: 8,
        marginLeft: 8,
        borderRadius: 4,
        borderWidth: 0,
    },
    step: {
        width: 36,
        height: 14,
        borderRadius: 4,
        borderWidth: 0,
    },
    iconSmall: {
        width: 18,
        height: 18,
        marginLeft: 6,
        marginRight: 12,
        borderRadius: 4,
        borderWidth: 0,
    },
});

export default ShimmerRankingItem;
