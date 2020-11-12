import React from 'react';
import { StyleSheet } from 'react-native';
import NavigationBar from '../components/NavigationBar';
import { BLACK_COLOR } from '../utils/Colors';
import MaxApi from '@momo-platform/max-api';
import { ScaleSize } from '@momo-platform/component-kits';

const Header = ({
    backgroundColor = null,
    title,
    onPressRight = null,
    icRight = null,
    onPressLeft = null,
    icLeft = null,
}) => {
    const onPressBack = () => {
        MaxApi.dismiss();
    };

    return (
        <NavigationBar
            statusBarColorIos={'white'}
            backgroundColor={backgroundColor}
            title={title}
            styleText={styles.textNav}
            darkContent={true}
            onPressBack={onPressLeft || onPressBack}
            onPressRightButton={onPressRight}
            iconRight={icRight}
        />
    );
};

const styles = StyleSheet.create({
    textNav: {
        flex: 1,
        color: BLACK_COLOR,
        fontWeight: 'bold',
        fontSize: ScaleSize(16),
        textAlign: 'center',
        paddingRight: 40,
    },
});

export default Header;
