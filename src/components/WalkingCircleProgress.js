/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  CircularProgress,
  Image,
  Text,
  ScaleSize,
} from '@momo-platform/component-kits';
import images from '../assets/images';
import {
  GREEN_COLOR,
  PRIMAY_COLOR,
  ORANGE_COLOR,
  YELLOW_COLOR,
  GREEN_COLOR_3,
  GREEN_COLOR_4,
  BLACK_COLOR,
  LINE_COLOR,
  TEXT_COLOR_2,
} from '../utils/Colors';
import NumberUtils from '../utils/NumberUtils';
import Strings from '../utils/Strings';

const GRADIENT_COLOR = [
  {start: ORANGE_COLOR, end: YELLOW_COLOR},
  {start: YELLOW_COLOR, end: ORANGE_COLOR},
  {start: ORANGE_COLOR, end: YELLOW_COLOR},
];

const GRADIENT_COLOR_PASS = [
  {start: GREEN_COLOR_3, end: GREEN_COLOR_4},
  {start: GREEN_COLOR_4, end: GREEN_COLOR_3},
  {start: GREEN_COLOR_3, end: GREEN_COLOR_4},
];

export default class WalkingCircleProgress extends Component {
  constructor(props) {
    super(props);

    this.gradientColor =
      this.props.steps >= this.props.target
        ? GRADIENT_COLOR_PASS
        : GRADIENT_COLOR;

    this.firstBeginColor = this.gradientColor[0].start;
    this.firstEndColor = this.gradientColor[0].end;
    this.secondBeginColor = this.gradientColor[0].start;
    this.secondEndColor = this.gradientColor[0].end;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.steps !== this.props.steps ||
      nextProps.target !== this.props.target
    ) {
      this.gradientColor =
        nextProps.steps >= nextProps.target
          ? GRADIENT_COLOR_PASS
          : GRADIENT_COLOR;

      this.firstBeginColor = this.gradientColor[0].start;
      this.firstEndColor = this.gradientColor[0].end;
      this.secondBeginColor = this.gradientColor[0].start;
      this.secondEndColor = this.gradientColor[0].end;
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getFormatDate() {
    let {date} = this.props;
    if (!date) {
      return null;
    }
    let d = new Date();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let day = d.getDate();
    let listdates = date.split('/');
    let isOtherDate =
      listdates &&
      listdates.length > 2 &&
      day === Number(listdates[0]) &&
      month === Number(listdates[1]) &&
      year === Number(listdates[2]);
    if (!isOtherDate) {
      return `${listdates[0]}/${listdates[1]}`;
    }
    return null;
  }

  render() {
    let round = Math.floor(this.props.progress / 100);
    if (round === 0) {
      this.firstBeginColor = this.gradientColor[0].start;
      this.firstEndColor = this.gradientColor[0].end;
      this.secondBeginColor = this.gradientColor[0].start;
      this.secondEndColor = this.gradientColor[0].end;
    } else if (round === 1) {
      this.firstBeginColor = this.gradientColor[0].start;
      this.firstEndColor = this.gradientColor[0].end;
      this.secondBeginColor = this.gradientColor[1].start;
      this.secondEndColor = this.gradientColor[1].end;
    } else if (round % 2 === 0) {
      this.firstBeginColor = this.gradientColor[1].start;
      this.firstEndColor = this.gradientColor[1].end;
      this.secondBeginColor = this.gradientColor[2].start;
      this.secondEndColor = this.gradientColor[2].end;
    } else {
      this.firstBeginColor = this.gradientColor[2].start;
      this.firstEndColor = this.gradientColor[2].end;
      this.secondBeginColor = this.gradientColor[1].start;
      this.secondEndColor = this.gradientColor[1].end;
    }

    return (
      <View style={{paddingVertical: 10}}>
        <View style={{alignItems: 'center'}}>
          <CircularProgress
            style={{transform: [{scaleX: -1}]}} // Flip Circle
            size="giant"
            width={5}
            fill={this.props.progress}
            preprogress={0}
            beginColor={this.firstBeginColor}
            endColor={this.firstEndColor}
            segments={36}
            backgroundColor="rgba(0, 0, 0, 0.15)"
            linecap="round"
            centerComponent={this._renderContent()}
          />

          {!!(this.props.progress > 100) && (
            <CircularProgress
              style={styles.circularProgress}
              size="giant"
              width={5}
              fill={this.props.progress - 100 * round}
              preprogress={0}
              beginColor={this.secondBeginColor}
              endColor={this.secondEndColor}
              segments={36}
              backgroundColor="rgba(0, 0, 0, 0.0)"
              linecap="round"
              centerComponent={<View />}
            />
          )}
        </View>
      </View>
    );
  }

  _renderContent = () => {
    const steps = this.props.steps || 0;
    const target = this.props.target || 0;
    const isAchieve = steps >= target;
    const iconRun = isAchieve
      ? images.ic_shoe_small_green
      : images.ic_shoe_small_gray;
    const color = isAchieve ? GREEN_COLOR : PRIMAY_COLOR;

    return (
      <View style={styles.centerAbsolute}>
        <Circle size={120} color="#f9f8f7">
          <Circle size={110} color="#edf4e3">
            <Image
              source={iconRun}
              style={{width: 25, height: 25, marginBottom: 4}}
            />
            <Text style={styles.txtMini}>{Strings.today}</Text>
            <Text.Title style={[styles.textSteps, {color}]}>
              {NumberUtils.formatNumberToMoney(steps, '0', '')}
            </Text.Title>
            <View
              style={[
                styles.line,
                {
                  width: this.props.lineWidth,
                },
              ]}
            />
            <Text style={styles.txtMini}>
              {NumberUtils.formatNumberToMoney(target, '0', '')}
            </Text>
          </Circle>
        </Circle>
      </View>
    );
  };
}

const Circle = ({children, size, color}) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  textSteps: {
    color: BLACK_COLOR,
    fontWeight: 'bold',
  },
  txtMini: {
    color: TEXT_COLOR_2,
    fontSize: ScaleSize(11),
  },
  centerAbsolute: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{scaleX: -1}], // Flip Content
  },
  line: {
    backgroundColor: LINE_COLOR,
    height: 1,
    marginVertical: 5,
  },
  row: {flexDirection: 'row'},
  circularProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    transform: [{scaleX: -1}],
  },
  icon: {
    width: 20,
    height: 23,
  },
  txtTarget: {
    color: BLACK_COLOR,
    fontSize: ScaleSize(22),
  },
});
