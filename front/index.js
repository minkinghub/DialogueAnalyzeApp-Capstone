/**
 * @format
 * 커밋용
 */

import {AppRegistry} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import Home from './mainPage/Home';
import Analyze from './analyzePage/Analyze';

AppRegistry.registerComponent(appName, () => App);