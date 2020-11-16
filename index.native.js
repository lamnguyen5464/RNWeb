/**
 * @format
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import EventDetail from './src/screens/EventDetail';
import HeroTeam from './src/screens/HeroTeam';
import {name as appName} from './src/app.json';
import MaxApi from '@momo-platform/max-api';
// import {ApplicationStyle} from '@momo-platform/component-kits';

// ApplicationStyle();

class MiniApp extends Component {
  constructor(props) {
    //Warning Don't remove the init if you want call the api
    super(props);
    MaxApi.init(props);
  }

  render() {
    return <App {...this.props} />;
  }
}

AppRegistry.registerComponent(appName, () => App);
