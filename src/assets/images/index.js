const images = {
  avatar: require('./avatar.png'),
  bg_noti_con_pig_money: require('./bg_noti_con_pig_money.png'),
  bg_get_badges: require('./bg_get_badges.png'),
  bg_get_food: require('./bg_get_food.png'),
  default_group_avatar: require('./default_group_avatar.png'),
  ic_back_ios: require('./ic_back_ios.png'),
  ic_back_android: require('./ic_back_android.png'),
  ic_bag_food: require('./ic_bag_food.png'),
  ic_calendar: require('./ic_calendar.png'),
  ic_checked: require('./ic_checked.png'),
  ic_chevron_right: require('./ic_chevron_right.png'),
  ic_close: require('./ic_close.png'),
  ic_close_circle: require('./ic_close_circle.png'),
  ic_contact: require('./ic_contact.png'),
  ic_error: require('./ic_error.png'),
  ic_gift_box: require('./ic_gift_box.png'),
  ic_info: require('./ic_info.png'),
  ic_info_blue: require('./ic_info_blue.png'),
  ic_info_blue_outline: require('./ic_info_blue_outline.png'),
  ic_info_outline: require('./ic_info_outline.png'),
  ic_logo_loading: require('./ic_logo_loading.png'),
  ic_pig_golden: require('./ic_pig_golden.png'),
  ic_piggy_popup: require('./ic_piggy_popup.png'),
  ic_radio_default: require('./ic_radio_default.png'),
  ic_radio_selected: require('./ic_radio_selected.png'),
  ic_ranking_1st: require('./ic_ranking_1st.png'),
  ic_ranking_2nd: require('./ic_ranking_2nd.png'),
  ic_ranking_3rd: require('./ic_ranking_3rd.png'),
  ic_reward: require('./ic_reward.png'),
  ic_share: require('./ic_share.png'),
  ic_shoe_small_gray: require('./ic_shoe_small_gray.png'),
  ic_shoe_small_green: require('./ic_shoe_small_green.png'),
  ic_target: require('./ic_target.png'),
  ic_tick_popup: require('./ic_tick_popup.png'),
  ic_uncheck: require('./ic_uncheck.png'),
  ic_view_more: require('./ic_view_more.png'),
  ic_walking: require('./ic_walking.png'),
  ic_walking_gray: require('./ic_walking_gray.png'),
  ic_walking_green: require('./ic_walking_green.png'),
  ic_walking_sync: require('./ic_walking_sync.png'),
  img_permission_walking_ios_authorization: require('./img_permission_walking_ios_authorization.png'),
  img_walking_info_top_1: require('./img_walking_info_top_1.png'),
  getImage: (imageURL) => {
    if (imageURL && imageURL.indexOf('http') !== -1) {
      let urlStr = imageURL;
      let fileName = urlStr.substring(
        urlStr.lastIndexOf('/') + 1,
        urlStr.length,
      );
      let fileNameWithoutExtension = fileName.substring(
        0,
        fileName.lastIndexOf('.'),
      );

      if (fileNameWithoutExtension && images[fileNameWithoutExtension]) {
        return images[fileNameWithoutExtension];
      } else {
        return {uri: imageURL};
      }
    } else {
      if (images[imageURL]) {
        return images[imageURL];
      } else {
        return images.ic_logo_loading;
      }
    }
  },
};
export default images;
