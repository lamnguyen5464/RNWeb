/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import EventDetail from './screens/EventDetail';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
