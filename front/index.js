/**
 * @format
 * 커밋용
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Login from './login/Login';
import SignUp from './login/SignUp';
import FindId from './login/FindId';
import FindPw from './login/FindPw';
import Board from './noticeBoard/Board';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
