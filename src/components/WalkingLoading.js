import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingPopup, Flex } from '@momo-platform/component-kits';
import Header from '../components/Header';
import images from '../assets/images';
import { GREEN_COLOR_4 } from '../utils/Colors';
import MaxApi from '@momo-platform/max-api';

const WalkingLoading = ({ title = null }) => {
    return (
        <Flex style={{ flex: 1 }}>
            <Header title={title || ''} onPressLeft={() => MaxApi.dismiss()} />
            <View pointerEvents="none" style={styles.wrapLoading}>
                <LoadingPopup size={96} icon={images.ic_walking_green} color={GREEN_COLOR_4} />
            </View>
        </Flex>
    );
};

const styles = StyleSheet.create({
    wrapLoading: {
        marginTop: -100,
    },
});
export default React.memo(WalkingLoading);
