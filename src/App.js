import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  PRIMAY_COLOR,
  GREEN_COLOR,
  BLACK_COLOR,
  GREEN_COLOR_3,
  GREEN_COLOR_4,
  GRAY_COLOR,
  GRAY_COLOR_6,
  GRAY_COLOR_4,
} from './utils/Colors';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from './utils/Dimensions';
import {isWeb} from './utils/DeviceUtils';

// import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import {Link} from '@react-navigation/web';

const Stack = createStackNavigator();

const navigationContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="App"
          component={App}
          options={{title: 'Di bo cung momo'}}
        />
        <Stack.Screen
          name="tmpScreen"
          component={tmpScreen}
          options={{title: 'tmpScreen'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const tmpScreen = () => {
  return (
    <View>
      <Text>test</Text>
    </View>
  );
};

const App = ({navigation}) => {
  const padding = isWeb ? 300 : 0;
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
      <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
        <View
          style={{
            marginLeft: 6,
            width: 1,
            height: isLast ? 0 : DEVICE_HEIGHT * 0.35,
            position: 'absolute',
            backgroundColor: BLACK_COLOR,
          }}
        />
        <Image
          source={{
            uri:
              'https://lh3.googleusercontent.com/proxy/KXcJ-gSEh308WLiJ-Sa2sGM8sD7HUITzGSJWNjl-dZgxh5DzYgBKjN3lShIUI3tUx24AuvBl--Jd8gXc3f-Qj2CxPD2PfcOJvlyD_fUmwTcvgWoBOng',
          }}
          style={{width: 15, height: 15}}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{fontSize: 17, color: '#2f2f2f50'}}>{step} buoc</Text>
          <Text style={{fontSize: 12, color: '#2f2f2f50'}}>{des}</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: GREEN_COLOR_4,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            padding: 5,
            marginLeft: 20,
          }}
          nPress={() => {
            console.log('here');
            // navigation.push('tmpScreen');
          }}>
          <Text style={{color: 'white'}}>Nhan</Text>
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

  const _renderTabbarAnimation = (
    tabs = [],
    tabWidth = 60,
    onChangeTab,
    disabled,
  ) => {
    const [page, setPage] = React.useState(0);
    const positionAnimation = React.useRef(new Animated.Value(0)).current;
    const onPressItem = (index) => () => {
      if (index === page) {
        return;
      }
      setPage(index);
      Animated.timing(positionAnimation, {
        toValue: index * tabWidth + (index === 0 ? 0 : index * 10),
        duration: 150,
      }).start();
      onChangeTab?.(index);
    };
    const renderTab = (item, index) => {
      const isActive = page === index;
      const marginLeft = index === 0 ? 0 : 10;
      return (
        <TouchableOpacity
          disabled={disabled}
          key={index}
          onPress={onPressItem(index)}
          activeOpacity={0.7}
          style={[
            styles.tabItem,
            {
              width: tabWidth,
              marginLeft,
            },
          ]}>
          <Text style={isActive ? styles.txtActive : styles.txtInactive}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View style={styles.wrapTabs}>
        <Animated.View
          style={[
            styles.pagination,
            {
              width: tabWidth,
              left: positionAnimation,
            },
          ]}
        />
        {tabs.map(renderTab)}
      </View>
    );
  };

  const _renderTabChart = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingTop: 50,
          alignItems: 'center',
          paddingHorizontal: 30,
          paddingBottom: 30,
        }}>
        {_renderTabbarAnimation(['Ngay', 'Tuan', 'Thang'], DEVICE_WIDTH * 0.2)}
        <Image
          source={{
            uri:
              'https://lh6.googleusercontent.com/jrFQEIONAI7ZYizcHeI0im_pF169BfB86T0MWe3uUJf7L65BGSVOf5vHYaQWRAcvguGA08hAOAXP1eLew_1BtsDhXJxkJ_s8Lb-Y_ZxzuZLTSac99kWUWkmEJWDBSkocMqFdCEKkppHAba36FLqw3En1JdOI93p0MMCOEWqcm8vzu02JCUX3cbpPsQRhQk0RV6FRJiIiNSTHm_ADG24XG6Qhx5jL2ytwicNijg=w512',
          }}
          style={{width: DEVICE_WIDTH * 0.3, height: DEVICE_WIDTH * 0.3}}
        />
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Hay dong bo du lieu buoc chan de theo doi suc khoe cua ban
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 10,
            backgroundColor: GREEN_COLOR_4,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
          onPress={() => {
            console.log('click');
            navigation.push('tmpScreen');
          }}>
          <Text style={{fontWeight: 'bold', color: 'white'}}>Dong bo</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const _renderEvent = () => {
    const _renderItem = (uri, des) => {
      return (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
          <Image source={{uri: uri}} style={{height: 30, width: 30}} />
          <Text>{des}</Text>
        </View>
      );
    };
    return (
      <View
        style={{
          marginTop: 10,
          backgroundColor: 'white',
          marginHorizontal: padding,
        }}>
        <Image
          source={{
            uri:
              'https://img.mservice.io/momo_app_v2/new_version/img/Product_Engagement/20200921_walk_event_uprace_greenviet_banner.png',
          }}
          style={{
            height: (DEVICE_WIDTH - 2 * padding) * 0.4,
            width: DEVICE_WIDTH - 2 * padding,
          }}
        />
        <Text style={{fontWeight: 'bold', fontSize: 17, margin: 10}}>
          Day la ten su kien
        </Text>
        {_renderItem(
          'https://lh5.googleusercontent.com/2gYv0YNO8_Rvga8rttghz-9PtVgbgssIZy2lrhEGWqhRymSmRTay23zDeT1qqcssAS4v_NcanjwRGaLEWPHZr4pWRZXRPgbnZnbwTLPgtq6UsODqI88MCsLYTcODBUk6x-AfsFXrTJUUfSD4i-3PMenuLaGapmXq3Bl0nHQyqHtBAoSivzoxsN_EtasIh-2LI0UIR6ONLOEmnEXfpZchYVw=w512',
          '21/21 - 21/21/2121',
        )}
        {_renderItem(
          'https://lh6.googleusercontent.com/bexunOOQOaSNPIKOnir8jCc2sEtcKGdBP_yDbgsOK51UJ8yg6parRAJUILfgHKfm8zsdBTVEzffcn1SGpIoa1gVmYmgc-G1Lluo6Ug3vmJTKwdXV9qQ3-Hm8SxS70ypFmATB1eeuONVCbkOKOurK13cPGrgTPGk8fOg-E_0weRK9MqXSDOqn_RtiNAMR88fHh5Bh3N_vsdve9ILpcWHEkQBbXQ=w512',
          'Day la ve phan thuong',
        )}
        {_renderItem(
          'file:///Users/lam.nguyen5/Dev/RnWeb/src/assets/images/ic_target.png',
          'Day la mo ta chi tiet',
        )}
        <Text style={{margin: 10, color: '#2f2f2f90', fontSize: 12}}>
          109090 nguoi tham gia
        </Text>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: (DEVICE_WIDTH - padding * 2) * 0.25,
              borderRadius: 10,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: GREEN_COLOR,
            }}>
            <Text
              style={{fontWeight: 'bold', fontSize: 17, color: GREEN_COLOR}}>
              Chi tiet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 5,
              width: (DEVICE_WIDTH - padding * 2) * 0.65,
              paddingHorizontal: 60,
              borderRadius: 10,
              backgroundColor: GREEN_COLOR,
              borderWidth: 1,
              borderColor: GREEN_COLOR,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 17, color: 'white'}}>
              Tham gia
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const _renderFooter = () => {
    return (
      <View style={{alignItems: 'center', marginBottom: 100}}>
        <Image
          source={{
            uri:
              'https://lh6.googleusercontent.com/XGM0w19RHdPufYvht110BPkuofFqOpexdYNJhQBXndyLULvF6wnqhnhHK8ncpGrogvoE60260CF_wFPQiNx_LAEgW_5UXm01lWIiqgvgqGBXFcW1gjSL0BBuBCzY6mmcM3s8F8YaHID1rAV1qjinjMAH7ZlvkqlbbuoKdJk-nOv5x92M6CW3dqdKM09yfQhjBvKsg6ycQ9rIkdliAe8SmwmmXvkQaWtZW1GCmWw=w512',
          }}
          style={{height: DEVICE_WIDTH * 0.4, width: DEVICE_WIDTH * 0.4}}
        />
        <Text style={{fontSize: 12, color: '#2f2f2f90'}}>
          Ban da xem het roi
        </Text>
      </View>
    );
  };

  const _renderRankingBoard = () => {
    const uri = [
      'https://lh3.googleusercontent.com/J_X7xt8C9ayOUf3jSX_934KGUFlZecApGUTVSgq2qqb5r788jV4w4SckxzLIwmEZ4jAK8iCmtR7HcGFzzCJOdD4hNpetZvP8nHFp6We0ik7xdF4yI9o40HAI5K-wSDlzrOzwa78OEjuxT7ujZ6g8ktrUks2lSblnQj5FhfLW3tmf76e2bcVIqAugkLMB0ZGuTjmfyiDAU54Q-Aew7fe6_0Q5=w512',
      'https://lh4.googleusercontent.com/pK9KShH_DakjGyyV7cHq1pLCDJu6JbygCvcwdWf8iX0mlFzAEHAm-f6E6l1gzCZ5IEwdqUaRceLywTgSbg1fVMMOop2bpx99kOzvmMKPtduSOOukgqT8n7xJmKv3fzJ8KkjPzCkngMlALKCwM0ZpSlPE4pj0l5uUiK3UInGw7Jy7ID4Heh45Ocq3eOuR4s1_yzkzXyoXn3FqTducyXQofLDV94cF0As=w512',
      'https://lh5.googleusercontent.com/9dj1E5cGWry10y7KaApN5Otvt_8igukkeH05cB2kzICVLyhXskVYnjsC4lCpOGKg1rLqV6TjMTczkGJ1pAouQho6cpYwjm2Ilir9r-uLv4laX_DbbJnAZfvZFgd4D_S2JsaH3ADriVi0C_b44sswbmqWHUMn-yB0-_lRMWIM2f8CVkKs71V_bzFJ2tx--KjCIowhh7_cuftW0yemqXjPDW7rB4QyknOx=w512',
    ];
    const _renderItemRanking = (info) => {
      return (
        <View
          style={{
            height: 70,
            alignItems: 'center',
            padding: 10,
            flexDirection: 'row',
          }}>
          {info.pos > 3 ? (
            <View
              style={{
                backgroundColor: '#2f2f2f20',
                width: 30,
                height: 30,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 12}}>{info?.pos}</Text>
            </View>
          ) : (
            <Image
              source={{uri: uri[info.pos - 1]}}
              style={{
                width: 30,
                height: 30,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}

          <Image
            source={{
              uri:
                'https://lh6.googleusercontent.com/z9NP1Fj6_tHjlgG9fz63HLwUtyEsmwru33VuZPZP6a1L5XdUyxzbCLf5M0BK5q5O1AiFAKGWgr8Ye7oGF5Y_qA_WFVTN4NV_5hJKLFOXJfWQTToYe2I_mApnVWnPyoR3DHE7yiCDRr-KVVTwt-IndiW-UMz-tf7zeNPBJkFiIA8dCvzD6g2cZ2LdsTZTZM3ch2lEA7piVUYC8pn8rfSxviqIVGmfN7s=w512',
            }}
            style={{width: 50, height: 50, marginLeft: 10}}
          />
          <Text
            style={{
              flex: 0.9,
              marginLeft: 10,
              fontSize: 17,
            }}>
            {info.name}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            {info.steps}
          </Text>
          <Image
            source={{
              uri:
                'https://lh5.googleusercontent.com/qt_bDLUthJ931HEp_ST1wrdJDGeJsKtqJ-B2t5uGHsQK435gENLWjE5ekx_WTRpoxbWuEKT7t3XchmffbTW6tBeKNN6KEzMHFX3j9G-f7IDpkFK4T1Ze7GLlPDZIEdA-n9EsLIOLFDG_uyTk05lxLb7nhq0wamwqMmTaoYYxu9aB3ezVhyfpH_wBlLaVpHbk7p1IaoVmJvhmF_uxIF0u5m9fF-1En8kLqCVvRvn4rw=w512',
            }}
            style={{width: 20, height: 20}}
          />
        </View>
      );
    };
    return (
      <View style={{marginHorizontal: padding, marginTop: 20}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, marginLeft: 10}}>
          Bang xep hang thang nay
        </Text>
        {_renderItemRanking({pos: 1, name: 'Lam Nguyen', steps: '70000'})}
        {_renderItemRanking({pos: 2, name: 'Lam Nguyen', steps: '60000'})}
        {_renderItemRanking({pos: 3, name: 'Lam Nguyen', steps: '50000'})}
        {_renderItemRanking({pos: 4, name: 'Lam Nguyen', steps: '40000'})}
        {_renderItemRanking({pos: 5, name: 'Lam Nguyen', steps: '30000'})}
        {_renderItemRanking({pos: 6, name: 'Lam Nguyen', steps: '20000'})}
        {_renderItemRanking({pos: 7, name: 'Lam Nguyen', steps: '10000'})}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {_renderUserInfo()}
        {_renderTabChart()}
        {_renderEvent()}
        {_renderEvent()}
        {_renderEvent()}
        {_renderRankingBoard()}
        {_renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 1,

    shadowColor: '#2f2f2f',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  containerUserInfo: {
    backgroundColor: 'white',
    paddingTop: DEVICE_WIDTH * 0.02,
    paddingHorizontal: DEVICE_WIDTH * 0.02,
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
  txtActive: {
    color: BLACK_COLOR,
    fontWeight: 'bold',
  },
  txtInactive: {
    color: GRAY_COLOR,
  },
  tabItem: {
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapTabs: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    backgroundColor: GRAY_COLOR_4,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 24,
  },
  pagination: {
    height: 30,
    borderRadius: 15,
    backgroundColor: GRAY_COLOR_6,
    position: 'absolute',
  },
});

export default navigationContainer;
