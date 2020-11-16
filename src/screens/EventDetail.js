import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from '../utils/Dimensions';
import ViewMoreText from '../components/ViewMoreText';

const isWeb = Platform.OS === 'web';
const padding = isWeb ? 0 : 0;
const progressWidth = DEVICE_WIDTH - 2 * padding - 100;
const EventDetail = ({route, navigation}) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [paticipation, setPaticipation] = useState(false);
  const progressAnim = useRef(new Animated.Value(-progressWidth)).current;
  useEffect(() => {
    console.log(route.params);
    if (typeof route.params !== 'undefined') {
      setModalVisibility(route.params.success);
      setPaticipation(route.params.success);
    }
  }, [route]);

  useEffect(() => {
    expandProgress(100);
  });
  const expandProgress = (value) => {
    Animated.timing(progressAnim, {
      toValue: -progressWidth + (progressWidth * value) / 100,
      useNativeDriver: true,
      duration: 2000,
    }).start();
  };

  const ModalSuccess = () => {
    return (
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
              Chúc mừng bạn
            </Text>
            <Text>
              Bạn đã tham gia thành công sự kiên. Hãy cùng nhau cố gắng nhé!
            </Text>
            <View
              style={{
                justifyContent: 'flex-start',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibility(false);
                }}
                style={styles.acceptButton}>
                <Text style={{color: 'white'}}>Đồng ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const HeroTeam = () => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity>
            <View
              style={{
                borderWidth: 3,
                width: 20,
                height: 20,
                borderRadius: 10,
                borderColor: 'green',
                marginRight: 10,
                paddingTop: 2,
                paddingLeft: 2,
              }}>
              <View
                style={{
                  backgroundColor: 'green',
                  borderWidth: 3,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  borderColor: 'green',
                }}></View>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.heroView}
          onPress={() => {
            navigation.push('HeroTeam');
            console.log('hello');
          }}>
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={{width: 40, height: 40}}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: 'bold'}}>Heo người máy</Text>
            <Text>Hội những người "Tôi là người máy"</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const Info = ({uri, textInfo}) => {
    return (
      <View style={styles.headerInfo}>
        <View style={styles.headerDetail}>
          <Image
            source={{
              uri: uri,
            }}
            style={styles.icon}
          />
          <Text style={{paddingLeft: 10}}>{textInfo}</Text>
        </View>
      </View>
    );
  };

  const _renderEventInfo = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          backgroundColor: 'white',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            ffasdf đội siêu anh hung - Cuộc chiến vô cực (Mùa 1)
          </Text>
          <Info
            uri="https://chat.google.com/api/get_attachment_url?url_type=FIFE_URL&content_type=image%2Fpng&attachment_token=AAUuIGva26MOVbvEIHjQBDRkPBGopWny9Wrr2SFH7i3nZbllM%2Fy0QdNE6ENy8F96Fo5cyjbIfRm9eDkJpnhbF19ERWqMf%2BKha2ZLQvBOFiN3O00tygKCe4so6LgZn8Hr8ni7A0bQoZN89AS1C%2Byi14iAp1mkmyxj6FT8IWNDk%2B50pCAP5fbKTDDdxGzg8SfRbIDjFbYmIQ%2F5LMtkJ%2FKG5UXvFSqMUIEOPgNTAM2KMIJ86qLlvM7IHCx5rT0Lbs6iEsK12eAhmbVvtsQt9LqwRyFn7HVJIK9aR%2B0uFlIz7c09WrcEmTwWshCE4kQ%2BJd0peIv1H%2Biz5lW2YNe2TFOeVTl1KM3wsH%2FFuo2IlbfWBpzClUDSETDuV0MamxMuVCSzFQLU&sz=w512"
            textInfo=" 21/11 - 29/11/2020"
          />
          <Info
            uri="https://chat.google.com/api/get_attachment_url?url_type=FIFE_URL&content_type=image%2Fpng&attachment_token=AAUuIGtCrAAH3lnadgyVf57%2F%2F%2FPVoADY3qGsodc8HZZI4uhJQjc2fkyCfitFrmqmumHILCc05%2BIrJgxfS5VMq3ouBA9GRFT5%2ByxmvspwPadzkyB22iyfqnPYqKu3abRuD2TLkNLkuKRMQdUB3FPRa5Iqavuy4JgftZeihw2UtzAlG6JsvLmCm%2F%2BzkGl7yRq0fHT5YR5XP8J9%2FcTFw%2BN3Vr2u5SCUnq9v9WY7rlSyrpnooZSW58RXvlywZq5B0sL5lMj8P%2By400ndlKzl0%2BnX0zFtmX7dYlzvI2pDDY5hDvQuMtxdJJqZXr8ejX7xsUyAsnEoL4zdFOGo2KN18cijPq6dG5KD%2BopXXCNR55Yq3vnxE%2BnmFoMr7DFUAnWNBpwKZwlWWW8%3D&sz=w512"
            textInfo=" Huy hiệu Vô Cực và Heo Vàng Quyên Góp"
          />
          <Info
            uri="https://chat.google.com/api/get_attachment_url?url_type=FIFE_URL&content_type=image%2Fpng&attachment_token=AAUuIGtK8or%2BPIIMhkRZR9qioAXh%2Fg3yPmOi8HvyJBlXoA%2FMBYJNBqAI4UK%2FhVzvZb%2BhQOqg0WkBFosCbrqZCotqfTp8KH9pTW6IXnNmW%2Fu6mTrUSeBgGfYyWqmzrsz6m3jwqWlXWNejMqHIZQiue3U%2BsdlyWgOwRWFIPcPPgRDOlTwB0y4zio9eXNVAx9lUtsxZ588tytFUtdNbORPYgxZwtKjONJLY9g97L4154uwmzxMe5OnVub6Hn7rSFwbtEUTXsKq3BmF7K3h%2BrY%2FYg9PnwCy1Sdn69dglL4%2F0oqF4nLC8mBGvpB%2BqIISeOD8tiIBzU%2F4MrXbIa%2FxZ0lng4TXDfxhQiJ8%2FpdOM55AG%2Bzegz3DpCeEYfRILyvIWoJ2798ilXvZo&sz=w512"
            textInfo="Đua bước chân - Vinh danh Siêu Anh Hùng"
          />
        </View>
      </View>
    );
  };

  const renderViewMore = (onPress) => {
    return (
      <Text
        onPress={onPress}
        style={{
          textAlign: 'center',
          color: 'blue',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        Xem
      </Text>
    );
  };
  const renderViewLess = (onPress) => {
    return (
      <Text
        onPress={onPress}
        style={{
          textAlign: 'center',
          color: 'blue',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        Đóng
      </Text>
    );
  };

  const _renderEventDetail = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          backgroundColor: 'white',
          marginTop: 10,
          marginBottom: 10,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <ViewMoreText
          numberOfLines={3}
          renderViewMore={renderViewMore}
          renderViewLess={renderViewLess}
          textStyle={{fontSize: 14}}>
          <Text>
            - Tfasdfhẻ quà được tặng ngẫu nhiên về Ví MoMo của khách hàng may
            mắn chưa từng thanh toán App Store qua Ví MoMo. - Thẻ quà áp dụng
            cho thanh toán các dịch vụ trên App Store/Google Play như nạp game,
            mua vật phẩm, mua items, nâng cấp dung lượng iCloud/Google Drive và
            các ứng dụng xem phim, âm nhạc, sách báo…. - Thẻ quà giảm 20.000đ áp
            dụng cho giao dịch thanh toán App Store/Google Play từ 20.000đ. -
            Thẻ quà tặng chỉ áp dụng cho 1 lần thanh toán. - Thẻ quà sẽ được tự
            động áp dụng khi thanh toán. - Mỗi khách hàng/SĐT/Ví MoMo chỉ được
            nhận ưu đãi 01 lần trong suốt chương trình. - Thẻ quà được gửi tặng
            ngẫu nhiên đến các khách hàng may mắn qua Ví MoMo. - Thời hạn sử
            dụng 30 ngày kể từ ngày nhận được thẻ quà tặng. - Chương trình không
            áp dụng cho các khách hàng có dấu hiệu gian lận. * Xem thêm chi tiết
            các điều kiện và điều khoản tại thẻ quà. * Chương trình có thể kết
            thúc sớm hơn nếu vượt ngân sách khuyến mãi.
          </Text>
        </ViewMoreText>
      </View>
    );
  };
  const _renderEventTeam = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          backgroundColor: 'white',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          Chọn đội tham gia
        </Text>
        <Text style={{marginBottom: 10}}>
          Để tham gia, hãy chọn đội của bạn nhé
        </Text>
        <HeroTeam />
        <HeroTeam />
        <HeroTeam />
        <HeroTeam />
        <HeroTeam />
        <HeroTeam />
      </View>
    );
  };

  const _renderRating = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          backgroundColor: 'white',
          marginTop: 10,
          marginBottom: 10,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          Bảng xếp hạng đội
        </Text>
        <View
          style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={styles.icon}
          />
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={styles.icon}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 30,
              }}>
              <Text>group 1</Text>
              <Text>22.63</Text>
            </View>
            {/* <Progress.Bar
              progress={0.9}
              width={DEVICE_WIDTH - 100}
              color="pink"
              borderColor="white"
            /> */}
            <View style={styles.progressContainer}>
              <Animated.View
                style={{
                  width: progressWidth,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: true ? '#a50064' : '#7BC83F',
                  transform: [{translateX: progressAnim}],
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={styles.icon}
          />
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={styles.icon}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 30,
              }}>
              <Text>group 2</Text>
              <Text>321</Text>
            </View>
            {/* <Progress.Bar
              progress={0.1}
              width={DEVICE_WIDTH - 100}
              color="pink"
              borderColor="white"
            /> */}
            <View style={styles.progressContainer}>
              <Animated.View
                style={{
                  width: progressWidth,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: true ? '#a50064' : '#7BC83F',
                  transform: [{translateX: progressAnim}],
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _renderSelfRanking = () => {
    return (
      <View
        style={{
          paddingLeft: 10,
          backgroundColor: 'white',
          marginTop: 10,
          marginBottom: 10,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>
          Bảng xếp hạng cá nhân
        </Text>
        <View
          style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
            }}
            style={styles.icon}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: 'black',
            }}>
            <Image
              source={{
                uri:
                  'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
              }}
              style={{width: 30, height: 30}}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 30,
                  width: DEVICE_WIDTH - 120 - padding * 2,
                }}>
                <Text>PHÙ VĨNH HÙNG</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>22.63</Text>
                  <Image
                    source={{
                      uri:
                        'https://i.pinimg.com/originals/b2/2a/3e/b22a3e3ef491c790e2cc9ab7aebaa3dc.png',
                    }}
                    style={{width: 30, height: 30}}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ModalSuccess />
      <ScrollView>
        <View>
          <Image
            source={{
              uri:
                'https://img.mservice.io/momo_app_v2/new_version/img/Product_Engagement/20200921_walk_event_uprace_greenviet_banner.png',
            }}
            style={styles.banner}
          />
        </View>
        <View style={styles.containerInfo}>
          <_renderEventInfo />
          {!paticipation ? (
            <View>
              <_renderEventDetail />
              <_renderEventTeam />
            </View>
          ) : (
            <View>
              <_renderRating />
              <_renderSelfRanking />
            </View>
          )}
        </View>
      </ScrollView>
      {!isWeb ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
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
      ) : (
        <View>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
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

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000015',
  },
  containerInfo: {
    paddingLeft: padding,
    // width: DEVICE_WIDTH - padding,
  },
  banner: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
  },
  headerInfo: {
    paddingTop: 10,
  },
  headerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  radioButton: {},
  heroView: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 10,
    width: DEVICE_WIDTH - 2 * padding - 50,
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
  progressContainer: {
    height: 4,
    width: progressWidth,
    borderRadius: 2,
    marginTop: 4,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
});

export default EventDetail;
