import {Dimensions, Platform} from 'react-native';

export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const EVENT_BANNER_HEIGHT = DEVICE_WIDTH / 2;
export const SCALE_WIDTH = DEVICE_WIDTH / 375;
export const SCALE_DEVICE = Dimensions.get('window').scale;
export const SCALE_HEIGHT = DEVICE_WIDTH * SCALE_DEVICE;
export const IPHONE_4_5_WIDTH = 640;
export const isAndroid = Platform.OS === 'android';
