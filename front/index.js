/**
 * @format
 * 커밋용
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NonMemberLogin from './login/NonMemberLogin';
import Home from './mainPage/Home';
import Analyze from './analyzePage/Analyze';
import KakaoLoginTest from './login/KakaoLoginTest'

AppRegistry.registerComponent(appName, () => App);