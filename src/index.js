/**
 * @format
 */
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import MaxApi from '@momo-platform/max-api';
const app = require('./app.json');
// import {ApplicationStyle} from '@momo-platform/component-kits';

// ApplicationStyle();

class MiniApp extends Component {
  constructor(props) {
    //Warning Don't remove the init if you want call the api
    super(props);
    MaxApi.init(app);
  }

  render() {
    return <App {...this.props} />;
  }
}

AppRegistry.registerComponent(appName, () => MiniApp);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
