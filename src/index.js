/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import EventDetail from './screens/EventDetail';
import HeroTeam from './screens/HeroTeam';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => HeroTeam);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
