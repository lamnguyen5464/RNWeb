import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {Image, Text} from '@momo-platform/component-kits';
// import {CornerStone} from '@momo-platform/momo-cornerstone';
// import WalkingCircleProgressAnimation from '../components/WalkingCircleProgressAnimation';
// import {NavigatorAction} from '../screens/Walking';
// import WalkingUserInfoPopup from '../components/WalkingUserInfoPopup';
// import WalkingContext from '../components/WalkingContext';
// import RewardsItem from '../components/RewardsItem';
import images from '../assets/images';
import {BLACK_COLOR} from '../utils/Colors';
// import {
//   WALKING_INFO_MSG_V3,
//   USER_TARGET_BY_STATISTICAL_DATE_WALKING,
//   WALKING_ERROR_EVENT,
// } from '../utils/EventTypes';
// import WalkingHelper from '../api/WalkingHelper';
// import {getAvatarUrlById, formatPhone} from '../utils';
// import {AppConfig} from '../App';
// import MaxApi from '@momo-platform/max-api';
// import {WALKING_EVENT_NAME} from '../utils/Const';
// import Strings from '../utils/Strings';

const WalkingUserInfo = ({onDone = () => {}}) => {
  //   const {walkingGranted} = useContext(WalkingContext);
  //   const avatar = getAvatarUrlById(AppConfig.USER_PROFILE.userId);
  //   const [walkingInfo, setWalkingInfo] = useState({});
  //   let TIME_OUT;

  //   useEffect(() => {
  //     WalkingHelper.getWalkingInfo()
  //       .then(({result, momoMsg}) => {
  //         if (!result) {
  //           DeviceEventEmitter.emit(WALKING_ERROR_EVENT, WALKING_INFO_MSG_V3);
  //         }
  //         if (result && momoMsg) {
  //           setWalkingInfo(momoMsg);
  //         }
  //         TIME_OUT && clearTimeout(TIME_OUT);
  //         TIME_OUT = setTimeout(() => {
  //           onDone(result);
  //         }, 100);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         DeviceEventEmitter.emit(WALKING_ERROR_EVENT, WALKING_INFO_MSG_V3);
  //       });

  //     return () => {
  //       TIME_OUT && clearTimeout(TIME_OUT);
  //     };
  //   }, [walkingGranted]);

  //   const onPressUser = useCallback(() => {
  //     // MaxApi.trackEvent(WALKING_EVENT_NAME, {
  //     //   action: 'click_main_profile',
  //     // });
  //     // NavigatorAction?.show({
  //     //   screen: WalkingUserInfoPopup,
  //     //   params: {
  //     //     userId: formatPhone(AppConfig.USER_PROFILE.userId, 11),
  //     //     avatar: avatar,
  //     //     name: AppConfig.USER_PROFILE.name,
  //     //   },
  //     // });
  //     // PopupManager.showPopup(<WalkingUserInfoPopup avatar={avatar} name={name} />);
  //   }, [walkingInfo]);

  //   const {walkStepDay, target} = walkingInfo || {};
  //   const {name} = AppConfig.USER_PROFILE;

  return (
    <>
      {/* <CornerStone index={0} tag={'Walking'} data={{ref_id: 'Walking'}} /> */}
      <View style={styles.container}>
        <TouchableOpacity onPress={onPressUser} style={styles.left}>
          <Image source={images.avatar} style={styles.imgAvatar}>
            <Image
              source={avatar ? images.getImage(avatar) : images.avatar}
              style={styles.imgAvatar}
            />
          </Image>
          <Text.Title style={styles.txtUserName}>{name}</Text.Title>
        </TouchableOpacity>
        {/* <View style={styles.wrapBottom}>
          <WalkingCircleProgressAnimation
            steps={walkStepDay}
            target={target || 0}
            progressSize={120}
            lineWidth={50}
          />
          <TargetRewards walkStepDay={walkStepDay} /> */}
        {/* </View> */}
      </View>
    </>
  );
};

// const TargetRewards = ({walkStepDay}) => {
//   const [targetRewards, setTargetRewards] = useState([]);
//   useEffect(() => {
//     WalkingHelper.getUserTarget(({result, momoMsg}) => {
//       if (!result) {
//         // MomoReactToNative.sendBroadCast(
//         //     WALKING_ERROR_EVENT,
//         //     USER_TARGET_BY_STATISTICAL_DATE_WALKING
//         // );
//         DeviceEventEmitter.emit(
//           WALKING_ERROR_EVENT,
//           USER_TARGET_BY_STATISTICAL_DATE_WALKING,
//         );
//       }
//       if (result && momoMsg?.targetRewards?.length) {
//         setTargetRewards(momoMsg.targetRewards);
//       }
//     });
//     return () => {};
//   }, []);

//   const renderItem = (item, index) => {
//     const isLastItem = index === targetRewards.length - 1;
//     const isFirstItem = index === 0;
//     return (
//       <RewardsItem
//         item={item}
//         key={index}
//         isLastItem={isLastItem}
//         walkStepDay={walkStepDay}
//         isFirstItem={isFirstItem}
//         targetRewards={targetRewards}
//         index={index}
//       />
//     );
//   };

//   return <View style={styles.wrapTarget}>{targetRewards.map(renderItem)}</View>;
// };

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  txtUserName: {
    color: BLACK_COLOR,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  left: {flexDirection: 'row', alignItems: 'center'},
  imgAvatar: {width: 36, height: 36, borderRadius: 36 / 2},
  wrapBottom: {paddingTop: 16, flexDirection: 'row'},
  wrapTarget: {
    marginLeft: 12,
    flex: 1,
  },
});

export default React.memo(WalkingUserInfo);
