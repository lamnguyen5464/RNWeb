import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, Text, ScaleSize } from '@momo-platform/component-kits';
import { TEXT_COLOR_2 } from '../utils/Colors';
import images from '../assets/images';
import Strings from '../utils/Strings';

const WalkingFooter = ({ description = Strings.seenAll }) => {
    return (
        <View style={styles.wrapFooter}>
            <Image source={images.ic_walking_gray} style={styles.imgFooter} />
            {!!description && <Text style={styles.txtFooter}>{description}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapFooter: { alignItems: 'center', flex: 1, paddingVertical: 24, backgroundColor: '#fff' },
    txtFooter: { marginTop: 8, fontSize: ScaleSize(11), color: TEXT_COLOR_2 },
    imgFooter: { width: 120, height: 120 },
});

export default React.memo(WalkingFooter);
