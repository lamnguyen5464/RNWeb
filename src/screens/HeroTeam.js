import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from '../utils/Dimensions';

const isWeb = Platform.OS === 'web';
const padding = isWeb ? 300 : 0;
const HeroTeam = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibility}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{backgroundColor: '#00000050', paddingBottom: 500}}>
          <View style={styles.modal}>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}}>
              Xác nhận tham gia đội
            </Text>
            <Text>
              Bạn đang tham gia đội siêu nhân, số bước chân trong sự kiện của
              bạn sẽ chỉ được tính cho đội này. Bạn không thể thay đổi đội trong
              sự kiện
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibility(false);
                }}
                style={styles.cancleButton}>
                <Text style={{color: 'green'}}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibility(false);
                }}
                style={styles.acceptButton}>
                <Text style={{color: 'white'}}>Tham gia</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{backgroundColor: 'white'}}>
        <Image
          source={{
            uri:
              'https://img.mservice.io/momo_app_v2/new_version/img/Product_Engagement/20200921_walk_event_uprace_greenviet_banner.png',
          }}
          style={styles.banner}
        />
        <View>
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Heo Thần sấm</Text>
          <Text style={styles.subTitle}>
            Hội những người quyết tâm đi bộ giảm cân
          </Text>
          <Text style={styles.member}>1797 thành viền</Text>
        </View>
      </View>

      <View style={styles.logan}>
        <Text>
          {`Chúng ta là ai? Team Heo thần sấm \nChúng ta muốn gi? Giảm cân giữ dáng \nChúng ta làm gì? Vào team đi bộ \nChiến thắng, chiến thắng, chiến thắng
              `}
        </Text>
      </View>
      {!isWeb ? (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Text
              style={{
                textAlign: 'center',
                //   fontWeight: 'bold',
                fontSize: 20,
                color: 'white',
              }}
              onPress={() => {
                console.log('Hello');
                setModalVisibility(true);
              }}>
              Tham gia
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              console.log('Hello');
              setModalVisibility(true);
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                //   fontWeight: 'bold',
                fontSize: 20,
              }}>
              Tham gia
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000015',
  },
  banner: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
  },
  avatar: {
    width: 100,
    height: 100,
    left: DEVICE_WIDTH / 2 - 50,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 50,
    marginTop: -50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
  },
  subTitle: {
    paddingTop: 10,
    textAlign: 'center',
  },
  member: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 10,
    paddingBottom: 10,
  },
  logan: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 30,
    backgroundColor: 'white',
    height: DEVICE_HEIGHT / 2,
  },
  footer: {
    position: 'absolute',
    height: 200,
    left: 0,
    top: DEVICE_HEIGHT - 180,
    width: DEVICE_WIDTH,
    backgroundColor: 'white',
  },
  footerButton: {
    justifyContent: 'center',
    backgroundColor: 'green',
    height: 40,
    margin: 10,
    borderRadius: 10,
  },
  modal: {
    padding: 20,
    backgroundColor: 'white',
    width: DEVICE_WIDTH - 2 * padding - 20,
    marginLeft: padding + 10,
    marginTop: DEVICE_HEIGHT / 3,
    borderRadius: 10,
  },
  cancleButton: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green',
    width: (DEVICE_WIDTH - 2 * padding) / 2 - 50,
    height: 50,
    color: 'green',
  },
  acceptButton: {
    backgroundColor: 'green',
    borderWidth: 1,
    borderRadius: 10,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green',
    width: (DEVICE_WIDTH - 2 * padding) / 2 - 50,
    height: 50,
  },
});
export default HeroTeam;
