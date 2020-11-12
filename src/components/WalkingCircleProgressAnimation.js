import React, {PureComponent} from 'react';
import {Animated} from 'react-native';
import WalkingCircleProgress from './WalkingCircleProgress';

const AnimatedProgress = Animated.createAnimatedComponent(
  WalkingCircleProgress,
);
const MAX_CIRCLE = 3;

export default class WalkingCircleProgressAnimation extends PureComponent {
  constructor(props) {
    super(props);
    let steps = this.props.steps || 0;
    let target = this.props.target || 0;
    let date = this.props.date;
    let progress = target > 0 ? (100 * steps) / target : 0;
    if (progress > MAX_CIRCLE * 100) {
      let left = progress - Math.round(progress / 100) * 100;
      progress = (MAX_CIRCLE - 1) * 100 + left;
    }
    this.state = {
      steps,
      progress,
      target,
      date,
      progressAnimation: new Animated.Value(0),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.steps !== this.state.steps ||
      nextProps.target !== this.state.target ||
      nextProps.date !== this.state.date
    ) {
      let steps = nextProps.steps || 0;
      let target = nextProps.target || 0;
      let date = nextProps.date;
      let progress = target > 0 ? (100 * steps) / target : 0;
      if (progress > MAX_CIRCLE * 100) {
        let left = progress - Math.round(progress / 100) * 100;
        progress = (MAX_CIRCLE - 1) * 100 + left;
      }
      this.setState(
        {
          progress,
          steps,
          target,
          date,
          progressAnimation: new Animated.Value(0),
        },
        () => {
          Animated.timing(this.state.progressAnimation, {
            toValue: this.state.progress,
            duration: 2000,
          }).start();
        },
      );
    }
  }

  componentDidMount() {
    Animated.timing(this.state.progressAnimation, {
      toValue: this.state.progress,
      duration: 2000,
    }).start();
  }

  render() {
    return (
      <AnimatedProgress
        steps={this.state.steps || 0}
        date={this.state.date}
        target={this.state.target || 0}
        progressSize={this.props.progressSize || 0}
        lineWidth={this.props.lineWidth || 0}
        progress={this.state.progressAnimation || 0}
      />
    );
  }
}
