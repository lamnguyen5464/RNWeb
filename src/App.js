import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {PRIMAY_COLOR, GREEN_COLOR, BLACK_COLOR} from './utils/Colors';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from './utils/Dimensions';
import images from './assets/images';

const App = () => {
  const _renderStepInfo = () => {
    return (
      <View style={styles.containerStepInfo}>
        <Text>Hom naykjlkjkj</Text>
        <Text style={{fontWeight: 'bold', color: PRIMAY_COLOR, fontSize: 20}}>
          0
        </Text>
        <View
          style={{
            height: 1,
            width: DEVICE_WIDTH * 0.05,
            backgroundColor: BLACK_COLOR,
          }}
        />
        <Text>4000</Text>
      </View>
    );
  };
  const _renderRewardItem = (step, des, isLast) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            marginLeft: 3,
            width: 1,
            height: isLast ? 0 : 0,
            position: 'absolute',
            backgroundColor: BLACK_COLOR,
          }}
        />
        <Image source={images.ic_checked} style={{width: 15, height: 15}} />
        <View style={{marginLeft: 10}}>
          <Text style={{fontSize: 17}}>{step} buoc</Text>
          <Text style={{fontSize: 12}}>{des}</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: GREEN_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: 5,
          }}
          onPress={() => {
            console.log('Pressed taking');
          }}>
          <Text>Nhan</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const _renderUserInfo = () => {
    return (
      <View style={styles.containerUserInfo}>
        <View style={styles.containerInfo}>
          <View style={styles.avatar} />
          <Text style={styles.textUserName}>Nguyen Truong Lam</Text>
        </View>
        <View style={styles.containerProgress}>
          <View style={styles.progressCicle}>{_renderStepInfo()}</View>
          <View style={{justifyContent: 'space-between'}}>
            {_renderRewardItem(50, 'Nhan 100g thuc an', false)}
            {_renderRewardItem(100, 'Nhan 100g thuc an', false)}
            {_renderRewardItem(100, 'Nhan 100g thuc an', true)}
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Di bo cung MoMo</Text>
      </View>
      <ScrollView>{_renderUserInfo()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  containerUserInfo: {
    height: DEVICE_HEIGHT,
    backgroundColor: '#fff',
    padding: DEVICE_WIDTH * 0.02,
  },
  containerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'green',
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  textUserName: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  containerProgress: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  progressCicle: {
    borderColor: '#2f2f2f60',
    borderWidth: 5,
    width: DEVICE_WIDTH * 0.35,
    height: DEVICE_WIDTH * 0.35,
    borderRadius: DEVICE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStepInfo: {
    width: DEVICE_WIDTH * 0.32,
    height: DEVICE_WIDTH * 0.32,
    borderRadius: DEVICE_WIDTH,
    backgroundColor: '#6aba2e30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
